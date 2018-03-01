import React, { Component } from 'react';
import LocalizationService from '../../../shared/libraries/localization_service';


export default class VerifiedInformationVerification extends Component {
  verified() {
    return true;
  }

  title() {
    return LocalizationService.formatMessage('user_verification.verified_information');
  }

  render() {
    return (<div>VerifiedInformationVerification</div>);
  }
}
