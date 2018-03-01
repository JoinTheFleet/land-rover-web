import React, { Component } from 'react';

import FormRow from './form_row';
import FormField from '../../miscellaneous/forms/form_field';
import LocalizationService from '../../../shared/libraries/localization_service';
import UserPhoneNumbersService from '../../../shared/services/users/user_phone_numbers_service';

export default class ContactDetailsVerification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countryCode: undefined,
      phoneNumber: undefined,
      email: undefined,
      verificationCode: undefined,
      verificationID: undefined,
      phoneNumberValidationPending: false,
      phoneNumberValid: false,
      phoneNumberConfirmed: false
    }

    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.phoneNumberValidated = this.phoneNumberValidated.bind(this);
    this.sendPhoneNumberVerification = this.sendPhoneNumberVerification.bind(this);
    this.submitVerificationCode = this.submitVerificationCode.bind(this);
  }

  verified() {
    let user = this.props.user;

    if (user) {
      return user.phone_number && user.phone_number.length > 0 &&
             user.email && user.email.length > 0 &&
             !user.verifications_required.email && !user.owner_verifications_required.email &&
             !user.verifications_required.phone_number && !user.owner_verifications_required.phone_number;
    }

    return false;
  }

  title() {
    return LocalizationService.formatMessage("user_verification.contact_details");
  }

  handleCountryChange(country) {
    if (country) {
      this.setState({ countryCode: country.value });
    }
  }

  handlePhoneNumberChange(event) {
    this.setState({ phoneNumber: event.target.value });
  }

  phoneNumberValidated() {
    let user = this.props.user;

    if (user) {
      let verificationsRequired = user.verifications_required;
      let ownerVerificationsRequired = user.owner_verifications_required;

      verificationsRequired.phone_number = false;
      ownerVerificationsRequired.phone_number = false;

      this.props.updateUserField('verifications_required', verificationsRequired);
      this.props.updateUserField('owner_verifications_required', ownerVerificationsRequired);

      this.setState({ 
        phoneNumberValidationPending: false,
        phoneNumberConfirmed: true
      });
    }
  }

  sendPhoneNumberVerification() {
    if (this.state.phoneNumber && this.state.countryCode) {
      UserPhoneNumbersService.create({
        phone_number: {
          phone_number: `+${this.state.countryCode}${this.state.phoneNumber}`
        }
      }).then(response => {
        let phone_number = response.data.data.phone_number;

        if (phone_number.confirmed) {
          this.phoneNumberValidated();
        }
        else {
          this.setState({
            phoneNumberValidationPending: true,
            verificationID: phone_number.id
          });
        }
      });
    }
  }

  submitVerificationCode() {
    if (this.state.verificationCode && this.state.verificationID) {
      UserPhoneNumbersService.confirm(this.state.verificationID, this.state.verificationCode)
                             .then(this.phoneNumberValidated);
    }
  }

  render() {
    return (
      <div className='col-xs-12 verification-form'>
        <div className='row'>
          <div className='col-xs-12 verification-section-header'>
            { LocalizationService.formatMessage('user_verification.phone_number') }
          </div>
        </div>

        <div hidden={ this.state.phoneNumberValidationPending || this.state.phoneNumberConfirmed } className='col-xs-12 no-side-padding phone-details'>
          <FormRow id='user-phone-country' handleChange={ this.handleCountryChange } type='country-code' value={ this.state.countryCode } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.select_country') }/>
          <div className='col-xs-12 no-side-padding text-left form-label'>
            { LocalizationService.formatMessage('user_verification.add_phone_number') }
          </div>
          <div className='col-xs-12 no-side-padding phone-information form-row'>
            <div className='col-xs-2 country-code'>
              +{ this.state.countryCode }
            </div>
            <div className='col-xs-10 no-side-padding'>
              <FormField type='text' id={ 'user-phone-number' } disabled={ !this.state.countryCode } className={ 'phone-number col-xs-12' } value={ this.state.phoneNumber } handleChange={ this.handlePhoneNumberChange } />
            </div>
          </div>
          <button className='btn button round form-button col-xs-12' disabled={ !this.state.phoneNumber } onClick={ this.sendPhoneNumberVerification }>
            { LocalizationService.formatMessage('user_verification.verify') }
          </button>
        </div>

        <div hidden={ !this.state.phoneNumberValidationPending && !this.state.phoneNumberConfirmed } className='col-xs-12 no-side-padding phone-details'>
          <FormRow id='user-phone-confirmation' hidden={ !this.state.verificationCode && this.state.phoneNumberConfirmed } disabled={ this.state.phoneNumberConfirmed } handleChange={ (event) => {  this.setState({ verificationCode: event.target.value })} } type='text' value={ this.state.verificationCode } placeholder={ LocalizationService.formatMessage('user_verification.confirmation_code') }/>
          <button className='btn button round form-button col-xs-12' disabled={ !this.state.verificationCode } hidden={ !this.state.phoneNumber || this.state.phoneNumberConfirmed } onClick={ this.submitVerificationCode }>
            { LocalizationService.formatMessage('user_verification.confirm') }
          </button>
          <button className='btn button round form-button success col-xs-12' disabled={ true } hidden={ !this.state.phoneNumber || !this.state.phoneNumberConfirmed } onClick={ this.submitVerificationCode }>
            { LocalizationService.formatMessage('user_verification.confirmed') }
          </button>
        </div>
        <div className='row'>
          <div className='col-xs-12 verification-section-header'>
            { LocalizationService.formatMessage('user_verification.email') }
          </div>
        </div>
      </div>
    );
  }
}