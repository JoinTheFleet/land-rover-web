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

import Helpers from '../../../../miscellaneous/helpers';
class ListingPricing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: this.props.listing
    };

    this.validateFields = this.validateFields.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
  }

  getListingProperties() {
    let listing = this.state.listing;

    return {
      price: parseInt(listing.price, 10),
      cleaning_fee: parseInt(listing.cleaning_fee, 10),
      on_demand_rates: listing.on_demand_rates
    };
  }

  validateFields() {
    let listing = this.state.listing;

    return listing.price > 0 && listing.cleaning_fee > 0;
  }

  handleInputChange(param, value) {
    let propertyToAdd = {};
    propertyToAdd[param] = value;

    this.setState(prevState => ({
      listing: Helpers.extendObject(prevState.listing, propertyToAdd)
    }));
  }

  render() {
    let listing = this.state.listing;
    let odcFields = '';

    if ( listing.on_demand ) {
      odcFields = (
        <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.pricing.on_demand_collection'}) }
                               fieldsDescription={ this.props.intl.formatMessage({ id: 'listings.pricing.earn_more_by_offering' }) } >
          <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.pricing.distance'}) }>
            <FormField id="listing_odc_distance"
                       type="text"
                       value={ '' }
                       handleChange={ (event) => { } } />
          </ListingFormField>

          <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.pricing.price'}) }>
            <FormField id="listing_odc_price"
                       type="text"
                       value={ '' }
                       handleChange={ (event) => { } } />
          </ListingFormField>

        </ListingFormFieldGroup>
      )
    }

    return (
      <div className="listing-form-registration col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
        <ListingStep validateFields={ this.validateFields }
                     getListingProperties={ this.getListingProperties }
                     handleProceedToStepAndAddProperties={ this.props.handleProceedToStepAndAddProperties }
                     intl={ this.props.intl }>
          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.pricing.prices'}) }>
            <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.pricing.daily'}) }>
              <FormField id="listing_price"
                         type="text"
                         value={ listing.price }
                         handleChange={ (event) => { this.handleInputChange('price', parseInt(event.target.value, 10)) } } />
            </ListingFormField>

            <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.pricing.cleaning'}) }>
              <FormField id="listing_cleaning_fee"
                        type="text"
                        value={ listing.cleaning_fee }
                        handleChange={ (event) => { this.handleInputChange('cleaning_fee', parseInt(event.target.value, 10)) } } />
            </ListingFormField>

          </ListingFormFieldGroup>

          { odcFields }
        </ListingStep>
      </div>
    )
  }
}

ListingPricing.propTypes = {
  handleProceedToStepAndAddProperties: PropTypes.func.isRequired,
  listing: PropTypes.object
};

export default injectIntl(ListingPricing);
