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
import Dropdown from '../../../miscellaneous/dropdown';

import VehicleBodiesService from '../../../../shared/services/vehicles/vehicle_bodies_service';
import VehicleMakesService from '../../../../shared/services/vehicles/vehicle_makes_service';
import VehicleMakeModelsService from '../../../../shared/services/vehicles/vehicle_make_models_service';
import VehicleEngineFuelsService from '../../../../shared/services/vehicles/vehicle_engine_fuels_service';
import VehicleTransmissionService from '../../../../shared/services/vehicles/vehicle_transmissions_service';
import VehicleSeatCountsService from '../../../../shared/services/vehicles/vehicle_seat_counts_service';
import VehicleDoorCountsService from '../../../../shared/services/vehicles/vehicle_door_counts_service';
import ListingAmenitiesService from '../../../../shared/services/listings/listing_amenities_service';

import Helpers from '../../../../miscellaneous/helpers';
import Constants from '../../../../miscellaneous/constants';

const listingFiltersDisplayProperties = Constants.listingFiltersDisplayProperties();
const filtersToLoadFirst = ['bodies', 'makes', 'amenities', 'engine_fuels', 'transmissions', 'seat_counts', 'door_counts'];
const requiredFields = ['body', 'make', 'model', 'fuel', 'transmission', 'passengers', 'doors'];

class ListingDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      selectedParams: {
        body: '',
        make: '',
        model: '',
        fuel: '',
        transmission: '',
        passengers: '',
        doors: '',
        odc: '',
        amenities: []
      },
      filtersData: {}
    };

    this.validateFields = this.validateFields.bind(this);
    this.addError = this.addError.bind(this);
    this.addFiltersData = this.addFiltersData.bind(this);
    this.addSelectedParam = this.addSelectedParam.bind(this);
    this.handleAmenitySelected = this.handleAmenitySelected.bind(this);
    this.checkInitialDataLoaded = this.checkInitialDataLoaded.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
  }

  componentDidMount() {
    let loadedFiltersData = {};

    VehicleBodiesService.index()
                        .then((response) => {
                          loadedFiltersData = Helpers.extendObject(loadedFiltersData, { bodies: response.data.data.bodies });
                          this.checkInitialDataLoaded(loadedFiltersData);
                        })
                        .catch((error) => { this.addError(error); });

    VehicleMakesService.index()
                        .then((response) => {
                          loadedFiltersData = Helpers.extendObject(loadedFiltersData, { makes: response.data.data.makes });
                          this.checkInitialDataLoaded(loadedFiltersData);
                        })
                        .catch((error) => { this.addError(error); });

    VehicleEngineFuelsService.index()
                             .then((response) => {
                               loadedFiltersData = Helpers.extendObject(loadedFiltersData, { engine_fuels: response.data.data.engine_fuels });
                               this.checkInitialDataLoaded(loadedFiltersData);
                             })
                             .catch((error) => { this.addError(error); });

    VehicleTransmissionService.index()
                              .then((response) => {
                                loadedFiltersData = Helpers.extendObject(loadedFiltersData, { transmissions: response.data.data.transmissions });
                                this.checkInitialDataLoaded(loadedFiltersData);
                              })
                              .catch((error) => { this.addError(error); });

    VehicleSeatCountsService.index()
                            .then((response) => {
                              loadedFiltersData = Helpers.extendObject(loadedFiltersData, { seat_counts: response.data.data.seat_counts });
                              this.checkInitialDataLoaded(loadedFiltersData);
                            })
                            .catch((error) => { this.addError(error); });

    VehicleDoorCountsService.index()
                            .then((response) => {
                              loadedFiltersData = Helpers.extendObject(loadedFiltersData, { door_counts: response.data.data.door_counts });
                              this.checkInitialDataLoaded(loadedFiltersData);
                            })
                            .catch((error) => { this.addError(error); });

    ListingAmenitiesService.index()
                           .then((response) => {
                            loadedFiltersData = Helpers.extendObject(loadedFiltersData, { amenities: response.data.data.amenities });
                             this.checkInitialDataLoaded(loadedFiltersData);
                            })
                           .catch((error) => { this.addError(error); });
  }

  componentDidUpdate(prevProps, prevState) {
    let selectedParams = this.state.selectedParams;

    if (selectedParams.make !== prevState.selectedParams.make) {
      VehicleMakeModelsService.index(selectedParams.make)
                              .then((response) => {
                                this.addFiltersData({ models: response.data.data.models });
                              })
                              .catch((error) => { this.addError(error); });
    }
  }

  checkInitialDataLoaded(loadedFiltersData) {
    let allDataLoaded = true;
    let currentFilter;

    for(let i = 0; i < filtersToLoadFirst.length; i++) {
      currentFilter = filtersToLoadFirst[i];

      if(!loadedFiltersData[currentFilter]) {
        allDataLoaded = false;
      }
    }

    if (allDataLoaded) {
      this.addFiltersData(loadedFiltersData);
    }
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
    let valid = true;
    let properties = this.state.selectedParams;

    for(let i = 0; i < requiredFields.length; i++ ) {
      if (properties[requiredFields[i]].length === 0) {
        valid = false;
      }
    }

    return valid;
  }

  getListingProperties() {
    return this.state.selectedParams;
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
    let listing = this.props.listing;
    let filtersData = this.state.filtersData;

    return (
      <div className="listing-form-details col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
        <ListingStep validateFields={ this.validateFields }
                     getListingProperties={ this.getListingProperties }
                     handleProceedToStepAndAddProperties={ this.props.handleProceedToStepAndAddProperties }
                     intl={ this.props.intl }>
          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.vehicle'}) }>
            {
              [ ['body', 'bodies'], ['make', 'makes'], ['model', 'models']].map((param) => {
                let paramName = param[0];
                let paramType = param[1];

                return (
                  <ListingFormField key={ 'listings_vehicle_' + paramName } label={ this.props.intl.formatMessage({id: 'listings.' + paramName}) }>
                    <Dropdown name={ paramName }
                              placeholder={ listing[paramName] || this.props.intl.formatMessage({ id: 'listings.' + paramName }) }
                              items={ filtersData[paramType] || [] }
                              valueProperty="id"
                              displayProperty={ listingFiltersDisplayProperties }
                              itemClickHandler={ this.addSelectedParam } />
                  </ListingFormField>
                )
              })
            }
          </ListingFormFieldGroup>

          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.details'}) }>
            {
              [['fuel', 'engine_fuels'], ['transmission', 'transmissions'], ['passengers', 'seat_counts'], ['doors', 'door_counts']].map((param) => {
                let paramName = param[0];
                let paramType = param[1];

                return (
                  <ListingFormField key={ 'listings_vehicle_' + paramName } label={ this.props.intl.formatMessage({id: 'listings.' + paramName}) }>
                    <Dropdown name={ paramName }
                              placeholder={ listing[paramName] || this.props.intl.formatMessage({ id: 'listings.' + paramName }) }
                              items={ filtersData[paramType] || [] }
                              valueProperty="id"
                              displayProperty={ listingFiltersDisplayProperties }
                              itemClickHandler={ this.addSelectedParam } />
                  </ListingFormField>
                )
              })
            }
          </ListingFormFieldGroup>

          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.on_demand_collection'}) }>
            <ListingFormField label={ this.props.intl.formatMessage({id: 'listings.odc'}) }>
              <Dropdown name='odc'
                        placeholder={ listing.on_demand_collection || this.props.intl.formatMessage({ id: 'listings.on_demand_collection' }) }
                        items={ [ this.props.intl.formatMessage({ id: 'application.no' }),
                                  this.props.intl.formatMessage({ id: 'application.yes' }) ] }
                        itemClickHandler={ this.addSelectedParam } />
            </ListingFormField>
          </ListingFormFieldGroup>

          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.amenities'}) }>
            {
              (filtersData.amenities || []).map((amenity) => {
                let checkboxId = 'listings_amenity_' + amenity.id;

                return (
                  <div key={ 'listing_amenity_' + amenity.id } className="listings-amenity-filter fleet-checkbox">
                    <input type="checkbox" id={ checkboxId } name="amenities[]" onChange={ (event) => { this.handleAmenitySelected(event.target.checked, amenity.id) } } />
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
