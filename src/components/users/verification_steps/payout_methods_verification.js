import React, { Component } from 'react';

import PayoutForm from './stripe/payout_form';
import LocalizationService from '../../../shared/libraries/localization_service';

export default class PayoutMethodsVerification extends Component {
  verified() {
    let user = this.props.user;

    return user && !user.verifications_required.bank_account && !user.owner_verifications_required.bank_account;
  }

  title() {
    return LocalizationService.formatMessage("user_verification.payout_details");
  }

  render() {
    return (
      <div className='col-xs-12 verification-form'>
        <PayoutForm {...this.props} />
      </div>
    );
  }
}