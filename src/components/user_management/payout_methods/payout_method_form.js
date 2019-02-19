import React, { Component } from 'react';

import FormRow from '../../miscellaneous/forms/form_row';
import LocalizationService from '../../../shared/libraries/localization_service';

export default class PayoutMethodForm extends Component {
  constructor(props) {
    super(props);

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

    if (props.configuration) {
      if (props.configuration.payment_countries) {
        this.payment_countries = props.configuration.payment_countries.map(country => ({
          value: country.alpha2,
          label: country.name
        }));
      }
    }
  }

  render() {
    return (
      <form onSubmit={ this.props.addPaymentSource } >
        <div className='col-xs-12 no-side-padding'>
          <FormRow type='select' options={ this.payment_countries } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.country') } value={ this.props.country } handleChange={ this.props.handleCountryChange } />
          <FormRow type='text' placeholder={ LocalizationService.formatMessage('user_profile_verified_info.iban') } value={ this.props.iban } handleChange={ this.props.handleIBANChange } />
        </div>
      </form>
    );
  }
}
