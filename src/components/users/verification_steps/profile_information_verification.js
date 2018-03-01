import React, { Component } from 'react';

import FormRow from './form_row';
import LocalizationService from '../../../shared/libraries/localization_service';


export default class ProfileInformationVerification extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  verified() {
    return true;
  }

  title() {
    return LocalizationService.formatMessage("user_verification.profile_information");
  }

  render() {
    return (
      <div className='col-xs-12 verification-form'>
        <FormRow type='text' id='user-first-name' value={ this.props.user.first_name } handleChange={ this.props.handleFirstNameUpdate } placeholder={ LocalizationService.formatMessage('user_profile.first_name') } />
        <FormRow type='text' id='user-last-name' value={ this.props.user.last_name } handleChange={ this.props.handleLastNameUpdate } placeholder={ LocalizationService.formatMessage('user_profile.last_name') } />
        <FormRow type='textarea' id='user-description' value={ this.props.user.description ? this.props.user.description : '' } handleChange={ this.props.handleDescriptionUpdate } placeholder={ LocalizationService.formatMessage('user_profile.description') } />
      </div>
    );
  }
}
