import React, { Component } from 'react';

import FormRow from './form_row';
import LocalizationService from '../../../shared/libraries/localization_service';

import Alert from 'react-s-alert';
import moment from 'moment';

export default class ProfileInformationVerification extends Component {
  constructor(props) {
    super(props);

    this.genderOptions = [
      { value: 'male', label: LocalizationService.formatMessage('user_profile_verified_info.gender.male') },
      { value: 'female', label: LocalizationService.formatMessage('user_profile_verified_info.gender.female') }
    ];

    this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this);
  }

  verified() {
    let user = this.props.user;

    if (user) {
      return user.first_name && user.first_name.length > 0 &&
             user.last_name && user.last_name.length > 0 &&
             user.gender && user.gender.length > 0 &&
             user.date_of_birth;
    }

    return false;
  }

  title() {
    return LocalizationService.formatMessage("user_verification.profile_information");
  }

  handleDateOfBirthChange(event) {
    let date = moment(event.target.value, 'DD/MM/YYYY').utc();

    if (event.target.value.length === 10) {
      if (date.isAfter(moment().startOf('day'))) {
        Alert.error(LocalizationService.formatMessage('user_profile_verified_info.previous_date_of_birth'));
      }
      else {
        this.props.updateUserField('date_of_birth', date.unix());
      }
    }
  }

  render() {
    return (
      <div className='col-xs-12 verification-form'>
        <FormRow type='text' id='user-first-name' value={ this.props.user.first_name } handleChange={ (event) => { this.props.updateUserField('first_name', event.target.value) } } placeholder={ LocalizationService.formatMessage('user_profile.first_name') } />
        <FormRow type='text' id='user-last-name' value={ this.props.user.last_name } handleChange={ (event) => { this.props.updateUserField('last_name', event.target.value) } } placeholder={ LocalizationService.formatMessage('user_profile.last_name') } />
        <FormRow type='select' id='user-gender' clearable={ false } value={ this.props.user.gender } handleChange={ (value) => { this.props.updateUserField('gender', value.value) } } options={ this.genderOptions } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.gender') } />
        <FormRow type='cleavedate' id='user-dateofbirth' handleChange={ this.handleDateOfBirthChange } value={ this.props.user.date_of_birth ? moment.unix(this.props.user.date_of_birth).format('DD/MM/YYYY') : undefined } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.date_of_birth') } />
        <FormRow type='textarea' id='user-description' value={ this.props.user.description ? this.props.user.description : '' } handleChange={ (event) => { this.props.updateUserField('description', event.target.value) } } placeholder={ LocalizationService.formatMessage('user_profile.description') } />
      </div>
    );
  }
}