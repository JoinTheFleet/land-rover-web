import React, { Component } from 'react';

import FormRow from '../form_row';
import stripeImage from '../../../../assets/images/stripe.png';
import LocalizationService from '../../../../shared/libraries/localization_service';
import PayoutMethodsService from '../../../../shared/services/payout_methods_service';

import Alert from 'react-s-alert';

import { injectStripe } from 'react-stripe-elements';

class PayoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.addPaymentSource = this.addPaymentSource.bind(this);
    this.handleIBANChange = this.handleIBANChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);

    this.setCountries = this.setCountries.bind(this);

    this.setCountries(props);
  }

  componentDidUpdate() {
    this.setCountries();
  }

  setCountries(props) {
    if (!props) {
      props = this.props;
    }

    if (!this.payment_countries) {
      this.payment_countries = [];
    }

    if (props.configurations) {
      if (props.configurations.payment_countries) {
        this.payment_countries = props.configurations.payment_countries.map(country => ({
          value: country.alpha2,
          label: country.name
        }));
      }
    }
  }

  handleIBANChange(event) {
    this.setState({ iban: event.target.value });
  }

  handleCountryChange(country) {
    this.setState({ country: country.value });
  }

  addPaymentSource(event) {
    if (event) {
      event.preventDefault();
    }

    if (!this.state.country) {
      Alert.error(LocalizationService.formatMessage('user_profile_verified_info.payout_method_enter_country'));
      return;
    }

    let currency = this.state.country === 'US' ? 'USD' : 'EUR';

    this.props.loading(true, () => {
      this.props.stripe.createToken('bank_account', {
        country: this.state.country,
        account_number: this.state.iban,
        currency: currency
      })
      .then((token) => {
        if (!token) {
          this.props.loading(false);
        }
        else if (token.error) {
          this.props.loading(false);
          Alert.error(LocalizationService.formatMessage('user_profile_verified_info.payout_method_invalid_account'));
        }
        else if (token.token.id) {
          PayoutMethodsService.create({
            payout_method: {
              token: token.token.id
            }
          }).then(response => {
            Alert.success(LocalizationService.formatMessage('user_profile_verified_info.payout_method_success'));
            this.setState({
              payoutDetailsAdded: true
            }, () => { this.props.saveUser(true) })
          }).catch((error) => {
            this.props.loading(false);
            if (error.response) {
              Alert.error(error.response.data.message);
            }
          });
        }
      })
      .catch(() => {
        this.props.loading(false);
        Alert.error(LocalizationService.formatMessage('user_profile_verified_info.payout_method_error'));
      });
    });
  }

  render() {
    return (
      <div className='payout-form'>
        <div className='col-xs-12 no-side-padding'>
          <FormRow type='select' className='iban-country' clearable={ false } value={ this.state.country } handleChange={ this.handleCountryChange } options={ this.payment_countries } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.country') } />
          <FormRow type='text' className='iban-number' disabled={ this.state.payoutDetailsAdded } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.iban') } value={ this.state.iban } handleChange={ this.handleIBANChange } />
        </div>
        <button className='btn button round form-button col-xs-12' hidden={ this.state.payoutDetailsAdded } onClick={ this.addPaymentSource }>
          { LocalizationService.formatMessage('user_verification.verify') }
        </button>
        <button className='btn button round form-button success col-xs-12' disabled={ true } hidden={ !this.state.payoutDetailsAdded }>
          { LocalizationService.formatMessage('user_verification.confirmed') }
        </button>

        <div className='stripe-logo'>
          <img src={ stripeImage } alt='stripe' />
        </div>
      </div>
    );
  }
}

export default injectStripe(PayoutForm)