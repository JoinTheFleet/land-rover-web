import React, {
  Component
} from 'react';

import {
  injectIntl
} from 'react-intl';

import PropTypes from 'prop-types';

import ListingStep from './listing_step';
import ListingFormFieldGroup from '../listing_form_field_group';
import ListingFormField from '../listing_form_field';
import FormField from '../../../miscellaneous/forms/form_field';

import Constants from '../../../../miscellaneous/constants';

const stepDirections = Constants.stepDirections();

class ListingRegistration extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.proceedToNextStep = this.proceedToNextStep.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  proceedToNextStep() {

    if (this.validateFields()) {
      this.props.handleProceedToStepAndAddProperties(stepDirections.next, this.getListingProperties());
    }
    else {
      let errorMessage = this.props.intl.formatMessage({ id: 'errors.forms.fill_up_all_required_fields' });
      this.setState((prevState) => ({
        errors: prevState.errors.push(errorMessage)
      }));
    }
  }

  getListingProperties() {
    let listingCountry = document.getElementById('listing_country').value;
    let listingRegistration = document.getElementById('listing_registration').value;

    return { country: listingCountry, registration: listingRegistration };
  }

  validateFields() {
    let properties = this.getListingProperties();

    return properties.country.length > 0 && properties.registration.length > 0;
  }

  render() {
    let listing = this.props.listing;

    return (
      <div className="listing-form-registration col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
        <ListingStep validateFields={ this.validateFields }
                     getListingProperties={ this.getListingProperties }
                     handleProceedToStepAndAddProperties={ this.props.handleProceedToStepAndAddProperties }
                     intl={ this.props.intl }>
          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.registration.registration_details'}) }
                                fieldsDescription={ this.props.intl.formatMessage({id: 'listings.registration.please_enter_car_country'}) }>
            <ListingFormField label={ this.props.intl.formatMessage({id: 'application.country'}) }>
              <FormField id="listing_country"
                        type="text"
                        value={ listing ? listing.country : '' }
                        placeholder={ this.props.intl.formatMessage({id: 'application.country'}) } />
            </ListingFormField>

            <ListingFormField label={ this.props.intl.formatMessage({id: 'application.registration'}) }>
              <FormField id="listing_registration"
                        type="text"
                        value={ listing ? listing.registration : '' }
                        placeholder={ this.props.intl.formatMessage({id: 'application.registration'}) } />
            </ListingFormField>

          </ListingFormFieldGroup>
        </ListingStep>
      </div>
    )
  }
}

export default injectIntl(ListingRegistration);

ListingRegistration.propTypes = {
  handleProceedToStepAndAddProperties: PropTypes.func.isRequired,
  listing: PropTypes.object
}
