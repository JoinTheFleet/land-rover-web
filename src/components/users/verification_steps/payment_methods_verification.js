import React, { Component } from 'react';

import PaymentForm from './stripe/payment_form';
import LocalizationService from '../../../shared/libraries/localization_service';

export default class PaymentMethodsVerification extends Component {
  verified() {
    let user = this.props.user;

    return user && !user.verifications_required.payment_method && !user.owner_verifications_required.payment_method;
  }

  title() {
    return LocalizationService.formatMessage("user_verification.payment_details");
  }

  render() {
    return (
      <div className='col-xs-12 verification-form'>
        <PaymentForm {...this.props} />
      </div>
    );
  }
}