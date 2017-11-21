import React, { Component } from 'react';
import Alert from 'react-s-alert';

import UsersService from '../../shared/services/users/users_service';
import PayoutMethodsService from '../../shared/services/payout_methods_service';
import LocalizationService from '../../shared/libraries/localization_service';
import Loading from '../miscellaneous/loading';
import Button from '../miscellaneous/button';
import Placeholder from '../miscellaneous/placeholder';
import FormPanel from '../miscellaneous/forms/form_panel';
import {injectStripe } from 'react-stripe-elements';
import PayoutMethod from './payout_methods/payout_method';
import PayoutMethodForm from './payout_methods/payout_method_form';

import { Redirect } from 'react-router-dom';

class UserPayoutMethods extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sources: [],
      loading: false,
      accountLoading: false,
      iban: undefined,
      country: undefined
    }

    this.reloadData = this.reloadData.bind(this);
    this.addPayoutSource = this.addPayoutSource.bind(this);
    this.handleIBANChange = this.handleIBANChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
  }

  handleIBANChange(event) {
    this.setState({ iban: event.target.value });
  }

  handleCountryChange(country) {
    this.setState({ country: country.value });
  }

  componentWillMount() {
    this.setState({ loading: true }, () => {
      UsersService.show('me')
                  .then(response => {
                    let user = response.data.data.user;

                    this.setState({
                      user: user
                    }, this.reloadData);
                  });
    });
  }

  reloadData() {
    this.setState({
      loading: true
    }, () => {
      PayoutMethodsService.index()
                           .then(response => {
                             this.setState({
                               sources: response.data.data.payout_methods,
                               accountLoading: false,
                               loading: false
                             });
                           })
                           .catch(error => {
                             Alert.error(error.response.data.message);
                             this.setState({
                               loading: false,
                               loadError: true
                             });
                           });
     });
  }

  addPayoutSource(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      accountLoading: true
    }, () => {
      let currency = this.state.country === 'US' ? 'USD' : 'EUR';

      this.props.stripe.createToken('bank_account', {
        country: this.state.country,
        account_number: this.state.iban,
        currency: currency
      })
      .then((token) => {
        if (token.error) {
          Alert.error(LocalizationService.formatMessage('user_profile_verified_info.payout_method_invalid_account'));
          this.setState({ accountLoading: false });
        }
        else if (token.token.id) {
          PayoutMethodsService.create({
            payout_method: {
              token: token.token.id
            }
          }).then(response => {
            Alert.success(LocalizationService.formatMessage('user_profile_verified_info.payout_method_success'));
            this.reloadData();
          });
        }
      })
      .catch((error) => {
        Alert.error(LocalizationService.formatMessage('user_profile_verified_info.payout_method_error'));
        this.setState({
          accountLoading: false
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    else if (this.state.loadError) {
      return <Redirect to='/account/verified_info' />
    }
    else {
      let payoutMethods = (<Placeholder />);

      if (this.state.sources.length > 0) {
        payoutMethods = this.state.sources.map((source, index) => {
          return <PayoutMethod key={ source.id } source={ source } reloadData={ this.reloadData } isDefault={ false }/>;
        })
      }

      return (
        <div className="col-xs-12 no-side-padding">
          <FormPanel title={ LocalizationService.formatMessage('user_profile_verified_info.payout_methods') } >
            { payoutMethods }
          </FormPanel>

          <FormPanel title={ LocalizationService.formatMessage('user_profile_verified_info.add_account') } >
            <PayoutMethodForm iban={ this.state.iban } country={ this.state.country } handleIBANChange={ this.handleIBANChange } handleCountryChange={ this.handleCountryChange }/>
          </FormPanel>

          <div className='col-xs-12 no-side-padding'>
            <Button className="btn btn-primary text-center col-xs-12 col-sm-3 pull-right"
                    spinner={ this.state.accountLoading }
                    disabled={ this.state.accountLoading }
                    onClick={ this.addPayoutSource } >
              { LocalizationService.formatMessage('application.save') }
            </Button>
          </div>
        </div>
      )
    }
  }
}

export default injectStripe(UserPayoutMethods)
