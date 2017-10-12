import React, {
  Component
} from 'react';

import {
  FormattedMessage,
  injectIntl
} from 'react-intl';

import PropTypes from 'prop-types';

import VehicleBodiesService from '../../../shared/services/vehicles/vehicle_bodies_service'
import VehicleDoorCountsService from '../../../shared/services/vehicles/vehicle_door_counts_service'
import VehicleEngineFuelsService from '../../../shared/services/vehicles/vehicle_engine_fuels_service'
import VehicleMakesService from '../../../shared/services/vehicles/vehicle_makes_service'
import VehicleTransmissionsService from '../../../shared/services/vehicles/vehicle_transmissions_service'
import VehicleYearsService from '../../../shared/services/vehicles/vehicle_years_service'
import VehicleMakeModelsService from '../../../shared/services/vehicles/vehicle_years_service'
import VehicleSeatCountsService from '../../../shared/services/vehicles/vehicle_seat_counts_service'
import ListingAmenitiesService from '../../../shared/services/listings/listing_amenities_service'

import Toggleable from '../../miscellaneous/toggleable';

import Constants from '../../../miscellaneous/constants';
import Helpers from '../../../miscellaneous/helpers';
import Dropdown from '../../miscellaneous/dropdown';

const listingsFiltersTypes = Constants.listingFiltersTypes();
const types = Constants.types();

const dropdownFilters = {
  vehicle: ['type', 'make', 'model', 'year'],
  details: ['fuel', 'transmission', 'passengers', 'doors']
};

const dummyData = {
  // TODO: replace those with actual data provided by the API endpoints.
  type: ['Type 1', 'Type 2', 'Type 3'],
  make: ['Make 1', 'Make 2', 'Make 3'],
  model: ['Model 1', 'Model 2', 'Model 3'],
  year: [2017, 2016, 2015],
  fuel: ['Fuel 1', 'Fuel 2', 'Fuel 3'],
  transmission: ['Transmission 1', 'Transmission 2'],
  passengers: [1, 2, 3, 4, 5],
  doors: [1, 2, 3, 4, 5]
};

const amenities = ['Sunroof', 'Air Conditioning', 'ABS', 'Cruise Control', 'Lane Assist'];

class ListingsFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open || false,
      selectedFilters: {},
      filterOptions: {
        vehicle: {},
        details: {}
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

  componentWillMount() {
    let filterOptions = this.state.filterOptions;

    VehicleYearsService.index().then(response => {
      filterOptions.vehicle.years = response.data.data.years
      this.setState({filterOptions: filterOptions})
    });
    VehicleBodiesService.index().then(response => {
      filterOptions.vehicle.bodies = response.data.data.bodies
      this.setState({filterOptions: filterOptions})
    });
    VehicleEngineFuelsService.index().then(response => {
      filterOptions.details.engine_fuels = response.data.data.engine_fuels
      this.setState({filterOptions: filterOptions})
    });
    VehicleMakesService.index().then(response => {
      filterOptions.vehicle.makes = response.data.data.makes
      this.setState({filterOptions: filterOptions})
    });
    if (this.state.selected_make_id) {
      VehicleMakeModelsService.index(this.state.selected_make_id).then(response => {
        filterOptions.vehicle.models = response.data.data.models
        this.setState({filterOptions: filterOptions})
      });
    }
    VehicleTransmissionsService.index().then(response => {
      filterOptions.details.transmissions = response.data.data.transmissions
      this.setState({filterOptions: filterOptions})
    });
    VehicleDoorCountsService.index().then(response => {
      filterOptions.details.door_counts = response.data.data.door_counts
      this.setState({filterOptions: filterOptions})
    });
    VehicleSeatCountsService.index().then(response => {
      filterOptions.details.seat_counts = response.data.data.seat_counts
      this.setState({filterOptions: filterOptions})
    });
    ListingAmenitiesService.index().then(response => {
      this.setState({amenities: response.data.data.amenities});
    })
  }

  handleFilterSelected(name, value) {
    let filters = this.state.selectedFilters;
    let valueIndex;

    if (listingsFiltersTypes[name] === types.array) {
      filters[name] = filters[name] || [];
      valueIndex = filters[name].indexOf(value);

      if (valueIndex < 0) {
        filters[name].push(value);
      }
      else {
        filters[name].splice(valueIndex, 1);
      }
    }
    else {
      filters[name] = value;
    }

    this.setState({
      selectedFilters: filters
    });
  }

  handleApplyFilters() {
    this.props.toggleFilters();
    this.props.setCurrentSearchParams(this.state.selectedFilters);
  }

  renderListingsFilters() {
    let filterGroups = Object.keys(this.state.filterOptions);

    return (
      <div className="listings-filters white" style={ { height: (Helpers.pageHeight() - 130) + 'px' } }>
        {
          filterGroups.map((filtersGroup, index) => {
            let filters = Object.keys(this.state.filterOptions[filtersGroup]);

            return (
              <div key={'search_filters_grous_' + filtersGroup}>
                <FormattedMessage id={ 'listings.' + filtersGroup }>
                  { (text) => ( <span className="secondary-text-color text-secondary-font-weight fs-18">{ text }</span> ) }
                </FormattedMessage>

                {
                  filters.map(filter => {
                    return <Dropdown
                            key={ 'filters_group_' + filter }
                            name={ filter }
                            placeholder={ this.props.intl.formatMessage({ id: 'listings.' + filter }) }
                            items={ this.state.filterOptions[filtersGroup][filter] }
                            valueProperty="id"
                            displayProperty={ ['display', 'name','year','fuel','body','transmission'] }
                            itemClickHandler={ this.handleApplyFilters } />
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
            { (text) => ( <span className="fs-16 text-secondary-font-weight">{ text }</span> ) }
          </FormattedMessage>
        </div>

        <div className="listings-filters-divider smoke-grey-two"></div>

        <div className="listings-filters-amenities">
          <FormattedMessage id="listings.amenities">
            { (text) => ( <span className="secondary-text-color text-secondary-font-weight fs-18">{ text }</span> ) }
          </FormattedMessage>

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
            <button className="btn secondary-color white-text col-xs-12" onClick={ () => { this.handleApplyFilters() } }>
              <FormattedMessage id="listings.see_listings" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  render() {

    return (
      <Toggleable open={ this.state.open } >
        { this.renderListingsFilters() }
      </Toggleable>
    )
  }
}

export default injectIntl(ListingsFilters);

ListingsFilters.propTypes = {
  setCurrentSearchParams: PropTypes.func.isRequired
};
