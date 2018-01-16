import React, { Component } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import ListingStep from './listing_step';
import ListingFormFieldGroup from '../listing_form_field_group';
import ListingFormField from '../listing_form_field';
import FormField from '../../../miscellaneous/forms/form_field';

import Helpers from '../../../../miscellaneous/helpers';
import ListingsHelper from '../../../../miscellaneous/listings_helper';

import ListingPreviewService from '../../../../shared/services/listings/listing_preview_service';
import LocalizationService from '../../../../shared/libraries/localization_service';

const DEFAULT_DISTANCE_UNITS = 'km';

export default class ListingPricing extends Component {
  constructor(props) {
    super(props);

    let listing = Helpers.extendObject(this.props.listing, {});

    if (listing.on_demand) {
      listing.on_demand_rates = listing.on_demand_rates || [{}];
    }

    if (listing.price) {
      listing.price = listing.price;
    }

    if (listing.cleaning_fee) {
      listing.cleaning_fee = listing.cleaning_fee;
    }

    this.state = {
      listing: listing,
      distanceUnits: DEFAULT_DISTANCE_UNITS
    };

    this.validateFields = this.validateFields.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
    this.handleRateInsertion = this.handleRateInsertion.bind(this);
    this.handleAddODCRate = this.handleAddODCRate.bind(this);
  }

  componentDidMount() {
    const listingParams = ListingsHelper.extractListingParamsForSubmission(this.state.listing);

    ListingPreviewService.create({ listing: listingParams })
                         .then(response => {
                           this.setState({ distanceUnits: response.data.data.listing.country_configuration.distance_units });
                         });
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
    const listing = this.state.listing;

    if (listing.on_demand && !listing.on_demand_rates.every(odcRate => odcRate.distance && odcRate.rate && odcRate.distance > 0 && odcRate.rate > 0 )) {
      return false;
    }

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

  handleAddODCRate(event) {
    if (event) {
      event.preventDefault();
    }
    let on_demand_rates = this.state.listing.on_demand_rates;

    on_demand_rates.push({ distance: '', rate: '' });

    this.setState(prevState => ({
      listing: Helpers.extendObject(prevState.listing, { on_demand_rates: on_demand_rates })
    }));
  }

  render() {
    let listing = this.state.listing;
    let odcFields = '';
    let odcDistancePlaceholder = LocalizationService.formatMessage('listings.pricing.select_distance');
    let termsAndConditions = (
      <a target="_blank" href={ process.env.REACT_APP_FLEET_TERMS_URL } className="secondary-text-color">
        <b>{ LocalizationService.formatMessage('application.terms_and_conditions') } </b>
      </a>
    );

    let onDemandMessage = '';
    const fieldsDescription = (
      <FormattedMessage id="listings.pricing.earn_more_by_offering" values={ { terms_and_conditions: termsAndConditions } } />
    )

    if (listing.on_demand && !listing.on_demand_rates.some(odcRate => odcRate.distance && odcRate.rate && odcRate.distance > 0 && odcRate.rate > 0 )) {
      onDemandMessage = (
        <div className="on-demand-specify-distance-and-rate secondary-text-color col-xs-12 no-side-padding">
          <div className="col-xs-8 col-xs-offset-4 col-sm-10 col-sm-offset-2">
            { LocalizationService.formatMessage('listings.pricing.odc_specify_distance_and_price') }
          </div>
        </div>
      )
    }

    if ( listing.on_demand ) {
      odcFields = (
        <ListingFormFieldGroup title={ LocalizationService.formatMessage('listings.pricing.on_demand_collection') }
                               fieldsDescription={ fieldsDescription } >
          {
            listing.on_demand_rates.map((od_rate, index) => {
              if (od_rate.distance > 0) {
                odcDistancePlaceholder = `${od_rate.distance / 100.0} ${Helpers.capitalizeString(this.state.distanceUnits)}`;
              }

              return (
                <div key={ 'listing_on_demand_rate_' + index } className="listing-on-demand-rate-row col-xs-12 no-side-padding">
                  <ListingFormField label={ LocalizationService.formatMessage('listings.pricing.distance') }>
                    <Dropdown key={ `listing_odc_distance_selector_${index}` }
                              id={ `listing_odc_distance_selector_${index}` }>

                      <Dropdown.Toggle className='white black-text fs-14'>
                        { odcDistancePlaceholder }
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {
                          ListingsHelper.getOnDemandDistances().map(distance => {
                            return (
                              <MenuItem key={`listing_odc_distance_selector_${index}_${distance}`}
                                        eventKey={`${index}_${distance}`}
                                        active={ od_rate.distance === distance }
                                        onClick={ () => { this.handleRateInsertion(index, 'distance', distance * 100) } }>
                                { `${distance} ${Helpers.capitalizeString(this.state.distanceUnits)}` }
                              </MenuItem>
                            )
                          })
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                  </ListingFormField>

                  <ListingFormField label={ LocalizationService.formatMessage('listings.pricing.price') }>
                    <FormField id={ 'listing_od_rate_rate_' + index }
                              type="text"
                              value={ listing.on_demand_rates[index].rate / 100.0 }
                              handleChange={ (event) => { this.handleRateInsertion(index, 'rate', event.target.value * 100) } } />
                  </ListingFormField>

                  { onDemandMessage }
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
                     listing={ Helpers.extendObject(this.props.listing, this.getListingProperties()) } >
          <ListingFormFieldGroup title={ LocalizationService.formatMessage('listings.pricing.prices') }>
            <ListingFormField label={ LocalizationService.formatMessage('listings.pricing.daily') }>
              <FormField id="listing_price"
                         type="text"
                         value={ listing.price / 100.0 }
                         handleChange={ (event) => { this.handleInputChange('price', event.target.value * 100) } } />
            </ListingFormField>

            <ListingFormField label={ LocalizationService.formatMessage('listings.pricing.cleaning') }>
              <FormField id="listing_cleaning_fee"
                        type="text"
                        value={ listing.cleaning_fee / 100.0 }
                        handleChange={ (event) => { this.handleInputChange('cleaning_fee', event.target.value * 100) } } />
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
