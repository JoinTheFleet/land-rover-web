import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import FormRow from '../../miscellaneous/forms/form_row';
import FormGroup from '../../miscellaneous/forms/form_group';
import FormField from '../../miscellaneous/forms/form_field';

class BusinessInformationForm extends Component {
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
    return (
      <div>
        <FormRow type='text' id='business-name' handleChange={ this.props.handleNameChange } value={ this.props.user.business_details.name } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.business_name'}) } />
        <FormRow type='text' id='business-taxid' handleChange={ this.props.handleTaxIDChange } value={ this.props.user.business_details.tax_id } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.tax_id'}) } />

        <FormGroup placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address'}) }>
          <FormField id='business-address-line1' handleChange={ this.props.handleAddressLine1Change } type='text' value={ this.props.user.business_details.address.line1 } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.address_line_1'})}/>
          <FormField id='business-address-line2' handleChange={ this.props.handleAddressLine2Change } type='text' value={ this.props.user.business_details.address.line2 } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.address_line_2'})}/>
          <FormField id='business-address-city' handleChange={ this.props.handleCityChange } type='text' value={ this.props.user.business_details.address.city } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.state'})}/>
          <FormField id='business-address-state' handleChange={ this.props.handleStateChange } type='text' value={ this.props.user.business_details.address.state } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.county'})}/>
          <FormField id='business-address-postcode' handleChange={ this.props.handlePostCodeChange } type='text' value={ this.props.user.business_details.address.postal_code } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.post_code'})}/>
          <FormField id='business-address-country' handleChange={ this.props.handleCountryChange } type='country' value={ this.props.user.business_details.address.country_code || this.props.user.business_details.address.country.alpha2 } placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.address.country'})}/>
        </FormGroup>
      </div>
    )
  }
}

export default injectIntl(BusinessInformationForm)
