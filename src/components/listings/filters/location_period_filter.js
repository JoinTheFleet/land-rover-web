import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Dropdown, MenuItem } from 'react-bootstrap';
import LocalizationService from '../../../shared/libraries/localization_service';
import FormField from '../../miscellaneous/forms/form_field';
import PropTypes from 'prop-types';
import LocationMenuItem from './location_menu_item';

class ListingPeriodFilter extends Component {
  render() {
    return (
      <div id="header_search_form" className={ 'global-search-form' + (this.props.hideSearchForm ? ' hide' : '') }>
        <div className='row'>
            <FormField type='text' className='' id='location' placeholder='Location' handleChange={ this.props.handleLocationChange } value={ this.props.locationName }/>
            <FormField type='text' className='' id='period' placeholder='Dates' handleChange={ this.props.handlePeriodChange } value={ this.props.periodDisplay }/>
            <div className='pull-left location-search-results'>
              <Dropdown open={ this.props.searchLocations && this.props.searchLocations.length > 0 }>
                  <Dropdown.Menu>
                    {
                      this.props.searchLocations.map(location => { return <LocationMenuItem location={ location } handleLocationSelect={ this.props.handleLocationSelect }/> })
                    }
                  </Dropdown.Menu>
              </Dropdown>
            </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(ListingPeriodFilter);

ListingPeriodFilter.propTypes = {
  handleLocationChange: PropTypes.func.isRequired,
  handlePeriodChange: PropTypes.func.isRequired,
  hideSearchForm: PropTypes.bool
}
