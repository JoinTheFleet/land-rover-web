import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import FormRow from '../../miscellaneous/forms/form_row';
import FormGroup from '../../miscellaneous/forms/form_group';
import FormField from '../../miscellaneous/forms/form_field';
import Modal from '../../miscellaneous/modal';
import Button from '../../miscellaneous/button';


class VerifiedInfoModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countryCode: undefined,
      phone_number: undefined
    }

    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.renderPhoneNumberForm = this.renderPhoneNumberForm.bind(this);
    this.renderDriverLicenseForm = this.renderDriverLicenseForm.bind(this);
  }

  handleCountryChange(country) {
    this.setState({ countryCode: country.value });
  }

  handlePhoneNumberChange(event) {
    this.setState({ phoneNumber: event.target.value });
  }

  renderDriverLicenseForm() {

  }

  renderPhoneNumberForm() {
    let addPhoneForm = '';
    let verify = '';

    if (this.state.countryCode) {
      addPhoneForm = (
        <div className='col-xs-12 no-side-padding modal-row'>
          <div className='col-xs-12 col-sm-4 phone-text'>
            Add a phone number:
          </div>
          <div className='col-xs-12 col-sm-8 phone-details'>
            <div className='col-xs-4 country-code'>
              { this.state.countryCode }
            </div>
            <div className='col-xs-8 no-side-padding'>
              <FormField type='text' id={ 'user-phone-number' } className={ 'phone-number col-xs-12' } value={ this.state.phoneNumber } handleChange={ this.handlePhoneNumberChange } />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className='row'>
        <div className='col-xs-12'>
          <div className='col-xs-12 text-left'>
            Select Country
          </div>
          <div className='col-xs-12'>
            <FormField id='user-phone-country' handleChange={ this.handleCountryChange } type='country-code' value={ this.state.countryCode } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.country'})}/>
          </div>
          { addPhoneForm }
        </div>
      </div>
    )
  }

  render() {
    let modalBody = '';

    if (this.props.type === 'phone') {
      modalBody =  this.renderPhoneNumberForm();
    }
    else {
      modalBody =  this.renderDriverLicenseForm();
    }

    return (
      <Modal open={ this.props.open } toggleModal={ this.props.toggleModal }>
        { modalBody }
      </Modal>
    )
  }
}

export default injectIntl(VerifiedInfoModal)
