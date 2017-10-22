import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { FormattedMessage } from 'react-intl';
import { Button, Dropdown, MenuItem } from 'react-bootstrap';

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

    this.renderDay = this.renderDay.bind(this);
    this.fetchListings = this.fetchListings.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleVehicleSelect = this.handleVehicleSelect.bind(this);
    this.handleDailyRateChange = this.handleDailyRateChange.bind(this);
    this.handleAvailabilityCheckboxChange = this.handleAvailabilityCheckboxChange.bind(this);
    this.handleDateRangePickerFocusChange = this.handleDateRangePickerFocusChange.bind(this);
  }

  componentDidMount() {
    this.fetchListings();
  }

  fetchCurrentAvailability() {
    let currentVisibleDays = this.calendar.state.visibleDays;
    let visibleDayMonths = Object.keys(currentVisibleDays);
    let lastVisibleDays = Object.keys(currentVisibleDays[visibleDayMonths[visibleDayMonths.length - 1]]);

    let startDate = Object.keys(currentVisibleDays[visibleDayMonths[0]])[0];
    let endDate = lastVisibleDays[lastVisibleDays.length - 1];

    this.setState({
      loading: true
    }, () => {
      ListingAvailabilityService.index(this.state.currentListing.id, moment(startDate).unix(), moment(endDate).unix())
                                .then(response => {
                                  let availabilities = response.data.data.availabilities;
                                  let nonAvailableDays = availabilities.filter(availability => !availability.available);

                                  this.setState({ currentAvailabilities: availabilities, nonAvailableDays: nonAvailableDays, loading: false });
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

                      this.setState({ listings: listings, currentListing: listings[0], currentDailyRate: listings[0].price / 100, loading: false });
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

    this.setState({ currentListing: currentListing }, () => {
      this.fetchCurrentAvailability();
    });
  }

  handleAvailabilityCheckboxChange(event) {
    let target = event.target;

    if (target.checked) {
      let checkboxToDisable = target.value.toString() === '1' ? 'bookings_calendar_checkbox_blocked' : 'bookings_calendar_checkbox_available';

      document.getElementById(checkboxToDisable).checked = false;
    }
  }

  handleDailyRateChange(event) {
    this.setState({ currentDailyRate: event.target.value });
  }

  renderDay(day) {
    let nonAvailableSpan = '';
    let nonAvailableDays = this.state.nonAvailableDays;

    if (nonAvailableDays) {
      let index = nonAvailableDays.findIndex(availability => moment.unix(availability.start_at).isSameOrBefore(day) && moment.unix(availability.end_at).isSameOrAfter(day));

      if(index > -1) {
        nonAvailableSpan = (<span className="day-not-available-span"></span>);
      }
    }

    return (
      <span>
        { day.format('D') }
        { nonAvailableSpan }
      </span>
    )
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

  renderSetRateTile() {
    let setRateTile = '';

    if (this.state.startDate && this.state.endDate) {
      let currencySymbol = this.state.currentListing.country_configuration.country.currency_symbol;

      setRateTile = (
        <div className="bookings-calendar-set-rate-tile col-xs-12 no-side-padding">
          <div className="bookings-calendar-set-rate-tile-title secondary-color white-text ls-dot-two col-xs-12 no-side-padding">
          </div>
          <div className="bookings-calendar-set-rate-tile-container col-xs-12 no-side-padding">

            <div className="text-center col-xs-12 no-side-padding">
              <FormField type='daterange'
                         id='bookings_calendar_rate_dates'
                         startDate={ this.state.startDate }
                         endDate={ this.state.endDate }
                         disabled={ true }
                         showClearDates={ false } />
            </div>

            <div className="bookings-calendar-set-rate-details tertiary-text-color col-xs-12 no-side-padding">
              <div className="subtitle-font-weight col-xs-12 no-side-padding">
                <FormattedMessage id="bookings.availability" />
              </div>

              {
                ['available', 'blocked'].map(status => {
                  let checkboxId = `bookings_calendar_checkbox_${status}`

                  return (
                    <div key={ 'bookings_calendar_set_availability_' + status } className="text-secondary-font-weight ls-dot-two col-xs-12 no-side-padding">
                      <FormattedMessage id={ 'bookings.' + status } />

                      <div className="pull-right fleet-checkbox">
                        <input type="checkbox" name="bookings_calendar_status" id={ checkboxId } value={ status === 'available' ? 1 : -1 } onChange={ this.handleAvailabilityCheckboxChange } />
                        <label htmlFor={ checkboxId }></label>
                      </div>
                    </div>
                  )
                })
              }
            </div>

            <div className="bookings-calendar-set-price-details tertiary-text-color col-xs-12 no-side-padding">
              <div className="subtitle-font-weight col-xs-12 no-side-padding">
                <FormattedMessage id="bookings.daily_rate" />
              </div>

              <FormField type="text"
                        id="bookings_calendar_set_rate_input"
                        value={ this.state.currentDailyRate }
                        handleChange={ this.handleDailyRateChange } />

              <Button bsStyle=' secondary-color white-text'>
                <FormattedMessage id="bookings.reset_to_default">
                  { text => <span> { `${text} (${currencySymbol}${this.state.currentListing.price / 100})` } </span>}
                </FormattedMessage>
              </Button>
            </div>

            <div className="bookings-calendar-save-changes tertiary-text-color text-center col-xs-12 no-side-padding">
              <Button bsStyle=' white secondary-text-color'>
                <FormattedMessage id="application.cancel" />
              </Button>

              <Button bsStyle=' secondary-color white-text'>
                <FormattedMessage id="bookings.save_changes" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return setRateTile;
  }

  render() {

    return (
      <div className="bookings-calendar">

        { this.renderTopBar() }

        <div className="bookings-calendar-main-container col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          <FormField type='calendar'
                    className=''
                    id='bookings_calendar_period'
                    placeholder='Dates'
                    startDate={ this.state.startDate }
                    endDate={ this.state.endDate }
                    focusedInput={ this.state.focusedInput }
                    handleChange={ this.handleDatesChange }
                    handleFocusChange={ this.handleDateRangePickerFocusChange }
                    renderDay={ this.renderDay }
                    isDayBlocked={ this.isDayBlocked }
                    fieldRef={(calendar) => this.calendar = calendar } />

          { this.renderSetRateTile() }

          { this.renderLoading() }
        </div>
      </div>
    );
  }
}

export default BookingsCalendar;
