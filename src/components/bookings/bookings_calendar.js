import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Dropdown, MenuItem } from 'react-bootstrap';

import Loading from '../miscellaneous/loading';
import FormField from '../miscellaneous/forms/form_field';

import ListingsService from '../../shared/services/listings/listings_service';
import ListingAvailabilityService from '../../shared/services/listings/listing_availability_service';
import LocalizationService from '../../shared/libraries/localization_service';

class BookingsCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      focusedInput: 'startDate',
      listings: [],
      errors: []
    };

    this.fetchListings = this.fetchListings.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleDateRangePickerFocusChange = this.handleDateRangePickerFocusChange.bind(this);
    this.handleVehicleSelect = this.handleVehicleSelect.bind(this);
  }

  componentDidMount() {
    this.fetchListings();
  }

  fetchCurrentAvailability() {
    this.setState({
      loading: true
    }, () => {
      ListingAvailabilityService.index(this.state.currentListing.id, this.state.startDate.utc.unix(), this.state.endDate.utc.unix())
                                .then(response => {
                                  this.setState({ currentAvailabilities: response.data.data.availabilities, loading: false });
                                })
                                .catch((error) => {
                                  this.setState((prevState) => ({ errors: prevState.errors.push(error), loading: false }));
                                });
    });
  }

  fetchListings(){
    this.setState({
      loading: true
    }, () => {
      ListingsService.index()
                    .then((response) => {
                      let listings = response.data.data.listings;

                      this.setState({ listings: listings, currentListing: listings[0], loading: false });
                    })
                    .catch((error) => {
                      this.setState((prevState) => ({ errors: prevState.errors.push(error), loading: false }));
                    });
    });
  }

  handleDatesChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  handleDateRangePickerFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  handleVehicleSelect(listingId) {
    let listings = this.state.listings;
    let currentListing = listings[listings.findIndex(listing => listing.id === listingId)];

    this.setState({ currentListing: currentListing });
  }

  renderLoading() {
    if (!this.state.loading) {
      return '';
    }

    return (
      <div className="bookings-calendar-loading">
        <Loading />
      </div>
    )
  }

  renderTopBar() {
    let listings = this.state.listings;
    let currentListing = this.state.currentListing;
    let vehicleDropdownPlaceholder = LocalizationService.formatMessage('application.vehicle');

    if (currentListing) {
      vehicleDropdownPlaceholder = `${currentListing.variant.make.name} ${currentListing.variant.model.name} ${currentListing.variant.year.year}`
    }

    return (
      <div className="bookings-calendar-top-bar smoke-grey text-right">
        <FormattedMessage id="application.vehicle">
          { (text) => (<span className="text-uppercase tertiary-text-color">{ text }</span>) }
        </FormattedMessage>

        <Dropdown onSelect={this.handleVehicleSelect}
                  pullRight={true}
                  key='bookings_calendar_listing'
                  id='bookings_calendar_listing'>

          <Dropdown.Toggle className='secondary-color white-text fs-12'>
            { vehicleDropdownPlaceholder }
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {
              listings.map(listing => {
                return (
                  <MenuItem key={`bookings_calendar_vehicle_${listing.id}`}
                            eventKey={listing.id}
                            active={listing.id === this.state.currentListingId}>
                    { `${listing.variant.make.name} ${listing.variant.model.name} ${listing.variant.year.year}` }
                  </MenuItem>
                )
              })
            }
          </Dropdown.Menu>
      </Dropdown>
      </div>
    )
  }

  render() {

    return (
      <div className="bookings-calendar">

        { this.renderTopBar() }

        <div className="bookings-calendar-main-container col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          <FormField type='calendar'
                    className=''
                    id='booking_calendar_period'
                    placeholder='Dates'
                    startDate={ this.state.startDate }
                    endDate={ this.state.endDate }
                    focusedInput={ this.state.focusedInput }
                    handleChange={ this.handleDatesChange }
                    handleFocusChange={ this.handleDateRangePickerFocusChange } />

          { this.renderLoading() }
        </div>
      </div>
    );
  }
}

export default BookingsCalendar;
