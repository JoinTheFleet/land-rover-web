import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import CloseOnEscape from 'react-close-on-escape';
import PropTypes from 'prop-types';
import moment from 'moment';
import Alert from 'react-s-alert';

import BookingStatus from '../booking_status';
import BookingSurvey from './booking_survey';
import BookingFormCheckIn from './booking_form_check_in';
import LocationMenuItem from '../../listings/filters/location_menu_item';
import FormField from '../../miscellaneous/forms/form_field';
import Loading from '../../miscellaneous/loading';
import Toggleable from '../../miscellaneous/toggleable';
import RatingInput from '../../miscellaneous/rating_input';
import ConfirmationModal from '../../miscellaneous/confirmation_modal';

import ListingQuotationService from '../../../shared/services/listings/listing_quotation_service';
import ListingBookingsService from '../../../shared/services/listings/listing_bookings_service';
import ListingsService from '../../../shared/services/listings/listings_service';
import BookingsService from '../../../shared/services/bookings/bookings_service';
import PaymentMethodsService from '../../../shared/services/payment_methods_service';
import GeolocationService from '../../../shared/services/geolocation_service';
import LocationsService from '../../../shared/services/locations_service';
import LocalizationService from '../../../shared/libraries/localization_service';
import S3Uploader from '../../../shared/external/s3_uploader';

import Helpers from '../../../miscellaneous/helpers';
import Errors from '../../../miscellaneous/errors';
import Geolocation from '../../../miscellaneous/geolocation';

import infoIcon from '../../../assets/images/info_icon.png';

const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=LATITUDE,LONGITUDE';

class BookingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalsOpen: {
        'cancelBooking': false,
        'checkOut': false,
        'rejectBooking': false,
        'writeReview': false
      },
      booking: {
        agreed_to_rules: false,
        agreed_to_insurance_terms: false,
        host_message: ''
      },
      onDemandAddresses: {
        pick_up_location: '',
        drop_off_location: ''
      },
      quotation: {},
      pricingQuote: {},
      paymentMethod: {},
      focusedInput: '',
      focusedLocationInput: '',
      searchLocations: [],
      errors: [],
      numberOfMonthsToShow: Helpers.pageWidth() >= 768 ? 2 : 1,
      loading: false,
      bookingCompleted: false,
      showBookingSurvey: false,
      showMessageToOwnerTextArea: false,
      locationTimeout: null
    };

    this.fetchBooking = this.fetchBooking.bind(this);
    this.fetchQuotation = this.fetchQuotation.bind(this);
    this.fetchPaymentMethods = this.fetchPaymentMethods.bind(this);
    this.fetchLocationFromListingPosition = this.fetchLocationFromListingPosition.bind(this);

    this.addError = this.addError.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.showBookingSurvey = this.showBookingSurvey.bind(this);
    this.submitBookingRequest = this.submitBookingRequest.bind(this);
    this.respondToBookingRequest = this.respondToBookingRequest.bind(this);
    this.setPickUpAndDropOffLocation = this.setPickUpAndDropOffLocation.bind(this);

    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleCancelBooking = this.handleCancelBooking.bind(this);
    this.handleBookingChange = this.handleBookingChange.bind(this);
    this.handleConfirmCheckIn = this.handleConfirmCheckIn.bind(this);
    this.handleOnDemandSelect = this.handleOnDemandSelect.bind(this);
    this.handleConfirmCheckOut = this.handleConfirmCheckOut.bind(this);
    this.handleOnDemandLocationChange = this.handleOnDemandLocationChange.bind(this);
    this.handleOnDemandLocationSelect = this.handleOnDemandLocationSelect.bind(this);
    this.handleInsuranceCriteriaChange = this.handleInsuranceCriteriaChange.bind(this);
    this.handlePickUpDropOffTimeSelect = this.handlePickUpDropOffTimeSelect.bind(this);

    document.addEventListener('resize', this.handleWindowResize);
  }

  componentWillMount() {
    let location = this.props.location;

    if (location && location.state && location.state.booking) {
      this.setState({
        booking: location.state.booking,
        listing: location.state.booking.listing,
        pricingQuote: location.state.booking.quotation
      }, this.fetchBookingOnDemandLocations);
    }
    else {
      if (this.props.match.params.id) {
        this.fetchBooking(true);
      }
      else if (this.props.match.params.listing_id) {
        this.setState({ loading: true }, () => {
          ListingsService.show(this.props.match.params.listing_id)
                         .then(response => {
                           this.setState({
                             listing: response.data.data.listing
                           }, () => {
                             let quotation = this.state.quotation;
                             let booking = this.state.booking;
                             let pricingQuote = this.state.pricingQuote;

                             if (location && location.state && location.state.pricingQuote) {
                               pricingQuote = location.state.pricingQuote;
                             }

                             if (location && location.state && location.state.quotation) {
                               quotation = location.state.quotation;
                               booking.quotation = quotation.uuid;
                             }

                             if (typeof quotation.insurance_criteria === 'undefined') {
                               quotation.insurance_criteria = [];
                             }

                             if (typeof quotation.on_demand === 'undefined') {
                               quotation.on_demand = false;
                             }

                             if (typeof quotation.on_demand_location === 'undefined') {
                              let location = this.state.listing.location || {
                                latitude: 0,
                                longitude: 0
                              };

                               quotation.on_demand_location = {
                                 pick_up_time: this.state.listing.check_in_time,
                                 drop_off_time: this.state.listing.check_out_time,
                                 pick_up_location: location,
                                 drop_off_location: location
                               };
                             }

                             this.setState({
                               loading: false,
                               booking: booking,
                               quotation: quotation,
                               pricingQuote: pricingQuote
                             });
                           });
                         });
        });
      }
    }
  }

  componentDidMount() {
    this.fetchPaymentMethods(this.fetchLocationFromListingPosition, this.fetchLocationFromListingPosition);
  }

  fetchBooking(fetchLocations) {
    let bookingId = this.props.match.params.id;

    if (!bookingId) {
      return;
    }

    this.setState({ loading: true }, () => {
      BookingsService.show(bookingId)
                     .then(response => {
                       this.setState({
                         booking: response.data.data.booking,
                         listing: response.data.data.booking.listing,
                         pricingQuote: response.data.data.booking.quotation,
                         loading: false
                       }, () => {
                         if (fetchLocations) {
                           this.fetchBookingOnDemandLocations();
                         }
                       });
                     })
                     .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  fetchPaymentMethods(successCallback, errorCallback) {
    this.setState({
      loading: true,
    }, () => {
      PaymentMethodsService.index()
                           .then(response => {
                             this.setState({ loading: false, paymentMethod: response.data.data.payment_methods[0] });

                             if (successCallback) {
                              successCallback();
                             }
                           })
                           .catch(error => {
                             this.addError(error);

                             if (errorCallback) {
                               errorCallback();
                             }
                           });
    });
  }

  fetchLocationFromListingPosition() {
    if (!this.state.listing) {
      return;
    }

    let location = Geolocation.getLocationFromListing(this.state.listing);

    if (location) {
      this.setPickUpAndDropOffLocation(location);
    }

    GeolocationService.getCurrentPosition()
                      .then(position => {
                        this.setPickUpAndDropOffLocation({
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude
                        });
                      });
  }

  fetchBookingOnDemandLocations() {
    if (!this.state.booking.on_demand_details) {
      return;
    }

    let pickUpLocation = this.state.booking.on_demand_details.pick_up_location;
    let dropOffLocation = this.state.booking.on_demand_details.drop_off_location;
    let onDemandAddresses = this.state.onDemandAddresses;

    this.setState({
      loading: true
    }, () => {
      GeolocationService.getLocationFromPosition(pickUpLocation)
                        .then(results => {
                          onDemandAddresses.pick_up_location = results[0].formatted_address;

                          this.setState({ onDemandAddresses: onDemandAddresses }, () => {
                            GeolocationService.getLocationFromPosition(dropOffLocation)
                                              .then(results => {
                                                onDemandAddresses.drop_off_location = results[0].formatted_address;

                                                this.setState({ onDemandAddresses: onDemandAddresses, loading: false });
                                              });
                          });
                        })
                        .catch(error => this.addError(error));
    });
  }

  setPickUpAndDropOffLocation(location) {
    this.setState({
      loading: true
    }, () => {
      GeolocationService.getLocationFromPosition(location)
                        .then(results => {
                          let address = results[0].formatted_address;
                          let quotation = this.state.quotation;

                          if (!quotation.on_demand_location) {
                            quotation.on_demand_location = {};
                          }

                          quotation.on_demand_location.pick_up_location = quotation.on_demand_location.drop_off_location = {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            address: address
                          };

                          this.setState({ loading: false, quotation: quotation, onDemandAddresses: { pick_up_location: address, drop_off_location: address } });
                        })
                        .catch(error => this.addError(error));
    });
  }

  fetchQuotation(successCallback, errorCallback) {
    this.setState({
      loading: true
    }, () => {
      let quotation = this.state.quotation;

      ListingQuotationService.create(this.state.listing.id, quotation.start_at, quotation.end_at, quotation.on_demand, quotation.on_demand_location, {})
                             .then(response => {
                               this.setState({
                                 pricingQuote: response.data.data.pricing_quote,
                                 loading: false
                               }, successCallback);
                             })
                             .catch(error => {
                               errorCallback();

                               this.addError(error);
                             });
    });
  }

  addError(error) {
    this.setState({ loading: false }, () => { Alert.error(Errors.extractErrorMessage(error)); });
  }

  toggleModal(modalName) {
    let modalsOpen = this.state.modalsOpen;

    if (Object.keys(modalsOpen).indexOf(modalName) > -1) {
      modalsOpen[modalName] = !modalsOpen[modalName];

      this.setState({ modalsOpen: modalsOpen });
    }
  }

  submitBookingRequest(){
    let booking = this.state.booking;

    this.setState({ loading: true }, () => {
      ListingBookingsService.create(this.state.listing.id, this.state.pricingQuote.uuid, booking.agreed_to_rules, booking.agreed_to_insurance_terms, booking.host_message)
      .then(response => {
        this.setState({
          bookingCompleted: true,
          loading: false
        });

        Alert.success(LocalizationService.formatMessage('bookings.booking_requested_successfully'));
      })
      .catch(error => {
        this.addError(error);
      });
    });
  }

  showBookingSurvey(show) {
    this.setState({ showBookingSurvey: show }, () => {
      if (!show) {
        this.fetchBooking();
      }
    });
  }

  respondToBookingRequest(accept) {
    this.setState({
      loading: true
    }, () => {
      if (accept) {
        BookingsService.confirm(this.state.booking.id)
                       .then(response => {
                         this.setState({
                           booking: response.data.data.booking,
                           loading: false
                         }, () => {
                           Alert.success(LocalizationService.formatMessage('bookings.booking_accepted_successfully'));
                         });
                       })
                       .catch(error => this.addError(Errors.extractErrorMessage(error)));
      }
      else {
        BookingsService.reject(this.state.booking.id)
                       .then(response => {
                         this.setState({
                           booking: response.data.data.booking,
                           loading: false
                         }, () => {
                           Alert.success(LocalizationService.formatMessage('bookings.booking_rejected_successfully'))
                         });
                       })
                       .catch(error => this.addError(Errors.extractErrorMessage(error)));
      }
    });
  }

  handleWindowResize() {
    let width = Helpers.pageWidth();

    if (width < 768 && this.state.numberOfMonthsToShow === 2) {
      this.setState({ numberOfMonthsToShow: 1 });
    }
    else if(width >= 768 && this.state.numberOfMonthsToShow === 1 ) {
      this.setState({ numberOfMonthsToShow: 2 });
    }
  }

  handleDatesChange(dates) {
    let quotation = this.state.quotation;

    quotation.start_at = dates.startDate.unix();

    if (dates.endDate) {
      quotation.end_at = dates.endDate.unix();
    }

    this.setState({ quotation: quotation }, this.fetchQuotation);
  }

  handleOnDemandSelect(selected) {
    let quotation = this.state.quotation;
    quotation.on_demand = selected;

    this.setState({ quotation: quotation }, this.fetchQuotation(null, () => {
      quotation.on_demand = false;
      this.setState({ quotation: quotation });
    }));
  }

  handlePickUpDropOffTimeSelect(type, time, timeString) {
    let quotation = this.state.quotation;
    quotation.on_demand_location[type] = moment.duration(time.format('HH:MM:SS')).asSeconds();

    this.setState({ quotation: quotation }, this.fetchQuotation);
  }

  handleOnDemandLocationChange(type, value) {
    let onDemandAddresses = this.state.onDemandAddresses;
    onDemandAddresses[type] = value;

    this.setState({
      onDemandAddresses: onDemandAddresses
    }, () => {
      let locationTimeout = this.state.locationTimeout;

      if (locationTimeout) {
        clearTimeout(locationTimeout);
      }

      if (value.length > 0) {
        locationTimeout = setTimeout(() => {
          LocationsService.create(null, null, value)
                          .then(response => {
                            this.setState({
                              searchLocations: response.data.data.locations
                            });
                          })
                          .catch(error => {
                            this.addError(Errors.extractErrorMessage(error));
                          });
        }, 1000);
      }

      this.setState({ locationTimeout: locationTimeout });
    });
  }

  handleOnDemandLocationSelect(type, location) {
    let onDemandAddresses = this.state.onDemandAddresses;
    let quotation = this.state.quotation;
    let address = location.address;

    onDemandAddresses[type] = address;

    quotation.on_demand_location[type] = {
      latitude: location.latitude,
      longitude: location.longitude,
      address: address
    };

    this.setState({ quotation: quotation, onDemandAddresses: onDemandAddresses, focusedLocationInput: '', searchLocations: [] }, this.fetchQuotation);
  }

  handleInsuranceCriteriaChange(criteriaId, value) {
    let quotation = this.state.quotation;
    let filledInCriteria = quotation.insurance_criteria;
    let index = filledInCriteria.findIndex(criteria => criteria.id === criteriaId);

    if (index > - 1) {
      filledInCriteria[index].value = value;
    }
    else {
      filledInCriteria.push({ id: criteriaId, value: value });
    }

    this.setState({ quotation: quotation }, this.fetchQuotation);
  }

  handleBookingChange(param, value) {
    let paramToAdd = {};
    paramToAdd[param] = value;

    this.setState(prevState => ({ booking: Helpers.extendObject(prevState.booking, paramToAdd) }));
  }

  handleCancelBooking() {
    this.setState({
      loading: true
    }, () => {
      BookingsService.cancel(this.state.booking.id)
                     .then(response => {
                       this.fetchBooking();
                       Alert.success(LocalizationService.formatMessage('bookings.booking_cancelled_successfully'));
                     })
                     .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  handleConfirmCheckIn(renterSignature, ownerSignature) {
    let renterSignatureUrl = '';
    let ownerSignatureUrl = '';

    this.setState({
      loading: true
    }, () => {
      S3Uploader.upload(Helpers.dataURItoBlob(renterSignature), 'booking_signatures')
                .then(response => {
                  renterSignatureUrl = response.Location;

                  S3Uploader.upload(Helpers.dataURItoBlob(ownerSignature), 'booking_signatures')
                            .then(response => {
                              ownerSignatureUrl = response.Location;

                              BookingsService.check_in(this.state.booking.id, { renter_signature_url: renterSignatureUrl, owner_signature_url: ownerSignatureUrl })
                                             .then(response => {
                                               this.fetchBooking();
                                               Alert.success(LocalizationService.formatMessage('bookings.check_in_successful'));
                                             })
                                             .catch(error => this.addError(Errors.extractErrorMessage(error)));
                            })
                            .catch(error => this.addError(Errors.extractErrorMessage(error)));
                })
                .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  handleConfirmCheckOut() {
    this.setState({
      loading: true
    }, () => {
      BookingsService.check_out(this.state.booking.id)
                     .then(response => {
                       this.toggleModal('writeReview');
                       Alert.success(LocalizationService.formatMessage('bookings.check_out_successful'));
                     })
                     .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  hideLocationSearchResults(type) {
    let address = this.state.quotation.on_demand_location[type].address;
    let onDemandAddresses = this.state.onDemandAddresses;

    onDemandAddresses[type] = address;

    this.setState({ searchLocations: [], onDemandAddresses: onDemandAddresses });
  }

  renderListingDetails() {
    let listing = this.state.listing;

    if (!listing) {
      return '';
    }

    let vehicleTitle = `${listing.variant.make.name}, ${listing.variant.model.name}`;
    let listingOwnerDetails = '';

    if (this.props.currentUserRole !== 'owner') {
      listingOwnerDetails = (
        <div className="booking-form-listing-user-details text-center pull-right">
          <img src={ listing.user.images.original_url } alt="listing_user_avatar" />

          <Link to={`/users/${listing.user.id}`}>
            <span className="secondary-text-color fs-18">{ listing.user.first_name + ' ' + listing.user.last_name }</span>
          </Link>
        </div>
      );
    }

    return (
      <div className="booking-form-listing-details col-xs-12 no-side-padding">
        <span className="subtitle-font-weight fs-36">{ vehicleTitle }</span>
        <span className="fs-36"> { ` ${listing.variant.year.year}` } </span>

        { listingOwnerDetails }
      </div>
    )
  }

  renderBookingStatus() {
    let bookingStatusDiv = '';

    if (this.state.booking.id) {
      bookingStatusDiv = (
        <div className="booking-form-status booking-form-box col-xs-12 no-side-padding">
          <div className="pull-left tertiary-text-color"> { LocalizationService.formatMessage('bookings.your_booking_is') } </div>
          <div className="pull-right"> <BookingStatus booking={ this.state.booking } /> </div>
        </div>
      )
    }

    return bookingStatusDiv;
  }

  renderRenterDetails() {
    let renterDetailsDiv = '';
    let booking = this.state.booking;

    if (!booking) {
      return '';
    }

    if (this.props.currentUserRole === 'owner') {

      renterDetailsDiv = (
        <div className="booking-form-renter-details booking-form-box col-xs-12 no-side-padding">
          <div className="booking-form-renter-image-and-name">
            <div className="booking-form-renter-image pull-left" style={ { backgroundImage: `url(${booking.renter.images.medium_url})` } }></div>
            <div className="booking-form-renter-name-and-rating pull-left">
              <Link to={`/users/${booking.renter.id}`}>
                <div className="fs-18 secondary-text-color"> { booking.renter.name } </div>
              </Link>

              <RatingInput rating={ booking.renter.renter_review_summary.rating } />
              <span className="fs-18"> { LocalizationService.formatMessage('listings.total_reviews', { total_reviews: booking.renter.renter_review_summary.total_reviews }) } </span>
            </div>
          </div>

          <div className="booking-form-renter-identification tertiary-text-color col-xs-12 no-side-padding">
            <div className="booking-form-details-row">
              <span> { LocalizationService.formatMessage('bookings.license_number') } </span>
              <span className="pull-right"> { booking.renter.identification.license_number } </span>
            </div>
            <div className="booking-form-details-row">
              <span> { LocalizationService.formatMessage('bookings.license_type') } </span>
              <span className="pull-right"> { booking.renter.identification.type.name } </span>
            </div>
            <div className="booking-form-details-row">
              <span> { LocalizationService.formatMessage('bookings.issue_date') } </span>
              <span className="pull-right"> { `${booking.renter.identification.issue_month}/${booking.renter.identification.issue_year}` } </span>
            </div>
            <div className="booking-form-details-row">
              <span> { LocalizationService.formatMessage('bookings.country_of_registration') } </span>
              <span className="pull-right"> { booking.renter.identification.country.name } </span>
            </div>
          </div>
        </div>
      )
    }

    return renterDetailsDiv;
  }

  renderQuotationDetails() {
    let pricingQuote = this.state.pricingQuote;
    let disableInputs = this.state.booking.id;

    if (Object.keys(pricingQuote).length === 0) {
      return '';
    }

    let priceItems = pricingQuote.price_items;
    let onDemandFeeIndex = priceItems.findIndex(priceItem => priceItem.type === 'ON_DEMAND');

    if (onDemandFeeIndex > -1 && onDemandFeeIndex < priceItems.length - 2) {
      let onDemandFee = JSON.parse(JSON.stringify(priceItems[onDemandFeeIndex]));

      priceItems.splice(onDemandFeeIndex, 1);
      priceItems.splice(priceItems.length - 1, 0, onDemandFee);
    }

    return (
      <div className="booking-form-quotation-details booking-form-box col-xs-12 no-side-padding">
        <div className="booking-form-quotation-datepicker-title col-xs-12 no-side-padding">
          <div className="tertiary-text-color col-xs-6 subtitle-font-weight no-side-padding"> { LocalizationService.formatMessage('bookings.check_in_date') } </div>
          <div className="tertiary-text-color col-xs-6 subtitle-font-weight no-side-padding"> { LocalizationService.formatMessage('bookings.check_out_date') } </div>
        </div>

        <FormField type="daterange"
                   id="bookings_form_quotation_dates"
                   startDate={ moment.unix(pricingQuote.check_in) }
                   endDate={ moment.unix(pricingQuote.check_out) }
                   focusedInput={ this.state.focusedInput }
                   disabled={ disableInputs }
                   showClearDates={ false }
                   minimumNights={ 0 }
                   handleFocusChange={ (focusedInput) => { this.setState({ focusedInput }) } }
                   handleChange={ this.handleDatesChange }
                   numberOfMonths={ this.state.numberOfMonthsToShow } />

        <div className="col-xs-12 no-side-padding">
            {
              priceItems.map((priceItem, index) => {
                let className = 'booking-form-quotation-details-rate col-xs-12 no-side-padding text-capitalize tertiary-text-color fs-16';
                className += priceItem.type === 'TOTAL' ? ' subtitle-font-weight' : ' text-secondary-font-weight';

                let onDemandDiv = '';
                let onDemandDetailsDiv = '';
                let isOnDemand = this.state.quotation.on_demand || this.state.booking.on_demand;

                if (this.state.listing.on_demand) {
                  if ((isOnDemand && priceItem.type === 'ON_DEMAND') || (!isOnDemand && priceItem.type === 'TOTAL')) {
                    let checkboxId = 'booking_form_quotation_on_demand_checkbox';

                    onDemandDiv = (
                      <div className="booking-form-quotation-on-demand text-secondary-font-weight col-xs-12 no-side-padding">
                        <div className="pull-left"> { LocalizationService.formatMessage('listings.on_demand_collection') } </div>
                        <div className="pull-right">
                          <div className="booking-form-quotation-on-demand-checkbox fleet-checkbox">
                            <input type="checkbox"
                                   id={ checkboxId }
                                   checked={ isOnDemand }
                                   disabled={ disableInputs }
                                   onChange={ event => this.handleOnDemandSelect(event.target.checked) } />
                            <label htmlFor={ checkboxId }> { ' ' } </label>
                          </div>
                        </div>
                      </div>
                    )

                    if (isOnDemand) {
                      let on_demand_location = this.state.quotation.on_demand_location || this.state.booking.on_demand_details;
                      let onDemandDetailsValues = {
                        pick_up_time: moment().startOf('day'),
                        drop_off_time: moment().startOf('day'),
                        pick_up_location: { latitude: 0, longitude: 0, address: '' },
                        drop_off_location: { latitude: 0, longitude: 0, address: '' }
                      }

                      if (on_demand_location.pick_up_time && on_demand_location.drop_off_time) {
                        onDemandDetailsValues.pick_up_time.add(on_demand_location.pick_up_time, 'seconds');
                        onDemandDetailsValues.drop_off_time.add(on_demand_location.drop_off_time, 'seconds');
                      }

                      if (on_demand_location.pick_up_location && on_demand_location.drop_off_location) {
                        onDemandDetailsValues.pick_up_location = on_demand_location.pick_up_location;
                        onDemandDetailsValues.drop_off_location = on_demand_location.drop_off_location;
                      }

                      onDemandDetailsDiv = (
                        <div className="booking-form-quotation-on-demand-details fs-14 text-secondary-font-weight col-xs-12 no-side-padding">
                          <div className="booking-form-quotation-on-demand-times col-xs-12 no-side-padding">
                            {
                              ['pick_up_time', 'drop_off_time'].map(type => {
                                return (
                                  <div key={ `booking_form_quotation_${type}` } className="col-xs-12 col-sm-6 no-side-padding">
                                    <span className="subtitle-font-weight">{ LocalizationService.formatMessage(`bookings.${type}`) }</span>
                                    <FormField type="timepicker"
                                               id={ `booking_form_quotation_${type}` }
                                               value={ onDemandDetailsValues[type] }
                                               disabled={ disableInputs }
                                               handleChange={ (time, timeString) => this.handlePickUpDropOffTimeSelect(type, time) } />
                                  </div>
                                )
                              })
                            }
                          </div>

                          <div className="booking-form-quotation-on-demand-locations col-xs-12 no-side-padding">
                            {
                              ['pick_up_location', 'drop_off_location'].map(type => {
                                return (
                                  <div key={ `booking_form_quotation_${type}` } className="col-xs-12 col-sm-6 no-side-padding">
                                    <span className="subtitle-font-weight">{ LocalizationService.formatMessage(`bookings.${type}`) }</span>

                                    <input type="hidden" id={`booking_form_quotation_${type}_latitude`} value={ onDemandDetailsValues[type].latitude } />
                                    <input type="hidden" id={`booking_form_quotation_${type}_longitude`} value={ onDemandDetailsValues[type].longitude } />

                                    <FormField type="text"
                                               id={ `booking_form_quotation_${type}_location` }
                                               value={ this.state.onDemandAddresses[type] }
                                               disabled={ disableInputs }
                                               handleChange={ (event) => { this.handleOnDemandLocationChange(type, event.target.value) } }
                                               handleFocusChange={ () => this.setState({ focusedLocationInput: type, searchLocations: [] }) } />

                                    <div className='location-search-results col-xs-12 no-side-padding'>
                                      <CloseOnEscape onEscape={ () => { this.hideLocationSearchResults(type) }}>
                                        <Dropdown id={ `location_search_results_dropdown_${type}` } open={ this.state.focusedLocationInput === type && this.state.searchLocations.length > 0 }>
                                            <Dropdown.Menu>
                                              {
                                                this.state.searchLocations.map(location => { return <LocationMenuItem key={ `location_${location.id}` } location={ location } handleLocationSelect={ (location) => this.handleOnDemandLocationSelect(type, location) }/> })
                                              }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                      </CloseOnEscape>
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      )
                    }
                  }
                }

                return (
                  <div key={ 'booking_details_rate_' + index } className={ className }>
                    { onDemandDiv }
                    { onDemandDetailsDiv }

                    <div className="col-xs-12 no-side-padding">
                      <div className="pull-left"> { priceItem.title } </div>
                      <div className="pull-right"> { priceItem.total.currency_symbol + priceItem.total.amount.toFixed(2) } </div>
                    </div>
                  </div>
                )
              })
            }
        </div>
      </div>
    )
  }

  renderInsuranceCriteria() {
    let listing = this.state.listing;

    if (!listing || this.state.booking.id) {
      return '';
    }

    let insuranceCriteria = this.state.listing.country_configuration.insurance_provider.criteria;
    let filledInCriteria = this.state.quotation.insurance_criteria;

    return (
      <div className="booking-form-insurance-criteria booking-form-box tertiary-text-color col-xs-12 no-side-padding">
        {
          insuranceCriteria.map(criteria => {
            let index = filledInCriteria ? filledInCriteria.findIndex(filledCriteria => filledCriteria.id === criteria.id) : -1
            let criteriaValue = index > -1 ? filledInCriteria[index].value : criteria.min_required_value;
            let criteriaInput = (<input type="text" name="" value={ criteriaValue } onChange={ (event) => { this.handleInsuranceCriteriaChange(criteria.id, event.target.value) } } />);

            if (criteria.type === 'boolean') {
              criteriaInput = (
                <div className="fleet-checkbox">
                  <input type="checkbox" id={ `booking_form_insurance_criteria_${criteria.id}` } value={ criteriaValue } onChange={ (event) => this.handleInsuranceCriteriaChange(criteria.id, event.target.checked) } />
                  <label htmlFor={ `booking_form_insurance_criteria_${criteria.id}` }></label>
                </div>
              )
            }

            return (
              <div key={ `booking_form_insurance_criteria_${criteria.id}` } className="booking-form-insurance-criteria-row booking-form-details-row col-xs-12 no-side-padding">
                <div>
                  <img src={ infoIcon } alt="info_icon" width="18" height="18" className="insurance-criteria-info-icon" />
                  <span> { criteria.name } </span>

                  <div className="pull-right">
                    { criteriaInput }
                  </div>

                  <div className="insurance-criteria-info-div"> { criteria.description } </div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  renderTermsAndRules() {
    let paymentMethod = this.state.paymentMethod;
    let paymentMethodDescription = '';

    if (this.state.booking.id) {
      return '';
    }

    if (Object.keys(paymentMethod).length > 0) {
      paymentMethodDescription = LocalizationService.formatMessage('payment_methods.payment_method_card', {
        brand: paymentMethod.brand,
        last_four: paymentMethod.last_four
      })
    }

    return (
      <div className="booking-form-terms-and-rules booking-form-box tertiary-text-color col-xs-12 no-side-padding">
        <div className="booking-form-details-row col-xs-12 no-side-padding">
          <div className="pull-left"> { LocalizationService.formatMessage('payment_methods.payment_method') } </div>
          <div className="pull-right"> { paymentMethodDescription } </div>
        </div>

        <div className="booking-form-details-row col-xs-12 no-side-padding">
          <div className="pull-left"> { LocalizationService.formatMessage('bookings.message_to_owner') } </div>
          <div className="pull-right">
            <span className="secondary-text-color" onClick={ () => { this.setState({ showMessageToOwnerTextArea: true }) } }>
              { LocalizationService.formatMessage('application.add') }
            </span>
          </div>

          <Toggleable open={ this.state.showMessageToOwnerTextArea }>
            <div className="col-xs-12 no-side-padding">
              <FormField type="textarea"
                         id="booking_form_message_to_owner"
                         value={ this.state.booking.host_message }
                         placeholder={ LocalizationService.formatMessage('bookings.write_a_message_for_the_owner') }
                         handleChange={ (event) => { this.handleBookingChange('host_message', event.target.value) } } />
            </div>
          </Toggleable>
        </div>

        <div className="booking-form-details-row col-xs-12 no-side-padding">
          <div className="pull-left"> { LocalizationService.formatMessage('bookings.agree_to_vehicle_rules') } </div>
          <div className="pull-right">
            <div className="fleet-checkbox">
              <input type="checkbox"
                     id="booking_form_agree_to_vehicle_rules"
                     value={ this.state.booking.agreed_to_rules }
                     onChange={ (event) => this.handleBookingChange('agreed_to_rules', event.target.checked) } />
              <label htmlFor="booking_form_agree_to_vehicle_rules"></label>
            </div>
          </div>
        </div>

        <div className="booking-form-details-row col-xs-12 no-side-padding">
          <div className="pull-left"> { LocalizationService.formatMessage('bookings.agree_to_insurance_terms') } </div>
          <div className="pull-right">
            <div className="fleet-checkbox">
              <input type="checkbox"
                     id="booking_form_agree_to_insurance_terms"
                     value={ this.state.booking.agreed_to_insurance_terms }
                     onChange={ (event) => this.handleBookingChange('agreed_to_insurance_terms', event.target.checked) } />
              <label htmlFor="booking_form_agree_to_insurance_terms"></label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderGetBookingDirections() {
    let booking = this.state.booking;

    if (!booking.id) {
      return '';
    }

    let listing = booking.listing;
    let location = listing.location;

    if (!location && listing.geometry && listing.geometry.bounds) {
      let northeast = listing.geometry.bounds.northeast;
      let southwest = listing.geometry.bounds.southwest;

      location = {
        latitude: (northeast.latitude + southwest.latitude) / 2,
        longitude: (northeast.longitude + southwest.longitude) / 2
      }
    }

    return (
      <div className="booking-form-get-listing-directions booking-form-box fs-16 col-xs-12 no-side-padding">
        <span className="tertiary-text-color"> { listing.address } </span>
        <a href={ MAP_URL.replace('LATITUDE', location.latitude).replace('LONGITUDE', location.longitude) }
           target="_blank"
           className="secondary-text-color">
           { LocalizationService.formatMessage('bookings.get_directions') }
        </a>
      </div>
    )
  }

  renderActionButtons() {
    let role = this.props.currentUserRole;
    let status = this.state.booking.status;
    let actionButtonsDiv = '';

    if (role === 'owner') {
      switch(status) {
        case 'pending':
          actionButtonsDiv = (
            <div className="booking-form-action-buttons text-center col-xs-12 no-side-padding">
              <div className="col-xs-12 no-side-padding">
                <button className="booking-form-action-button btn secondary-color white-text fs-18 col-xs-12"
                        onClick={ () => { this.respondToBookingRequest(true) } }>
                  { LocalizationService.formatMessage('bookings.accept_booking') }
                </button>
              </div>
              <div className="col-xs-12 no-side-padding">
                <button className="booking-form-action-button btn tomato white-text fs-18 col-xs-12"
                        onClick={ () => { this.toggleModal('rejectBooking') } }>
                  { LocalizationService.formatMessage('bookings.reject_booking') }
                </button>

                <ConfirmationModal open={ this.state.modalsOpen.rejectBooking }
                                  toggleModal={ this.toggleModal }
                                  modalName="rejectBooking"
                                  title={ LocalizationService.formatMessage('bookings.confirm_reject_booking') }
                                  confirmationAction={ () => { this.respondToBookingRequest(false) } } >
                  <span className="tertiary-text-color fs-16"> { LocalizationService.formatMessage('bookings.confirm_reject_booking_text') } </span>
                </ConfirmationModal>
              </div>
            </div>
          )
          break;
        case 'confirmed':
          actionButtonsDiv = (
            <div>
              <BookingFormCheckIn handleConfirmCheckIn={ this.handleConfirmCheckIn } handleCancelBooking={ () => { this.toggleModal('cancelBooking') } } />

              <ConfirmationModal open={ this.state.modalsOpen.cancelBooking }
                                 toggleModal={ this.toggleModal }
                                 modalName="cancelBooking"
                                 title={ LocalizationService.formatMessage('bookings.confirm_cancel_booking') }
                                 confirmationAction={ this.handleCancelBooking } >
                <span className="tertiary-text-color fs-16"> { LocalizationService.formatMessage('bookings.confirm_cancel_booking_text') } </span>
              </ConfirmationModal>
            </div>
          );
          break;
        case 'in_progress':
          actionButtonsDiv = (
            <div className="booking-form-action-buttons text-center col-xs-12 no-side-padding">
              <button className="booking-form-action-button btn tomato white-text fs-18 col-xs-12"
                      onClick={ () => { this.toggleModal('checkOut') } }>
                { LocalizationService.formatMessage('bookings.check_out_renter') }
              </button>

              <ConfirmationModal open={ this.state.modalsOpen.checkOut }
                                 toggleModal={ this.toggleModal }
                                 modalName="checkOut"
                                 title={ LocalizationService.formatMessage('bookings.confirm_check_out') }
                                 confirmationAction={ this.handleConfirmCheckOut } >
                <span className="tertiary-text-color"> { LocalizationService.formatMessage('bookings.confirm_check_out_text') } </span>
              </ConfirmationModal>

              <ConfirmationModal open={ this.state.modalsOpen.writeReview }
                                 toggleModal={ this.toggleModal }
                                 modalName="writeReview"
                                 title={ LocalizationService.formatMessage('reviews.write_a_review') }
                                 confirmationAction={ () => { this.setState({ redirectToWriteReview: true }) } }
                                 cancelAction={ this.fetchBooking } >
                <span className="tertiary-text-color"> { LocalizationService.formatMessage('reviews.share_your_experience') } </span>
              </ConfirmationModal>
            </div>
          )
          break;
        default:
      }
    }
    else {
      if (!this.state.booking.id) {
        actionButtonsDiv = (
          <div className="booking-form-action-buttons text-center col-xs-12 no-side-padding">
            <button className="booking-form-request-booking-button btn secondary-color white-text fs-18 col-xs-12"
                    onClick={ this.submitBookingRequest }>
              { LocalizationService.formatMessage('bookings.request_booking') }
            </button>
          </div>
        )
      }
    }

    return actionButtonsDiv;
  }

  renderVehicleSurveyRow() {
    if (!this.state.booking) {
      return;
    }

    if (this.state.booking.status === 'pending') {
      return;
    }

    return (
      <div className="booking-form-vehicle-survey booking-form-box fs-16 col-xs-12 no-side-padding">
        <span className="tertiary-text-color"> { LocalizationService.formatMessage('bookings.surveys.vehicle_survey') } </span>

        <div className="pull-right text-right">
          <FormField type="checkbox"
                     id="booking_form_survey_completed"
                     value={ this.state.booking.survey_completed }
                     handleChange={ () => { this.showBookingSurvey(true) } } />
        </div>
      </div>
    )
  }

  renderLoading() {
    if (!this.state.loading ) {
      return '';
    }

    return <Loading fullWidthLoading={ true } />
  }

  render() {
    if (this.state.bookingCompleted) {
      return (<Redirect to="/bookings" />)
    }

    if (this.state.redirectToWriteReview) {
      return (
        <Redirect to={{
          pathname: `/bookings/${this.state.booking.id}/renter_reviews/new`,
          state: { booking: this.state.booking }
        }} />
      );
    }

    if (this.state.showBookingSurvey) {
      return (
        <BookingSurvey booking={ this.state.booking } handleSaveSurvey={ () => { this.showBookingSurvey(false) } }  />
      )
    }

    return (
      <div className="booking-form col-xs-12 no-side-padding">
        <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          { this.renderListingDetails() }

          { this.renderBookingStatus() }

          { this.renderRenterDetails() }

          { this.renderQuotationDetails() }

          { this.renderInsuranceCriteria() }

          { this.renderTermsAndRules() }

          { this.renderGetBookingDirections() }

          { this.renderVehicleSurveyRow() }
        </div>

        <div className="booking-actions-div">
          { this.renderActionButtons() }
        </div>

        { this.renderLoading() }
      </div>
    );
  }
}

BookingForm.propTypes = {
  listing: PropTypes.object.isRequired,
  pricingQuote: PropTypes.object,
  currentUserRole: PropTypes.string
};

export default BookingForm;
