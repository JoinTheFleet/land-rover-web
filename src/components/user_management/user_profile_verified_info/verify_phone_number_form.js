import React, { Component } from 'react';
import Alert from 'react-s-alert';

import FormField from '../../miscellaneous/forms/form_field';
import Button from '../../miscellaneous/button';
import LocalizationService from '../../../shared/libraries/localization_service';
import UserPhoneNumbersService from '../../../shared/services/users/user_phone_numbers_service';

export default class VerifyPhoneNumberForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      countryCode: undefined,
      phoneNumber: undefined,
      pendingVerification: false,
      verificationID: undefined,
      verificationCode: undefined
    }

    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.renderPhoneNumberForm = this.renderPhoneNumberForm.bind(this);
    this.canSubmitPhoneNumber = this.canSubmitPhoneNumber.bind(this);
    this.submitPhoneNumber = this.submitPhoneNumber.bind(this);
    this.submitVerificationCode = this.submitVerificationCode.bind(this);
    this.handleVerificationCodeChange = this.handleVerificationCodeChange.bind(this);
    this.afterPhoneNumberValidation = this.afterPhoneNumberValidation.bind(this);
  }

  handleCountryChange(country) {
    if (country) {
      this.setState({ countryCode: country.value });
    }
  }

  handlePhoneNumberChange(event) {
    this.setState({ phoneNumber: event.target.value });
  }

  handleVerificationCodeChange(event) {
    this.setState({ verificationCode: event.target.value })
  }

  submitPhoneNumber(event) {
    if (event) {
      event.preventDefault();
    }

    if (this.canSubmitPhoneNumber()) {
      this.setState({
        loading: true
      }, () => {
        UserPhoneNumbersService.create({
          phone_number: {
            phone_number: `+${this.state.countryCode}${this.state.phoneNumber}`
          }
        }).then(response => {
          let phone_number = response.data.data.phone_number;

          if (phone_number.confirmed) {
            this.afterPhoneNumberValidation();
          }
          else {
            this.setState({
              loading: false,
              pendingVerification: true,
              verificationID: phone_number.id
            })
          }
        }).catch(error => {
          this.setState({
            loading: false
          }, () => {
            if (error.response) {
              Alert.error(error.response.data.message);
            }
          });
        })
      });
    }
  }

  afterPhoneNumberValidation() {
    this.setState({
      loading: false,
      countryCode: undefined,
      phoneNumber: undefined,
      pendingVerification: false,
      verificationID: undefined,
      verificationCode: undefined
    }, () => {
      Alert.success(LocalizationService.formatMessage('user_profile_verified_info.successfully_verified'));
      this.props.toggleModal();
    })
  }

  submitVerificationCode(event) {
    if (event) {
      event.preventDefault();
    }

    if (this.state.verificationCode && this.state.verificationID) {
      UserPhoneNumbersService.confirm(this.state.verificationID, this.state.verificationCode)
                             .then(this.afterPhoneNumberValidation)
                             .catch(error => {
                               Alert.error(error.response.data.message)
                               this.setState({
                                 loading: false
                               }, () => {
                                 if (error.response) {
                                   Alert.error(error.response.data.message);
                                 }
                               })
                             })
    }
  }

  canSubmitPhoneNumber() {
    return this.state.phoneNumber && this.state.countryCode;
  }

  renderVerificationForm() {
    return (
      <form onSubmit={ this.submitVerificationCode }>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='col-xs-12 text-left'>
              { LocalizationService.formatMessage('user_profile_verified_info.sent_verification') }
              <b>+{ this.state.countryCode }{ this.state.phoneNumber }</b>
            </div>
            <div className='col-xs-12 no-side-padding modal-row'>
              <div className='col-xs-12 col-sm-6 phone-text'>
                { LocalizationService.formatMessage('user_profile_verified_info.enter_verification') }
              </div>
              <div className='col-xs-12 col-sm-6 '>
                <FormField type='text' id={ 'user-phone-number' } className={ 'verification-code col-xs-12' } value={ this.state.verificationCode } handleChange={ this.handleVerificationCodeChange } />
              </div>
              <div className='col-xs-12 col-sm-4 modal-row'>
                <Button className='btn btn-primary text-center no-side-padding inherit-width modal-button' spinner={ this.state.loading } disabled={ this.state.loading }>
                  { LocalizationService.formatMessage('application.verify') }
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  renderPhoneNumberForm() {
    let addPhoneForm = '';

    if (this.state.countryCode) {
      addPhoneForm = (
        <div className='col-xs-12 no-side-padding modal-row'>
          <div className='col-xs-12 col-sm-4 phone-text'>
            { LocalizationService.formatMessage('user_profile_verified_info.add_phone_number') }
          </div>
          <div className='col-xs-12 col-sm-8 phone-details'>
            <div className='col-xs-4 country-code'>
              +{ this.state.countryCode }
            </div>
            <div className='col-xs-8 no-side-padding'>
              <FormField type='text' id={ 'user-phone-number' } className={ 'phone-number col-xs-12' } value={ this.state.phoneNumber } handleChange={ this.handlePhoneNumberChange } />
            </div>
          </div>
          <div className='col-xs-12 col-sm-4 modal-row'>
            <Button className='btn btn-primary text-center no-side-padding inherit-width modal-button' spinner={ this.state.loading } disabled={ this.state.loading || !this.canSubmitPhoneNumber() }>
              { LocalizationService.formatMessage('application.verify') }
            </Button>
          </div>
        </div>
      )
    }

    return (
      <form onSubmit={ this.submitPhoneNumber }>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='col-xs-12 text-left'>
              { LocalizationService.formatMessage('user_profile_verified_info.select_country') }
            </div>
            <div className='col-xs-12'>
              <FormField id='user-phone-country' handleChange={ this.handleCountryChange } type='country-code' value={ this.state.countryCode } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.country') }/>
            </div>
            { addPhoneForm }
          </div>
        </div>
      </form>
    )
  }

  render() {
    if (!this.state.pendingVerification) {
      return this.renderPhoneNumberForm();
    }
    else {
      return this.renderVerificationForm();
    }
  }
}
