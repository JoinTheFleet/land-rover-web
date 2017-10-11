import React, {
  Component
} from 'react';

import {
  injectIntl,
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';

import ListingStep from './listing_step';
import ListingFormFieldGroup from '../listing_form_field_group';
import ListingFormField from '../listing_form_field';
import Dropdown from '../../../miscellaneous/dropdown';

const amenities = ['Sunroof', 'Air Conditioning', 'ABS', 'Cruise Control', 'Lane Assist'];

class ListingDetails extends ListingStep {

  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.proceedToNextStep = this.proceedToNextStep.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  validateFields() {
    let properties = this.getListingProperties();

    return true;
  }

  getListingProperties() {
    // let listingVehicleType = document.getElementById('listing_vehicle_type').value;

    return {
      vehicle: { type: '' }
    };
  }

  render() {
    let listing = this.props.listing;

    return (
      <div className="listing-form-details col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
        <ListingStep validateFields={ this.validateFields }
                     getListingProperties={ this.getListingProperties }
                     handleProceedToStepAndAddProperties={ this.props.handleProceedToStepAndAddProperties }
                     intl={ this.props.intl }>
          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.vehicle'}) }>
            {
              ['type', 'make', 'model'].map((param) => {
                return (
                  <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.' + param}) }>
                    <Dropdown name={ 'listings_vehicle_' + param } 
                              placeholder={ listing[param] || this.props.intl.formatMessage({ id: 'listings.' + param }) }
                              items={ ['Item 1', 'Item 2'] } />
                  </ListingFormField>
                )
              })
            }
          </ListingFormFieldGroup>

          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.details'}) }>
            {
              ['fuel', 'transmission', 'passengers', 'doors'].map((param) => {
                return (
                  <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.' + param}) }>
                    <Dropdown name={ 'listings_vehicle_' + param } 
                              placeholder={ listing[param] || this.props.intl.formatMessage({ id: 'listings.' + param }) }
                              items={ ['Item 1', 'Item 2'] } />
                  </ListingFormField>
                )
              })
            }
          </ListingFormFieldGroup>

          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.on_demand_collection'}) }>
            <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.odc'}) }>
              <Dropdown name={ 'listings_vehicle_odc' }
                        placeholder={ listing.on_demand_collection || this.props.intl.formatMessage({ id: 'listings.on_demand_collection' }) }
                        items={ ['No', 'Yes'] } />
            </ListingFormField>
          </ListingFormFieldGroup>

          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.amenities'}) }>
            {
              amenities.map((amenity) => {
                let checkboxId = 'listings_amenity_' + amenity;

                return (
                  <div key={ 'listing_amenity_' + amenity } className="listings-amenity-filter fleet-checkbox">
                    <input type="checkbox" id={ checkboxId } name="amenities[]" />
                    <label htmlFor={ checkboxId } className="fs-16 text-secondary-font-weight">{ amenity }</label>
                  </div>
                )
              })
            }
          </ListingFormFieldGroup>
        </ListingStep>
      </div>
    )
  }
}

export default injectIntl(ListingDetails);

ListingDetails.propTypes = {
  handleProceedToStepAndAddProperties: PropTypes.func.isRequired,
  listing: PropTypes.object
}
