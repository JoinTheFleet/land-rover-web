import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import FormRow from '../../miscellaneous/forms/form_row';
import FormGroup from '../../miscellaneous/forms/form_group';
import FormField from '../../miscellaneous/forms/form_field';

import LocalizationService from '../../../shared/libraries/localization_service';

class BusinessInformationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      type: undefined
    }

    this.genderOptions = [
      { value: 'male', label: LocalizationService.formatMessage('user_profile_verified_info.gender.male') },
      { value: 'female', label: LocalizationService.formatMessage('user_profile_verified_info.gender.female') }
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
    const businessDetails = this.props.user.business_details || {};
    let address = { country: {} };

    if (businessDetails.address && Object.keys(businessDetails.address).length > 0) {
      address = businessDetails.address;

      if (!address.country_code && !address.country) {
        address.country = {};
      }
    }

    return (
      <div className="business-form">
        <FormRow type='text' id='business-name' handleChange={ this.props.handleNameChange } value={ businessDetails.name } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.business_name') } />
        <FormRow type='text' id='business-taxid' handleChange={ this.props.handleTaxIDChange } value={ businessDetails.tax_id } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.tax_id') } />

        <FormGroup placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address') }>
          <FormField id='business-address-line1' handleChange={ this.props.handleAddressLine1Change } type='text' value={ address.line1 } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.address_line_1')}/>
          <FormField id='business-address-line2' handleChange={ this.props.handleAddressLine2Change } type='text' value={ address.line2 } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.address_line_2')}/>
          <FormField id='business-address-city' handleChange={ this.props.handleCityChange } type='text' value={ address.city } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.state')}/>
          <FormField id='business-address-state' handleChange={ this.props.handleStateChange } type='text' value={ address.state } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.county')}/>
          <FormField id='business-address-postcode' handleChange={ this.props.handlePostCodeChange } type='text' value={ address.postal_code } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.post_code')}/>

          <div className="col-xs-12 no-side-padding">
            <FormField id='business-address-country' handleChange={ this.props.handleCountryChange } type='country' value={ address.country_code || address.country.alpha2 } clearable={ false } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.country')}/>
          </div>
        </FormGroup>
      </div>
    )
  }
}

export default injectIntl(BusinessInformationForm)
