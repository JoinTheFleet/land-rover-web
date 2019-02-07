import React, { Component } from 'react';
import LocalizationService from '../../../shared/libraries/localization_service';

import FormRow from './form_row';
import FormGroup from './form_group';
import FormField from '../../miscellaneous/forms/form_field';

export default class VerifiedInformationVerification extends Component {
  constructor(props) {
    super(props);

    this.accountTypeOptions = [
      { label: 'Company', value: 'company' },
      { label: 'Individual', value: 'individual' }
    ];

    this.countries = [];
    this.payment_countries = [];

    this.setCountries = this.setCountries.bind(this);

    this.accountTypeDisabled = this.accountTypeDisabled.bind(this);
    this.countryOfResidenceDisabled = this.countryOfResidenceDisabled.bind(this);
    this.modifyAccountType = this.modifyAccountType.bind(this);
    this.modifyCountryOfResidence = this.modifyCountryOfResidence.bind(this);

    this.setCountries(props);
  }

  setCountries(props) {
    if (!props) {
      props = this.props;
    }

    if (!this.countries) {
      this.countries = [];
    }

    if (!this.payment_countries) {
      this.payment_countries = [];
    }

    if (props.configurations) {
      if (props.configurations.payment_countries) {
        this.payment_countries = props.configurations.payment_countries.map(country => ({
          value: country.alpha2,
          label: country.name
        }));
      }

      if (props.configurations.all_countries) {
        this.countries = props.configurations.all_countries.map(country => ({
          value: country.alpha2,
          label: country.name
        }));
      }
    }
  }

  componentDidUpdate() {
    this.setCountries();
  }

  verified() {
    let user = this.props.user;

    let companyValidation = true;
    let companyAddressValidation = true;
    let addressValidation = true;

    if (this.companyAccountType()) {
      let business = user.business_details;

      companyValidation = false;
      companyAddressValidation = false;

      if (business) {
        companyValidation = business &&
                            business.name && business.name.length > 0 &&
                            business.tax_id && business.tax_id.length > 0;

        

        if (business.address) {
          let businessAddress = business.address;

          companyAddressValidation = businessAddress &&
                                    businessAddress.line1 && businessAddress.line1.length > 0 &&
                                    businessAddress.line2 && businessAddress.line2.length > 0 &&
                                    businessAddress.city && businessAddress.city.length > 0 &&
                                    businessAddress.state && businessAddress.state.length > 0 &&
                                    businessAddress.postal_code && businessAddress.postal_code.length > 0 &&
                                    businessAddress.country_code && businessAddress.country_code.length > 0;
        }
      }
    }

    if (user.address) {
      let address = user.address;

      addressValidation = address && 
                          address.line1 && address.line1.length > 0 &&
                          address.line2 && address.line2.length > 0 &&
                          address.city && address.city.length > 0 &&
                          address.state && address.state.length > 0 &&
                          address.postal_code && address.postal_code.length > 0 &&
                          address.country_code && address.country_code.length > 0;
    }

    return user &&
           (this.props.scope === 'renter' || (user.account_type && user.account_type.length > 0)) &&
           companyValidation && companyAddressValidation && addressValidation;
  }

  title() {
    return LocalizationService.formatMessage('user_verification.verified_information');
  }

  companyAccountType() {
    let user = this.props.user;

    return user && user.account_type === 'company';
  }

  modifyAccountType(value) {
    this.props.updateUserField('account_type', value.value);
    this.props.updateUserField('account_type_modified', true);
  }

  accountTypeDisabled() {
    return this.companyAccountType() && !this.props.user.account_type_modified;
  }

  modifyCountryOfResidence(value) {
    this.props.updateUserField('country_code', value.value);
    this.props.updateUserField('country_modified', true);
    this.modifyBusinessAddress('country_code', value);
  }

  countryOfResidenceDisabled() {
    let user = this.props.user;

    return !user.country_modified && (user.country_code || (user.country && user.country.alpha2));
  }

  modifyAddress(field, event) {
    let user = this.props.user;
    let address = user.address || {};

    if (event) {
      if (event.target) {
        address[field] = event.target.value;
      }
      else if (event.value) {
        address[field] = event.value;
      }
  
      this.props.updateUserField('address', address);
    }
  }

  modifyBusiness(field, event) {
    let user = this.props.user;
    let business = user.business_details || {};

    business[field] = event.target.value;

    this.props.updateUserField('business_details', business);
  }

  modifyBusinessAddress(field, event) {
    let user = this.props.user;
    let business = user.business_details || {};

    if (!business.address) {
      business.address = {};
    }

    if (event.target) {
      business.address[field] = event.target.value;
    }
    else if (event.value) {
      business.address[field] = event.value;
    }

    this.props.updateUserField('business_details', business);
  }

  render() {
    if (!this.props.configurations) {
      return <div className='col-xs-12 verification-form' />;
    }
    let user = this.props.user;
    let business = user.business_details || {};

    if (!business.address) {
      business.address = {};
    }

    if (business.address.country) {
      business.address.country_code = business.address.country.alpha2;
    }

    if (user.address.country) {
      user.address.country_code = user.address.country.alpha2;
    }

    let accountTypeAndResidence = '';

    if (this.props.scope !== 'renter') {
      accountTypeAndResidence = (
        <div>
          <FormRow type='select' id='user-company' disabled={ this.accountTypeDisabled() } clearable={ false } value={ user.account_type } handleChange={ this.modifyAccountType } options={ this.accountTypeOptions } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.account_type') } />
          <FormRow type='select' id='user-country' disabled={ this.countryOfResidenceDisabled() } clearable={ false } value={ user.country_code || (user && user.country ? user.country.alpha2 : '') } handleChange={ this.modifyCountryOfResidence } options={ this.payment_countries } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.country_of_residence') } />
        </div>
      )
    }

    return (
      <div className='col-xs-12 verification-form'>
        { accountTypeAndResidence }
        <FormGroup id='user-address' placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address') }>
          <FormField id='user-address-line1' handleChange={ (event) => { this.modifyAddress('line1', event) } } type='text' value={ user.address.line1 } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.address_line_1')}/>
          <FormField id='user-address-line2' handleChange={ (event) => { this.modifyAddress('line2', event) } } type='text' value={ user.address.line2 } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.address_line_2')}/>
          <FormField id='user-address-city' handleChange={ (event) => { this.modifyAddress('city', event) }  } type='text' value={ user.address.city } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.state')}/>
          <FormField id='user-address-state' handleChange={ (event) => { this.modifyAddress('state', event) }  } type='text' value={ user.address.state } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.county')}/>
          <FormField id='user-address-postcode' handleChange={ (event) => { this.modifyAddress('postal_code', event) } } type='text' value={ user.address.postal_code } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.post_code')}/>
          <FormField id='user-address-country' handleChange={ (event) => { this.modifyAddress('country_code', event) } } type='select' options={ this.countries } value={ user.address.country_code } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.country')}/>
        </FormGroup>
        <FormRow type='text' id='company-name' hidden={ !this.companyAccountType() } value={ business.name } handleChange={ (event) => { this.modifyBusiness('name', event) } } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.company_name') } />
        <FormRow type='text' id='company-tax-id' hidden={ !this.companyAccountType() } value={ business.tax_id } handleChange={ (event) => { this.modifyBusiness('tax_id', event) } } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.tax_id') } />
        <FormGroup id='company-address' placeholder={ LocalizationService.formatMessage('user_profile_verified_info.company_address') } hidden={ !this.companyAccountType() }>
          <FormField id='company-address-line1' handleChange={ (event) => { this.modifyBusinessAddress('line1', event) } } type='text' value={ business.address.line1 } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.address_line_1')}/>
          <FormField id='company-address-line2' handleChange={ (event) => { this.modifyBusinessAddress('line2', event) } } type='text' value={ business.address.line2 } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.address_line_2')}/>
          <FormField id='company-address-city' handleChange={ (event) => { this.modifyBusinessAddress('city', event) }  } type='text' value={ business.address.city } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.state')}/>
          <FormField id='company-address-state' handleChange={ (event) => { this.modifyBusinessAddress('state', event) }  } type='text' value={ business.address.state } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.county')}/>
          <FormField id='company-address-postcode' handleChange={ (event) => { this.modifyBusinessAddress('postal_code', event) } } type='text' value={ business.address.postal_code } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.post_code')}/>
          <FormField id='company-address-country' disabled={ true } type='select' options={ this.payment_countries } value={ business.address.country_code } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.address.country')}/>
        </FormGroup>
      </div>
    );
  }
}