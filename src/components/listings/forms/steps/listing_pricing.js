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

class ListingPricing extends Component {
  constructor(props) {
    super(props);

    this.validateFields = this.validateFields.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
  }

  getListingProperties() {
    let listingPrice = document.getElementById('listing_price').value;
    let listingCleaningFee = document.getElementById('listing_cleaning_fee').value;
    let onDemandRates = [];

    if ( this.props.listing.on_demand ) {
      let listingODCDistance = document.getElementById('listing_odc_distance').value;
      let listingODCPrice = document.getElementById('listing_odc_price').value;

      onDemandRates = [
        {
          distance: listingODCDistance,
          rate: listingODCPrice
        }
      ]
    }

    return {
      price: parseInt(listingPrice, 10),
      cleaning_fee: parseInt(listingCleaningFee, 10),
      on_demand_rates: onDemandRates
    };
  }

  validateFields() {
    let properties = this.getListingProperties();

    return properties.price > 0 && properties.cleaning_fee > 0;
  }

  render() {
    let listing = this.props.listing;
    let odcFields = '';

    if ( this.props.listing.on_demand ) {
      odcFields = (
        <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.pricing.on_demand_collection'}) }
                               fieldsDescription={ this.props.intl.formatMessage({ id: 'listings.pricing.earn_more_by_offering' }) } >
          <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.pricing.distance'}) }>
            <FormField id="listing_odc_distance"
                       type="text"
                       value={ listing ? listing.price : '' } />
          </ListingFormField>

          <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.pricing.price'}) }>
            <FormField id="listing_odc_price"
                       type="text"
                       value={ listing ? listing.cleaning_fee : '' } />
          </ListingFormField>

        </ListingFormFieldGroup>
      )
    }

    return (
      <div className="listing-form-registration col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
        <ListingStep validateFields={ this.validateFields }
                     getListingProperties={ this.getListingProperties }
                     finalStep={ true }
                     handleCompleteListing={ this.props.handleCompleteListing }
                     intl={ this.props.intl }>
          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.pricing.prices'}) }>
            <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.pricing.daily'}) }>
              <FormField id="listing_price"
                        type="text"
                        value={ listing ? listing.price : '' } />
            </ListingFormField>

            <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.pricing.cleaning'}) }>
              <FormField id="listing_cleaning_fee"
                        type="text"
                        value={ listing ? listing.cleaning_fee : '' } />
            </ListingFormField>

          </ListingFormFieldGroup>

          { odcFields }
        </ListingStep>
      </div>
    )
  }
}

ListingPricing.propTypes = {
  listing: PropTypes.object.isRequired,
  handleCompleteListing: PropTypes.func.isRequired
};

export default injectIntl(ListingPricing);
