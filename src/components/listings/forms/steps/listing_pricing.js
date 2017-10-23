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

    let listing = Helpers.extendObject(this.props.listing, {});

    if (listing.on_demand) {
      listing.on_demand_rates = listing.on_demand_rates || [];
    }

    if (listing.price) {
      listing.price = listing.price / 100;
    }

    if (listing.cleaning_fee) {
      listing.cleaning_fee = listing.cleaning_fee / 100;
    }

    this.state = {
      listing: listing
    };

    this.validateFields = this.validateFields.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
    this.handleRateInsertion = this.handleRateInsertion.bind(this);
    this.handleAddODCRate = this.handleAddODCRate.bind(this);
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

  handleRateInsertion(index, param, value) {
    let on_demand_rates = this.state.listing.on_demand_rates;

    if (!on_demand_rates[index]) {
      on_demand_rates[index] = {};
    }

    on_demand_rates[index][param] = value;

    this.setState(prevState => ({
      listing: Helpers.extendObject(prevState.listing, { on_demand_rates: on_demand_rates })
    }));
  }

  handleAddODCRate() {
    let on_demand_rates = this.state.listing.on_demand_rates;

    on_demand_rates.push({ distance: '', rate: '' });

    this.setState(prevState => ({
      listing: Helpers.extendObject(prevState.listing, { on_demand_rates: on_demand_rates })
    }));
  }

  render() {
    let listing = this.state.listing;
    let odcFields = '';

    if ( listing.on_demand ) {
      odcFields = (
        <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.pricing.on_demand_collection'}) }
                               fieldsDescription={ this.props.intl.formatMessage({ id: 'listings.pricing.earn_more_by_offering' }) } >
          {
            listing.on_demand_rates.map((od_rate, index) => {
              return (
                <div key={ 'listing_on_demand_rate_' + index } className="listing-on-demand-rate-row col-xs-12 no-side-padding">
                  <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.pricing.distance'}) }>
                    <FormField id={ 'listing_od_rate_distance_' + index }
                              type="text"
                              value={ listing.on_demand_rates[index].distance }
                              handleChange={ (event) => { this.handleRateInsertion(index, 'distance', event.target.value) } } />
                  </ListingFormField>

                  <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.pricing.price'}) }>
                    <FormField id={ 'listing_od_rate_rate_' + index }
                              type="text"
                              value={ listing.on_demand_rates[index].rate }
                              handleChange={ (event) => { this.handleRateInsertion(index, 'rate', event.target.value) } } />
                  </ListingFormField>
                </div>
              )
            })
          }

          <div className="listing-form-odc-rate-add-new text-center col-xs-12">
            <button className="add-new-odc-rate-btn btn secondary-color white-text" onClick={ this.handleAddODCRate }> { '+' } </button>
          </div>
        </ListingFormFieldGroup>
      )
    }

    return (
      <div className="listing-form-pricing col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
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
