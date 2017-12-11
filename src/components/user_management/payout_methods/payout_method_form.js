import React, { Component } from 'react';

import FormRow from '../../miscellaneous/forms/form_row';
import LocalizationService from '../../../shared/libraries/localization_service';

export default class PayoutMethodForm extends Component {
  render() {
    return (
      <form onSubmit={ this.props.addPaymentSource } >
        <div className='col-xs-12 no-side-padding'>
          <FormRow type='country' placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.country') } value={ this.props.country } handleChange={ this.props.handleCountryChange } />
          <FormRow type='text' placeholder={ LocalizationService.formatMessage('user_profile_verified_info.iban') } value={ this.props.iban } handleChange={ this.props.handleIBANChange } />
        </div>
      </form>
    );
  }
}
