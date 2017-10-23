import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Dropdown, MenuItem } from 'react-bootstrap';

import Alert from '../miscellaneous/alert';
import Loading from '../miscellaneous/loading';
import FormField from '../miscellaneous/forms/form_field';

import ListingsService from '../../shared/services/listings/listings_service';
import ListingCalendarService from '../../shared/services/listings/listing_calendar_service';
import ListingBookingsService from '../../shared/services/listings/listing_bookings_service';
import LocalizationService from '../../shared/libraries/localization_service';

class BookingsCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      focusedInput: 'startDate',
      listings: [],
      currentAvailabilities: [],
      currentBookings: [],
      changedDays: [],
      nonAvailableDays: [],
      currentDailyRate: '',
      currentAvailableSetting: null,
      messages: []
    };

    this.renderDay = this.renderDay.bind(this);
    this.isDayBlocked = this.isDayBlocked.bind(this);
    this.fetchListings = this.fetchListings.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleVehicleSelect = this.handleVehicleSelect.bind(this);
    this.handleDailyRateChange = this.handleDailyRateChange.bind(this);
    this.handleAvailabilityCheckboxChange = this.handleAvailabilityCheckboxChange.bind(this);
    this.handleDateRangePickerFocusChange = this.handleDateRangePickerFocusChange.bind(this);

    this.handleCancelRateChanges = this.handleCancelRateChanges.bind(this);
    this.handleSaveRateChanges = this.handleSaveRateChanges.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
  }

  componentDidMount(prevProp, prevState) {
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
      ListingCalendarService.index(this.state.currentListing.id, moment(startDate).unix(), moment(endDate).unix())
                            .then(response => {
                              let availabilities = response.data.data.calendar;
                              let changedDays = availabilities.filter(availability => !availability.standard_rate);
                              let nonAvailableDays = availabilities.filter(availability => !availability.available);

                              ListingBookingsService.index(this.state.currentListing.id)
                                                    .then(response => {
                                                      let bookings = response.data.data.bookings;

                                                      this.setState({
                                                        loading: false,
                                                        changedDays: changedDays,
                                                        nonAvailableDays: nonAvailableDays,
                                                        currentAvailabilities: availabilities,
                                                        currentBookings: bookings,
                                                        startDate: null,
                                                        endDate: null,
                                                        focusedInput: 'startDate'
                                                      });
                                                    })
                                                    .catch((error) => {
                                                      this.setState((prevState) => ({
                                                        loading: false,
                                                        messages: prevState.messages.concat([ { type: 'error', message: error } ])
                                                      }));
                                                    });
                            })
                            .catch((error) => {
                              this.setState((prevState) => ({
                                loading: false,
                                messages: prevState.messages.concat([ { type: 'error', message: error } ])
                              }));
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

                      this.setState({
                        listings: listings,
                        currentListing: listings[0],
                        currentDailyRate: listings[0].price / 100
                      }, () => this.fetchCurrentAvailability());
                    })
                    .catch((error) => {
                      this.setState((prevState) => ({ messages: prevState.messages.concat([ { type: 'error', message: error } ]), loading: false }));
                    });
    });
  }

  handleDatesChange(startDate, endDate) {
    let newState = { startDate, endDate };
    let selectedDaysAvailabilities = this.state.currentAvailabilities.filter(availability => {
      let startAt = moment.unix(availability.start_at).utc();
      let endAt = moment.unix(availability.end_at).utc();

      return startAt.startOf('day').isSameOrAfter(startDate) && endAt.startOf('day').isSameOrBefore(endDate);
    });

    if (selectedDaysAvailabilities.length > 0) {
      newState.currentDailyRate = Math.max.apply(Math, selectedDaysAvailabilities.map(availability => availability.rate / 100));
      newState.currentAvailableSetting = selectedDaysAvailabilities.filter(availability => availability.available).length > 0;
    }

    this.setState(newState);
  }

  handleDateRangePickerFocusChange(focusedInput) {
    let newState = focusedInput ? { focusedInput } : { focusedInput: 'startDate' };

    this.setState(newState);
  }

  handleVehicleSelect(listingId) {
    let listings = this.state.listings;
    let currentListing = listings[listings.findIndex(listing => listing.id === listingId)];

    this.setState({ currentListing: currentListing, currentDailyRate: currentListing.price / 100 }, () => {
      this.fetchCurrentAvailability();
    });
  }

  handleAvailabilityCheckboxChange(checked, available) {
    let finalAvailableValue;

    if (checked) {
      let checkboxToDisable = available ? 'bookings_calendar_checkbox_blocked' : 'bookings_calendar_checkbox_available';
      document.getElementById(checkboxToDisable).checked = false;

      finalAvailableValue = available;
    }

    this.setState({ currentAvailableSetting: finalAvailableValue });
  }

  handleDailyRateChange(event) {
    this.setState({ currentDailyRate: event.target.value });
  }

  handleCancelRateChanges() {
    this.setState({
      startDate: null,
      endDate: null
    });
  }

  handleSaveRateChanges() {
    let available = this.state.currentAvailableSetting;
    let rate = this.state.currentDailyRate;
    let startDate = moment(this.state.startDate);
    let endDate = moment(this.state.endDate);
    let dates = [];

    this.setState({ loading: true }, () => {
      do {
        dates.push({
          start_at: startDate.utc().startOf('day').unix(),
          rate: rate * 100,
          available: available
        });

        startDate.add(1, 'days');
      } while(startDate.isSameOrBefore(endDate));

      ListingCalendarService.create(this.state.currentListing.id, dates)
                            .then(response => {
                              let message = this.props.intl.formatMessage({ id: 'bookings.saved_changes_successfully' });

                              this.setState(prevState => ({ loading: false, messages: prevState.messages.concat([{ type: 'success', message: message }]) }));
                            })
                            .catch(error => {
                              this.setState(prevState => ({ loading: false, messages: prevState.messages.concat([ { type: 'error', message: error } ]) }));
                            });
    });
  }

  handleAlertClose(messageToRemove) {
    let messages = this.state.messages;
    let index = messages.indexOf(messageToRemove);

    if (index > -1) {
      messages.splice(index, 1);

      this.setState({ messages: messages });
    }
  }

  isDayBlocked(day) {
    let bookings = this.state.currentBookings;

    return bookings.filter(booking => day.utc().isBetween(moment.unix(booking.start_at).utc(), moment.unix(booking.end_at).utc(), null, '[]')).length > 0;
  }

  renderDay(day) {
    let changedSpan;
    let changedDays = this.state.changedDays;
    let nonAvailableSpan;
    let nonAvailableDays = this.state.nonAvailableDays;

    if (changedDays.length > 0) {
      let index = changedDays.findIndex(availability => day.utc().isBetween(moment.unix(availability.start_at).utc(), moment.unix(availability.end_at).utc(), null, '[]'));

      if (index > -1) {
        changedSpan = (<span className="day-changed-span"></span>);
      }
    }

    if (nonAvailableDays.length > 0) {
      let index = nonAvailableDays.findIndex(availability => day.utc().isBetween(moment.unix(availability.start_at).utc(), moment.unix(availability.end_at).utc(), null, '[]'));

      if(index > -1) {
        nonAvailableSpan = (<span className="day-not-available-span"></span>);
      }
    }

    return (
      <span>
        { day.format('D') }
        { nonAvailableSpan || changedSpan }
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
    let setPriceDetails = '';

    if (this.state.startDate && this.state.endDate) {
      let currencySymbol = this.state.currentListing.country_configuration.country.currency_symbol;

      if (this.state.currentAvailableSetting !== false) {
        setPriceDetails = (
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
        )
      }

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
                         showClearDates={ false }
                         handleChange={ () => {} }
                         handleFocusChange={ () => {} } />
            </div>

            <div className="bookings-calendar-set-rate-details tertiary-text-color col-xs-12 no-side-padding">
              <div className="subtitle-font-weight col-xs-12 no-side-padding">
                <FormattedMessage id="bookings.availability" />
              </div>

              {
                ['available', 'blocked'].map(status => {
                  let checkboxId = `bookings_calendar_checkbox_${status}`
                  let availableSetting = status === 'available';

                  return (
                    <div key={ 'bookings_calendar_set_availability_' + status } className="text-secondary-font-weight ls-dot-two col-xs-12 no-side-padding">
                      <FormattedMessage id={ 'bookings.' + status } />

                      <div className="pull-right fleet-checkbox">
                        <input type="checkbox" name="bookings_calendar_status"
                               id={ checkboxId }
                               value={ availableSetting ? 1 : -1 }
                               checked={ this.state.currentAvailableSetting === availableSetting }
                               onChange={ (event) => { this.handleAvailabilityCheckboxChange(event.target.checked, availableSetting) } } />

                        <label htmlFor={ checkboxId }></label>
                      </div>
                    </div>
                  )
                })
              }
            </div>

            { setPriceDetails }

            <div className="bookings-calendar-save-changes tertiary-text-color text-center col-xs-12 no-side-padding">
              <Button bsStyle=' white secondary-text-color' onClick={ this.handleCancelRateChanges }>
                <FormattedMessage id="application.cancel" />
              </Button>

              <Button bsStyle=' secondary-color white-text' onClick={ this.handleSaveRateChanges } disabled={ !this.state.currentDailyRate }>
                <FormattedMessage id="bookings.save_changes" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return setRateTile;
  }

  renderMessages() {
    let messages = this.state.messages;

    return (
      <div className="col-xs-12 no-side-padding">
        {
          messages.map((message, index) => {
            return (
              <Alert key={ `bookings_calendar_messages_${index}` }
                     type={ message.type }
                     message={ message.message }
                     closeable={ true }
                     handleClose={ () => { this.handleAlertClose(message) } }>
              </Alert>
            )
          })
        }
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

          { this.renderMessages() }
        </div>
      </div>
    );
  }
}

export default injectIntl(BookingsCalendar);
