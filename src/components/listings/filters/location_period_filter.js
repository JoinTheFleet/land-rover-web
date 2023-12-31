import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Dropdown } from 'react-bootstrap';
import FormField from '../../miscellaneous/forms/form_field';
import PropTypes from 'prop-types';
import LocationMenuItem from './location_menu_item';
import momentPropTypes from 'react-moment-proptypes';
import CloseOnEscape from 'react-close-on-escape';
import { Link } from 'react-router-dom';

import Button from '../../miscellaneous/button';

import Helpers from '../../../miscellaneous/helpers';


export default class ListingPeriodFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: undefined,
      mobile: false
    };

    this.handleDateRangePickerFocusChange = this.handleDateRangePickerFocusChange.bind(this);
  }

  handleDateRangePickerFocusChange(focused) {
    this.setState({
      focused: focused
    });
  }

  render() {
    let button = '';

    if (this.props.showSearchButton) {
      const buttonContent = (
        <Button className='search'
                disabled={ this.props.disableSearchButton }
                onClick={ () => {
                  if (this.props.closeMenu) {
                    this.props.closeMenu();
                  }
                  if (this.props.hideSearchResults) {
                    this.props.hideSearchResults();
                  }
                  if (this.props.shouldClearFilters) {
                    this.props.clearFilters();
                  }

                  this.props.handleSearch();
                }}>
          <FormattedMessage id="application.search" />
        </Button>
      )

      if (this.props.disableSearchButton) {
        button = buttonContent;
      }
      else {
        button = (
          <Link to='/search'>
            { buttonContent }
          </Link>
        );
      }
    }

    return (
      <div id="header_search_form" className={ 'global-search-form ' + (this.props.hideSearchForm ? 'hide ' : '') + (this.props.homescreen ? '' : 'hidden-xs hidden-sm ') }>
        <div className='search_inputs'>
          <FormField type='text'
                     className=''
                     id='location'
                     placeholder='Location'
                     handleChange={ this.props.handleLocationChange }
                     handleFocusChange={ this.props.handleLocationFocus }
                     value={ this.props.locationName }/>

          <FormField type='daterange'
                     className=''
                     id='period'
                     placeholder='Dates'
                     daySize={ Helpers.pageWidth() > 767 ? 40 : Math.round(((Helpers.pageWidth() - 66) / 7)) }
                     handleChange={ this.props.handleDatesChange }
                     startDate={ this.props.startDate }
                     endDate={ this.props.endDate }
                     minimumNights={ 0 }
                     numberOfMonths={ Helpers.pageWidth() > 767 ? 2 : 1 }
                     focused={ this.state.focused }
                     handleFocusChange={ this.handleDateRangePickerFocusChange}/>

          <div className='location-search-results visible-xs'>
            <CloseOnEscape onEscape={ () => { this.props.hideSearchResults() }}>
              <Dropdown id="location_search_results_dropdown" open={ this.props.searchLocations && this.props.searchLocations.length > 0 } onToggle={ () => {} }>
                  <Dropdown.Menu>
                    {
                      this.props.searchLocations.map(location => { return <LocationMenuItem key={ `location_${location.id}` } location={ location } hideSearchResults={ this.props.hideSearchResults } handleLocationSelect={ this.props.handleLocationSelect }/> })
                    }
                  </Dropdown.Menu>
              </Dropdown>
            </CloseOnEscape>
          </div>
         </div>
        { button }
        <div className='location-search-results hidden-xs'>
          <CloseOnEscape onEscape={ () => { this.props.hideSearchResults() }}>
            <Dropdown id="location_search_results_dropdown" open={ this.props.searchLocations && this.props.searchLocations.length > 0 } onToggle={ () => {} }>
                <Dropdown.Menu>
                  {
                    this.props.searchLocations.map(location => { return <LocationMenuItem key={ `location_${location.id}` } location={ location } hideSearchResults={ this.props.hideSearchResults } handleLocationSelect={ this.props.handleLocationSelect }/> })
                  }
                </Dropdown.Menu>
            </Dropdown>
          </CloseOnEscape>
        </div>
      </div>
    )
  }
}

ListingPeriodFilter.propTypes = {
  hideSearchResults: PropTypes.func.isRequired,
  hideSearchForm: PropTypes.bool,
  handleLocationChange: PropTypes.func.isRequired,
  handleLocationFocus: PropTypes.func.isRequired,
  handleDatesChange: PropTypes.func.isRequired,
  handleLocationSelect: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj,
  locationName: PropTypes.string,
  searchLocations: PropTypes.array.isRequired,
  showSearchButton: PropTypes.bool,
  disableSearchButton: PropTypes.bool,
  homescreen: PropTypes.bool
}
