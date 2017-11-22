import React, { Component } from 'react';

import PropTypes from 'prop-types';

import ListingStep from './listing_step';
import ListingFormFieldGroup from '../listing_form_field_group';
import ListingFormField from '../listing_form_field';
import FormField from '../../../miscellaneous/forms/form_field';

import LocalizationService from '../../../../shared/libraries/localization_service';

import Constants from '../../../../miscellaneous/constants';
import Helpers from '../../../../miscellaneous/helpers';

const stepDirections = Constants.stepDirections();

export default class ListingRegistration extends Component {

  constructor(props) {
    super(props);

    this.state = {
      listing: this.props.listing,
      errors: []
    };

    this.proceedToNextStep = this.proceedToNextStep.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
    this.handleLicensePlateChange = this.handleLicensePlateChange.bind(this);
  }

  proceedToNextStep() {

    if (this.validateFields()) {
      this.props.handleProceedToStepAndAddProperties(stepDirections.next, this.getListingProperties());
    }
    else {
      let errorMessage = LocalizationService.formatMessage('errors.forms.fill_up_all_required_fields');

      this.setState((prevState) => ({
        errors: prevState.errors.push(errorMessage)
      }));
    }
  }

  getListingProperties() {
    let listing = this.state.listing;

    return { country: listing.country, license_plate_number: listing.license_plate_number };
  }

  validateFields() {
    let listing = this.state.listing;

    if (!listing.country || !listing.license_plate_number) {
      return false;
    }

    return listing.country.length > 0 && listing.license_plate_number.length > 0;
  }

  handleCountrySelect(selectedOption) {
    this.setState(prevState => ({
      listing: Helpers.extendObject(prevState.listing, { country: selectedOption.value })
    }));
  }

  handleLicensePlateChange(event) {
    let value = event.target.value;

    this.setState(prevState => ({
      listing: Helpers.extendObject(prevState.listing, { license_plate_number: value })
    }));
  }

  render() {
    let listing = this.state.listing;

    let countries = [];

    if (this.props.configurations && this.props.configurations.countries) {
      countries = this.props.configurations.countries.map(country => ({
        value: country.alpha2,
        label: country.name
      }));
    }

    return (
      <div className="listing-form-registration col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
        <ListingStep validateFields={ this.validateFields }
                     getListingProperties={ this.getListingProperties }
                     handleProceedToStepAndAddProperties={ this.props.handleProceedToStepAndAddProperties }
                     listing={ Helpers.extendObject(this.props.listing, this.getListingProperties()) } >
          <ListingFormFieldGroup title={ LocalizationService.formatMessage('listings.registration.registration_details') }
                                fieldsDescription={ LocalizationService.formatMessage('listings.registration.please_enter_car_country') }>
            <ListingFormField label={ LocalizationService.formatMessage('application.country') }>
              <FormField id="listing_country"
                         type="select"
                         clearable={ false }
                         options={ countries }
                         value={ listing.country }
                         placeholder={ LocalizationService.formatMessage('application.country') }
                         handleChange={ this.handleCountrySelect } />
            </ListingFormField>

            <ListingFormField label={ LocalizationService.formatMessage('application.registration') }>
              <FormField id="listing_registration"
                        type="text"
                        value={ listing.license_plate_number }
                        placeholder={ LocalizationService.formatMessage('application.registration') }
                        handleChange={ this.handleLicensePlateChange } />
            </ListingFormField>

          </ListingFormFieldGroup>
        </ListingStep>
      </div>
    )
  }
}

ListingRegistration.propTypes = {
  handleProceedToStepAndAddProperties: PropTypes.func.isRequired,
  listing: PropTypes.object
}
