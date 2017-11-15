import React, { Component } from 'react';

import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import VehicleBodiesService from '../../../shared/services/vehicles/vehicle_bodies_service';
import VehicleDoorCountsService from '../../../shared/services/vehicles/vehicle_door_counts_service';
import VehicleEngineFuelsService from '../../../shared/services/vehicles/vehicle_engine_fuels_service';
import VehicleMakesService from '../../../shared/services/vehicles/vehicle_makes_service';
import VehicleTransmissionsService from '../../../shared/services/vehicles/vehicle_transmissions_service';
import VehicleYearsService from '../../../shared/services/vehicles/vehicle_years_service';
import VehicleMakeModelsService from '../../../shared/services/vehicles/vehicle_make_models_service';
import VehicleSeatCountsService from '../../../shared/services/vehicles/vehicle_seat_counts_service';
import ListingAmenitiesService from '../../../shared/services/listings/listing_amenities_service';

import LocalizationService from '../../../shared/libraries/localization_service';

import Toggleable from '../../miscellaneous/toggleable';

import Dropdown from '../../miscellaneous/dropdown';

export default class ListingsFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open || false,
      selectedFilters: {},
      filterOptions: {
        vehicle: [],
        details: []
      },
      amenities: []
    };

    this.handleFilterSelected = this.handleFilterSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open || false
    });
  }

  componentDidUpdate(props, state) {
    let filterOptions = this.state.filterOptions;
    let selectedFilters = this.state.selectedFilters;
    let oldMakeID = state.selectedFilters.make_id;
    let vehicleFilters = filterOptions.vehicle;

    if (oldMakeID !== selectedFilters.make_id) {
      let foundIndex = vehicleFilters.findIndex(filterOption => {
        return filterOption.param === 'model_id';
      });

      if (foundIndex > -1) {
        vehicleFilters.splice(foundIndex, 1);
      }

      delete selectedFilters.model_id;

      VehicleMakeModelsService.index(selectedFilters.make_id).then(response => {
        vehicleFilters.push({
          position: 3,
          param: 'model_id',
          data: response.data.data.models,
          name: LocalizationService.formatMessage('filters.model')
        });

        filterOptions.vehicle = vehicleFilters;

        this.setState({
          filterOptions: filterOptions,
          selectedFilters: selectedFilters
        });
      });
    }
  }

  componentDidMount() {
    let filterOptions = this.state.filterOptions;

    VehicleBodiesService.index().then(response => {
      filterOptions.vehicle.push({
        position: 1,
        param: 'body_id',
        data: response.data.data.bodies,
        name: LocalizationService.formatMessage("filters.body")
      });

      this.setState({filterOptions: filterOptions});
    });

    VehicleMakesService.index().then(response => {
      filterOptions.vehicle.push({
        position: 2,
        param: 'make_id',
        data: response.data.data.makes,
        name: LocalizationService.formatMessage('filters.make')
      });

      this.setState({filterOptions: filterOptions});
    });

    VehicleYearsService.index().then(response => {
      filterOptions.vehicle.push({
        position: 4,
        param: 'year_id',
        data: response.data.data.years,
        name: LocalizationService.formatMessage('filters.year')
      });

      this.setState({filterOptions: filterOptions});
    });

    VehicleEngineFuelsService.index().then(response => {
      filterOptions.details.push({
        position: 1,
        param: 'engine_fuel_id',
        data: response.data.data.engine_fuels,
        name: LocalizationService.formatMessage('filters.engine_fuel')
      });

      this.setState({filterOptions: filterOptions});
    });

    VehicleTransmissionsService.index().then(response => {
      filterOptions.details.push({
        position: 2,
        param: 'transmission_id',
        data: response.data.data.transmissions,
        name: LocalizationService.formatMessage('filters.transmission')
      });

      this.setState({filterOptions: filterOptions});
    });

    VehicleSeatCountsService.index().then(response => {
      filterOptions.details.push({
        position: 3,
        param: 'seat_count_id',
        data: response.data.data.seat_counts,
        name: LocalizationService.formatMessage('filters.seat_count')
      });

      this.setState({filterOptions: filterOptions});
    });

    VehicleDoorCountsService.index().then(response => {
      filterOptions.details.push({
        position: 4,
        param: 'door_count_id',
        data: response.data.data.door_counts,
        name: LocalizationService.formatMessage('filters.door_count')
      });

      this.setState({filterOptions: filterOptions});
    });


    ListingAmenitiesService.index().then(response => {
      this.setState({amenities: response.data.data.amenities});
    });
  }

  handleFilterSelected(name, value) {
    let selectedFilters = JSON.parse(JSON.stringify(this.state.selectedFilters));

    if (name === 'amenities') {
      if (!selectedFilters[name]) {
        selectedFilters[name] = [];
      }

      let existingIndex = selectedFilters[name].findIndex(element => element === value);

      if (existingIndex > -1) {
        selectedFilters[name].splice(existingIndex, 1);
      }
      else {
        selectedFilters[name].push(value);
      }
    }
    else if (name === 'on_demand') {
      if (selectedFilters[name]) {
        delete selectedFilters[name];
      }
      else {
        selectedFilters[name] = true;
      }
    }
    else if (value) {
      selectedFilters[name] = value;
    }
    else {
      delete selectedFilters[name];
    }

    this.setState({
      selectedFilters: selectedFilters
    }, () => {
      this.props.handleFilterToggle(selectedFilters)
    });
  }

  renderListingsFilters() {
    let filterGroups = Object.keys(this.state.filterOptions);
    let selectedFilters = this.state.selectedFilters;

    if (this.state.open) {
      return (
        <div className="listings-filters white">
          {
            filterGroups.map((filtersGroup, index) => {
              let filters = this.state.filterOptions[filtersGroup];

              return (
                <div key={'search_filters_groups_' + filtersGroup}>
                  <FormattedMessage id={ 'listings.' + filtersGroup }>
                    { (text) => ( <span className="secondary-text-color text-secondary-font-weight fs-18">{ text }</span> ) }
                  </FormattedMessage>

                  {
                    filters
                      .sort((a, b) => a.position - b.position)
                      .map(filter => {
                        return <Dropdown key={ 'filters_group_' + filter.param }
                                         name={ filter.param }
                                         placeholder={ filter.name }
                                         items={ filter.data }
                                         selectedValue={ selectedFilters[filter.param] }
                                         valueProperty="id"
                                         displayProperty={ ['display', 'name','year','fuel','body','transmission'] }
                                         itemClickHandler={ this.handleFilterSelected } />
                      })
                  }
                  <div className='listings-filters-divider smoke-grey-two'></div>
                </div>
              )
            })
          }

          <div>
            <FormattedMessage id="application.other">
              { (text) => ( <span className="secondary-text-color text-secondary-font-weight fs-18">{ text }</span> ) }
            </FormattedMessage>
            <br/>
            <FormattedMessage id="listings.on_demand_collection">
              { (text) => (
                <div key='on_demand_filter' className="listings-amenity-filter fleet-checkbox">
                  <input type="checkbox" id='on-demand-checkbox' name="on-demand-checkbox" onChange={ (event) => { this.handleFilterSelected('on_demand') } } />
                  <label htmlFor={ 'on-demand-checkbox' } className="fs-16 text-secondary-font-weight">{ text }</label>
                </div>
              )}
            </FormattedMessage>
          </div>

          <div className="listings-filters-divider smoke-grey-two"></div>


          <div className="listings-filters-amenities">
            {
              this.state.amenities.map((amenity) => {
                let checkboxId = 'listings_amenity_' + amenity.id;

                return (
                  <div key={ 'listings_amenity_filter_' + amenity.id } className="listings-amenity-filter fleet-checkbox">
                    <input type="checkbox" id={ checkboxId } name="amenities[]" onChange={ (event) => { this.handleFilterSelected('amenities', amenity.id) } } />
                    <label htmlFor={ checkboxId } className="fs-16 text-secondary-font-weight">{ amenity.name }</label>
                  </div>
                )
              })
            }

            <div className="apply-listings-filters-div col-xs-12">
              <button className="btn secondary-color white-text col-xs-12" onClick={ () => { this.props.toggleFilters() } }>
                <FormattedMessage id="listings.see_listings" />
              </button>
            </div>
          </div>
        </div>
      )
    }
    else {
      return <div className="listings-filters white"></div>;
    }

  }

  render() {
    return (
      <Toggleable open={ this.state.open } >
        { this.renderListingsFilters() }
      </Toggleable>
    )
  }
}

ListingsFilters.propTypes = {
  handleFilterToggle: PropTypes.func.isRequired
};
