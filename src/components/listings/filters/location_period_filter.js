import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Dropdown } from 'react-bootstrap';
import FormField from '../../miscellaneous/forms/form_field';
import PropTypes from 'prop-types';
import LocationMenuItem from './location_menu_item';
import momentPropTypes from 'react-moment-proptypes';
import CloseOnEscape from 'react-close-on-escape';
import { Link } from 'react-router-dom';

class ListingPeriodFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false
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
      button = (
        <Link to='/dashboard'>
          <Button bsStyle='primary search'
                  onClick={ this.props.handleSearch }>
            Search
          </Button>
        </Link>
      );
    }
    return (
      <div id="header_search_form" className={ 'global-search-form' + (this.props.hideSearchForm ? ' hide' : '') }>
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
                     handleChange={ this.props.handleDatesChange }
                     startDate={ this.props.startDate }
                     endDate={ this.props.endDate }
                     minimumNights={ 0 }
                     focused={ this.state.focused }
                     handleFocusChange={ this.handleDateRangePickerFocusChange}/>
         </div>
        { button }
        <div className='location-search-results'>
          <CloseOnEscape onEscape={ () => { this.props.hideSearchResults() }}>
            <Dropdown id="location_search_results_dropdown" open={ this.props.searchLocations && this.props.searchLocations.length > 0 }>
                <Dropdown.Menu>
                  {
                    this.props.searchLocations.map(location => { return <LocationMenuItem key={ `location_${location.id}` } location={ location } handleLocationSelect={ this.props.handleLocationSelect }/> })
                  }
                </Dropdown.Menu>
            </Dropdown>
          </CloseOnEscape>
        </div>
      </div>
    )
  }
}

export default injectIntl(ListingPeriodFilter);

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
  showSearchButton: PropTypes.bool
}
