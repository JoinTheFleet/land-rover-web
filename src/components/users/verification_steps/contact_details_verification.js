import React, { Component } from 'react';
import Alert from 'react-s-alert';

import FormRow from './form_row';
import FormField from '../../miscellaneous/forms/form_field';
import LocalizationService from '../../../shared/libraries/localization_service';
import UserPhoneNumbersService from '../../../shared/services/users/user_phone_numbers_service';
import UsersService from '../../../shared/services/users/users_service';

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
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.sendPhoneNumberVerification = this.sendPhoneNumberVerification.bind(this);
    this.submitVerificationCode = this.submitVerificationCode.bind(this);
    this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
  }

  verified() {
    let user = this.props.user;

    if (user) {
      return (user.phone_number && user.phone_number.phone_number) &&
             !user.verifications_required.email && !user.owner_verifications_required.email;
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

  sendPhoneNumberVerification() {
    if (this.state.phoneNumber && this.state.countryCode) {
      this.props.loading(true, () => {
        UserPhoneNumbersService.create({
          phone_number: {
            phone_number: `+${this.state.countryCode}${this.state.phoneNumber}`
          }
        }).then(response => {
          let phone_number = response.data.data.phone_number;

          if (!phone_number) {
            this.props.loading(false);
          }
          else if (phone_number.confirmed) {
            this.props.saveUser(true);
          }
          else {
            this.setState({
              phoneNumberValidationPending: true,
              verificationID: phone_number.id
            }, () => {
              this.props.loading(false);
            });
          }
        }).catch((error) => {
          this.props.loading(false);
          if (error.response) {
            Alert.error(error.response.data.message);
          }
        })
      })
    }
  }

  submitVerificationCode() {
    if (this.state.verificationCode && this.state.verificationID) {
      this.props.loading(true, () => {
        UserPhoneNumbersService.confirm(this.state.verificationID, this.state.verificationCode)
                                .then(() => {
                                  this.props.saveUser(true);
                                })
                                .catch((error) => {
                                  this.props.loading(false);
                                  if (error.response) {
                                    Alert.error(error.response.data.message);
                                  }
                                })
      });
    }
  }

  handleEmailChange(event) {
    this.setState({
      updatedEmail: event.target.value
    }, () => {
      this.props.updateUserField('email', this.state.updatedEmail);
      this.props.updateUserField('emailUpdated', true);
    });
  }

  sendVerificationEmail() {
    this.props.loading(true, () => {
      UsersService.sendVerificationEmail()
                  .then(() => {
                    this.props.loading(false);
                  })
                  .catch((error) => {
                    this.props.loading(false);
                    if (error.response) {
                      Alert.error(error.response.data.message);
                    }
                  })
    })
  }

  render() {
    return (
      <div className='col-xs-12 verification-form'>
        <div className='row'>
          <div className='col-xs-12 verification-section-header'>
            { LocalizationService.formatMessage('user_verification.phone_number') }
          </div>
        </div>

        <div className='col-xs-12 no-side-padding text-left verified-sent' hidden={ !this.state.phoneNumberValidationPending || this.state.phoneNumberConfirmed }>
          { LocalizationService.formatMessage('user_verification.confirmation_code_sent') }
        </div>
        <div className='col-xs-12 no-side-padding text-left verified-phone-number' hidden={ !this.state.phoneNumberValidationPending || this.state.phoneNumberConfirmed }>
          +{ this.state.countryCode }{ this.state.phoneNumber }
        </div>

        <div hidden={ (this.props.user.phone_number && this.props.user.phone_number.phone_number) || this.state.phoneNumberValidationPending || this.state.phoneNumberConfirmed } className='col-xs-12 no-side-padding phone-details'>
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

        <div hidden={ !this.state.phoneNumberValidationPending && !(this.props.user.phone_number && this.props.user.phone_number.phone_number) } className='col-xs-12 no-side-padding phone-details'>
          <FormRow id='user-phone-confirmation' hidden={ this.props.user.phone_number && this.props.user.phone_number.phone_number } handleChange={ (event) => {  this.setState({ verificationCode: event.target.value })} } type='text' value={ this.state.verificationCode } placeholder={ LocalizationService.formatMessage('user_verification.confirmation_code') }/>
          <FormRow id='user-phone-number' hidden={ !(this.props.user.phone_number && this.props.user.phone_number.phone_number) } value={ this.props.user.phone_number && this.props.user.phone_number.phone_number ? this.props.user.phone_number.phone_number : '' } type='text' disabled={ true } placeholder={ LocalizationService.formatMessage('user_profile.verified_info.phone_number') } />
          <button className='btn button round form-button col-xs-12' disabled={ !this.state.verificationCode } hidden={ this.props.user.phone_number && this.props.user.phone_number.phone_number } onClick={ this.submitVerificationCode }>
            { LocalizationService.formatMessage('user_verification.confirm') }
          </button>
          <button className='btn button round form-button success col-xs-12' disabled={ true } hidden={ !(this.props.user.phone_number && this.props.user.phone_number.phone_number) }>
            { LocalizationService.formatMessage('user_verification.confirmed') }
          </button>
        </div>
        <div className='row'>
          <div className='col-xs-12 verification-section-header'>
            { LocalizationService.formatMessage('user_verification.email') }
          </div>

          <div className='col-xs-12 email-section'>
            <FormRow id='user-email' handleChange={ this.handleEmailChange } type='text' disabled={ !this.props.user.verifications_required.email } value={ this.state.updatedEmail || this.props.user.email } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.email') }/>
            <button className='btn button round form-button no-side-padding col-xs-12 email-button' hidden={ !this.props.user.verifications_required.email && !this.props.user.emailUpdated } onClick={ () => this.props.saveUser(true) }>
              { this.props.user.emailUpdated ? LocalizationService.formatMessage('user_verification.update_email') : LocalizationService.formatMessage('user_verification.check_verification') }
            </button>
            <button className='btn button round form-button no-side-padding col-xs-12' hidden={ !this.props.user.verifications_required.email || this.props.user.emailUpdated } onClick={ this.sendVerificationEmail }>
              { LocalizationService.formatMessage('user_verification.resend_verification_email') }
            </button>
            <button className='btn button round form-button success col-xs-12 email-button' disabled={ true } hidden={ this.props.user.verifications_required.email || this.props.user.emailUpdated }>
              { LocalizationService.formatMessage('user_verification.confirmed') }
            </button>
          </div>
        </div>
      </div>
    );
  }
}