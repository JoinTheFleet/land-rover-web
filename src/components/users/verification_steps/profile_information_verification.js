import React, { Component } from 'react';

import FormRow from './form_row';
import LocalizationService from '../../../shared/libraries/localization_service';


export default class ProfileInformationVerification extends Component {
  constructor(props) {
    super(props);

    this.genderOptions = [
      { value: 'male', label: LocalizationService.formatMessage('user_profile_verified_info.gender.male') },
      { value: 'female', label: LocalizationService.formatMessage('user_profile_verified_info.gender.female') }
    ];
  }

  verified() {
    let user = this.props.user;

    if (user) {
      return user.first_name && user.first_name.length > 0 &&
             user.last_name && user.last_name.length > 0 &&
             user.gender && user.gender.length > 0;
    }

    return false;
  }

  title() {
    return LocalizationService.formatMessage("user_verification.profile_information");
  }

  render() {
    return (
      <div className='col-xs-12 verification-form'>
        <FormRow type='text' id='user-first-name' value={ this.props.user.first_name } handleChange={ (event) => { this.props.updateUserField('first_name', event.target.value) } } placeholder={ LocalizationService.formatMessage('user_profile.first_name') } />
        <FormRow type='text' id='user-last-name' value={ this.props.user.last_name } handleChange={ (event) => { this.props.updateUserField('last_name', event.target.value) } } placeholder={ LocalizationService.formatMessage('user_profile.last_name') } />
        <FormRow type='select' id='user-gender' clearable={ false } value={ this.props.user.gender } handleChange={ (value) => { this.props.updateUserField('gender', value.value) } } options={ this.genderOptions } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.gender') } />
        <FormRow type='textarea' id='user-description' value={ this.props.user.description ? this.props.user.description : '' } handleChange={ (event) => { this.props.updateUserField('description', event.target.value) } } placeholder={ LocalizationService.formatMessage('user_profile.description') } />
      </div>
    );
  }
}