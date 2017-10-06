import React, {
  Component
} from 'react';

import {
  FormattedMessage,
  injectIntl
} from 'react-intl';


import Anime from 'react-anime';
import PropTypes from 'prop-types';

import Constants from '../../../miscellaneous/constants';
import Helpers from '../../../miscellaneous/helpers';
import Dropdown from '../../miscellaneous/dropdown';

const listingsFiltersTypes = Constants.listingFiltersTypes();
const types = Constants.types();

const dummyData = {
  type: ['Type 1', 'Type 2', 'Type 3'],
  make: ['Make 1', 'Make 2', 'Make 3'],
  model: ['Model 1', 'Model 2', 'Model 3'],
  year: [2017, 2016, 2015],
  fuel: ['Fuel 1', 'Fuel 2', 'Fuel 3'],
  transmission: ['Transmission 1', 'Transmission 2'],
  passengers: [1, 2, 3, 4, 5],
  doors: [1, 2, 3, 4, 5]
};

const dropdownFilters = {
  vehicle: ['type', 'make', 'model', 'year'],
  details: ['fuel', 'transmission', 'passengers', 'doors']
};

const amenities = ['Sunroof', 'Air Conditioning', 'ABS', 'Cruise Control', 'Lane Assist'];

class ListingsFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open || false,
      selectedFilters: {}
    };

    this.handleFilterSelected = this.handleFilterSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open || false
    });
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

  handleApplyFilters(){
    this.props.toggleFilters();
    this.props.setCurrentSearchParams(this.state.selectedFilters);
  }

  renderListingsFilters() {
    let filterGroups = Object.keys(dropdownFilters);

    return (
      <div className="listings-filters white" style={ { height: (Helpers.pageHeight() - 130) + 'px' } }>
        {
          filterGroups.map((filtersGroup, index) => {
            let filters = dropdownFilters[filtersGroup];

            return (
              <div key={ 'filters_group_' + filtersGroup } >
                <FormattedMessage id={ 'listings.' + filtersGroup }>
                  { (text) => ( <span className="secondary-text-color text-secondary-font-weight fs-18">{ text }</span> ) }
                </FormattedMessage>

                {
                  filters.map((paramName) => {
                    return (
                      <Dropdown key={ 'filter_' + filtersGroup + '_' + paramName  } placeholder={ this.props.intl.formatMessage({ id: 'listings.' + paramName }) }
                          items={ dummyData[paramName] }
                          name={paramName}
                          itemClickHandler={ this.handleFilterSelected } />
                    );
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
            amenities.map((amenity) => {
              let checkboxId = 'listings_amenity_' + amenity;

              return (
                <div key={ 'listings_amenity_filter_' + amenity } className="listings-amenity-filter fleet-checkbox">
                  <input type="checkbox" id={ checkboxId } name="amenities[]" onChange={(event) => { this.handleFilterSelected('amenities', amenity) } } />
                  <label htmlFor={ checkboxId } className="fs-16 text-secondary-font-weight">{ amenity }</label>
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
      <Anime easing="easeOutQuart"
             duration={500}
             opacity={this.state.open ? 1 : 0}
             begin={(anime) => {
               if(this.state.open) {
                 anime.animatables[0].target.style.display = 'block';
               }
             }}
             complete={(anime) => {
               if(!this.state.open) {
                 anime.animatables[0].target.style.display = 'none';
               }
             }}>
        { this.renderListingsFilters() }
      </Anime>
    )
  }
}

export default injectIntl(ListingsFilters);

ListingsFilters.propTypes = {
  setCurrentSearchParams: PropTypes.func.isRequired
};
