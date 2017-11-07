import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import PropTypes from 'prop-types';

import ListingStep from './listing_step';
import ListingFormFieldGroup from '../listing_form_field_group';
import ListingFormField from '../listing_form_field';
import FormField from '../../../miscellaneous/forms/form_field';

import ListingAmenitiesService from '../../../../shared/services/listings/listing_amenities_service';

import Helpers from '../../../../miscellaneous/helpers';
import Constants from '../../../../miscellaneous/constants';

const filtersDisplayProperties = Constants.listingFiltersDisplayProperties();

class ListingDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      selectedParams: {
        on_demand: this.props.listing.on_demand || false,
        amenities: (this.props.listing.amenities || []).map(amenity => amenity.id)
      },
      filtersData: {}
    };

    this.validateFields = this.validateFields.bind(this);
    this.addError = this.addError.bind(this);
    this.addFiltersData = this.addFiltersData.bind(this);
    this.addSelectedParam = this.addSelectedParam.bind(this);
    this.handleAmenitySelected = this.handleAmenitySelected.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
  }

  componentDidMount() {
    ListingAmenitiesService.index()
                           .then((response) => { this.addFiltersData({ amenities: response.data.data.amenities }); })
                           .catch((error) => { this.addError(error); });
  }

  addSelectedParam(name, value) {
    let paramToAdd = {};
    let selectedParams = this.state.selectedParams;

    if (selectedParams[name].constructor === Array) {
      paramToAdd[name] = selectedParams[name].concat([value]);
    }
    else {
      paramToAdd[name] = value;
    }

    this.setState((prevState) => ({
      selectedParams: Helpers.extendObject(prevState.selectedParams, paramToAdd)
    }));
  }

  removeSelectedParam(name, value) {
    let selectedParams = this.state.selectedParams;

    if (selectedParams[name].constructor === Array) {
      let index = selectedParams[name].indexOf(value);

      if (index >= 0) {
        selectedParams[name].splice(index, 1);
      }
    }
    else {
      delete selectedParams[name];
    }

    this.setState({ selectedParams: selectedParams });
  }

  addFiltersData(data) {
    this.setState((prevState) => ({
      filtersData: Helpers.extendObject(prevState.filtersData, data)
    }));
  }

  addError(error) {
    this.setState((prevState) => ({
      errors: prevState.errors.concat(error)
    }));
  }

  validateFields() {
    return true;
  }

  getListingProperties() {
    return { on_demand: this.state.selectedParams.on_demand, amenities: this.state.selectedParams.amenities };
  }

  handleAmenitySelected(selected, value) {
    if (selected) {
      this.addSelectedParam('amenities', value);
    }
    else {
      this.removeSelectedParam('amenities', value);
    }
  }

  render() {
    let filtersData = this.state.filtersData;

    return (
      <div className="listing-form-details col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
        <ListingStep validateFields={ this.validateFields }
                     getListingProperties={ this.getListingProperties }
                     handleProceedToStepAndAddProperties={ this.props.handleProceedToStepAndAddProperties }
                     intl={ this.props.intl }
                     listing={ Helpers.extendObject(this.props.listing, this.getListingProperties()) } >
          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.vehicle'}) }>
            {
              [ 'body', 'make', 'model'].map(param => {
                return (
                  <ListingFormField key={ 'listings_vehicle_' + param } label={ this.props.intl.formatMessage({id: 'listings.' + param}) }>
                    <span className="listings-readonly-value">
                      { Helpers.detectObjectValue(this.props.listing.variant[param], filtersDisplayProperties) }
                    </span>
                  </ListingFormField>
                )
              })
            }
          </ListingFormFieldGroup>

          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.details'}) }>
            {
              [ 'engine_fuel', 'transmission', 'seat_count', 'door_count' ].map(param => {
                return (
                  <ListingFormField key={ 'listings_vehicle_' + param } label={ this.props.intl.formatMessage({id: 'listings.' + param}) }>
                    <span className="listings-readonly-value">
                      { Helpers.detectObjectValue(this.props.listing.variant[param], filtersDisplayProperties) }
                    </span>
                  </ListingFormField>
                )
              })
            }
          </ListingFormFieldGroup>

          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.on_demand_collection'}) }>
            <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.odc'}) }>
              <FormField id="listing_on_demand"
                         type="select"
                         value={ this.state.selectedParams.on_demand }
                         options={ [ { value: false, label: this.props.intl.formatMessage({ id: 'application.no' }) },
                                     { value: true, label: this.props.intl.formatMessage({ id: 'application.yes' }) } ] }
                         placeholder={ this.props.intl.formatMessage({id: 'listings.on_demand_collection'}) }
                         handleChange={ (selectedOption) => { this.addSelectedParam('on_demand', selectedOption.value) } } />
            </ListingFormField>
          </ListingFormFieldGroup>

          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.amenities'}) }>
            {
              (filtersData.amenities || []).map((amenity) => {
                let checkboxId = 'listings_amenity_' + amenity.id;

                return (
                  <div key={ 'listing_amenity_' + amenity.id } className="listings-amenity-filter fleet-checkbox">
                    <input type="checkbox" id={ checkboxId } name="amenities[]" defaultChecked={ this.state.selectedParams.amenities.indexOf(amenity.id) >= 0 } onChange={ (event) => { this.handleAmenitySelected(event.target.checked, amenity.id) } } />
                    <label htmlFor={ checkboxId } className="fs-16 text-secondary-font-weight">{ amenity.name }</label>
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
