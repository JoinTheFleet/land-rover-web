import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import FormRow from '../../miscellaneous/forms/form_row';
import FormGroup from '../../miscellaneous/forms/form_group';
import FormField from '../../miscellaneous/forms/form_field';
import VerifiedInfoModal from './verified_info_modal';
import moment from 'moment';

class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      type: undefined
    }

    this.genderOptions = [
      { value: 'male', label: this.props.intl.formatMessage({id: 'user_profile_verified_info.gender.male'}) },
      { value: 'female', label: this.props.intl.formatMessage({id: 'user_profile_verified_info.gender.female'}) }
    ];

    this.showPhoneDialog = this.showPhoneDialog.bind(this);
    this.showLicenseDialog = this.showLicenseDialog.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  showPhoneDialog() {
    this.setState({
      open: true,
      type: 'phone'
    });
  }

  showLicenseDialog() {
    this.setState({
      open: true,
      type: 'license'
    });
  }

  toggleModal() {
    this.setState({
      open: false,
      type: undefined
    });
  }


  render() {
    let country = this.props.user.address.country_code;

    if (!country && this.props.user.address.country) {
      country = this.props.user.address.country.alpha2;
    }
    
    return (
      <div>
        <FormRow type='singleyeardate' id='user-dateofbirth' handleChange={ this.props.handleDateChange } value={ this.props.user.date_of_birth ? moment.unix(this.props.user.date_of_birth) : moment() } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.date_of_birth'}) } />
        <FormRow type='select' id='user-gender' clearable={ false } handleChange={ this.props.handleGenderChange } value={ this.props.user.gender } options={ this.genderOptions } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.gender'}) } />
        <FormRow type='country' id='user-country' clearable={ false } handleChange={ this.props.handleUserCountryChange } value={ this.props.user.country_code || (this.props.user && this.props.user.country ? this.props.user.country.alpha2 : undefined) } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.country_of_residence' })} />

        <FormGroup placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address'}) }>
          <FormField id='user-address-line1' handleChange={ this.props.handleAddressLine1Change } type='text' value={ this.props.user.address.line1 } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.address_line_1'})}/>
          <FormField id='user-address-line2' handleChange={ this.props.handleAddressLine2Change } type='text' value={ this.props.user.address.line2 } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.address_line_2'})}/>
          <FormField id='user-address-city' handleChange={ this.props.handleCityChange } type='text' value={ this.props.user.address.city } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.state'})}/>
          <FormField id='user-address-state' handleChange={ this.props.handleStateChange } type='text' value={ this.props.user.address.state } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.county'})}/>
          <FormField id='user-address-postcode' handleChange={ this.props.handlePostCodeChange } type='text' value={ this.props.user.address.postal_code } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.post_code'})}/>
          <FormField id='user-address-country' handleChange={ this.props.handleCountryChange } type='country' value={ country } clearable={ false } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.country'})}/>
        </FormGroup>

        <FormRow type='text' id='user-email' handleChange={ this.props.handleEmailChange } value={ this.props.user.email } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.email'}) } />
        <FormRow type='button' id='user-phone' handleChange={ this.showPhoneDialog } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.phone_number'}) } value={ this.props.intl.formatMessage({id: 'application.manage' }) } className={ 'btn btn-primary text-center col-xs-12 col-sm-3 no-side-padding' } />
        <FormRow type='button' id='user-license' handleChange={ this.showLicenseDialog } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.drivers_license'}) } value={ this.props.intl.formatMessage({id: 'application.manage' }) } className={ 'btn btn-primary text-center col-xs-12 col-sm-3 no-side-padding' } />

        <VerifiedInfoModal open={ this.state.open } toggleModal={ this.toggleModal } type={ this.state.type } user={ this.props.user }/>
      </div>
    )
  }
}

export default injectIntl(UserForm)
