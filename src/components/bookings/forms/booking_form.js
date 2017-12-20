import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Alert from 'react-s-alert';

import BookingQuotation from './booking_quotation';
import BookingStatus from '../booking_status';
import BookingSurvey from './booking_survey';
import BookingFormCheckIn from './booking_form_check_in';
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
        'writeReview': false,
        'acceptTerms': false,
        'acceptRules': false
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
      focusedLocationInput: '',
      searchLocations: [],
      errors: [],
      loading: false,
      bookingCompleted: false,
      showBookingSurvey: false,
      showMessageToOwnerTextArea: false,
      locationTimeout: null
    };

    this.fetchBooking = this.fetchBooking.bind(this);
    this.fetchQuotation = this.fetchQuotation.bind(this);
    this.fetchPaymentMethods = this.fetchPaymentMethods.bind(this);
    this.fetchBookingOnDemandLocations = this.fetchBookingOnDemandLocations.bind(this);
    this.fetchLocationFromListingPosition = this.fetchLocationFromListingPosition.bind(this);

    this.addError = this.addError.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.showBookingSurvey = this.showBookingSurvey.bind(this);
    this.submitBookingRequest = this.submitBookingRequest.bind(this);
    this.respondToBookingRequest = this.respondToBookingRequest.bind(this);
    this.setPickUpAndDropOffLocation = this.setPickUpAndDropOffLocation.bind(this);

    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleCancelBooking = this.handleCancelBooking.bind(this);
    this.handleBookingChange = this.handleBookingChange.bind(this);
    this.handleConfirmCheckIn = this.handleConfirmCheckIn.bind(this);
    this.handleOnDemandSelect = this.handleOnDemandSelect.bind(this);
    this.handleConfirmCheckOut = this.handleConfirmCheckOut.bind(this);
    this.handleOnDemandLocationChange = this.handleOnDemandLocationChange.bind(this);
    this.handleInsuranceCriteriaChange = this.handleInsuranceCriteriaChange.bind(this);
    this.handlePickUpDropOffTimeSelect = this.handlePickUpDropOffTimeSelect.bind(this);

    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidMount() {
    let location = this.props.location;

    if (this.props.match.params.id) {
      this.fetchPaymentMethods(() => {
        this.fetchBooking(true);
      });
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
                              booking: booking,
                              quotation: quotation,
                              pricingQuote: pricingQuote
                            }, () => {
                              this.fetchPaymentMethods(this.fetchLocationFromListingPosition, this.fetchLocationFromListingPosition);
                            });
                          });
                        })
                        .catch(error => { this.addError(Errors.extractErrorMessage(error)); });
      });
    }
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
                               if (errorCallback) {
                                 errorCallback();
                               }

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

  handleOnDemandLocationChange(type, location) {
    let onDemandAddresses = this.state.onDemandAddresses;
    let quotation = this.state.quotation;

    if (Array.isArray(location)) {
      const address = location[0].formatted_address;

      onDemandAddresses[type] = address;

      quotation.on_demand_location[type] = {
        latitude: location[0].geometry.location.lat(),
        longitude: location[0].geometry.location.lng(),
        address: address
      };

      this.setState({
        onDemandAddresses: onDemandAddresses,
        quotation: quotation
      }, this.fetchQuotation);
    }
    else {
      this.setState({
        loading: true
      }, () => {
        let latLng = location.latLng || location;
        const position = { latitude: latLng.lat(), longitude: latLng.lng() };

        GeolocationService.getLocationFromPosition(position)
                          .then(results => {
                            const address = results[0].formatted_address;

                            onDemandAddresses[type] = address;

                            quotation.on_demand_location[type] = {
                              latitude: latLng.lat(),
                              longitude: latLng.lng(),
                              address: address
                            };

                            this.setState({ loading: false, quotation: quotation, onDemandAddresses: onDemandAddresses });
                          })
                          .catch(error => this.addError(error));
                        });
    }
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
    if (!this.state.booking.survey_completed && !this.state.booking.survey_confirmed) {
      this.setState({
        showBookingSurvey: true
      }, () => { Alert.error(LocalizationService.formatMessage('bookings.surveys.please_fill_survey_before_checkout')) });
    }
    else {
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
          <div className="pull-right text-right"> <BookingStatus booking={ this.state.booking } targetMode={ this.props.currentUserRole } /> </div>
        </div>
      )
    }

    return bookingStatusDiv;
  }

  renderRenterDetails() {
    let renterDetailsDiv = '';
    let booking = this.state.booking;

    // TODO: Fix issue with multiple render.

    if (!booking || Object.keys(booking).length === 0) {
      return '';
    }

    if (this.props.currentUserRole === 'owner' && booking.renter) {

      renterDetailsDiv = (
        <div className="booking-form-renter-details booking-form-box col-xs-12 no-side-padding">
          <div className="booking-form-renter-image-and-name">
            <div className="booking-form-renter-image pull-left" style={ { backgroundImage: `url(${booking.renter.images.medium_url})` } }></div>
            <div className="booking-form-renter-name-and-rating pull-left">
              <Link to={`/users/${booking.renter.id}`}>
                <div className="fs-18 secondary-text-color"> { booking.renter.name } </div>
              </Link>

              <RatingInput rating={ booking.renter.renter_review_summary.rating } readonly={ true } />
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

    if (this.state.booking.id || !this.state.listing) {
      return '';
    }

    const listing = this.state.listing;
    let bookingTerms = listing ? listing.country_configuration.insurance_provider.booking_terms : {};

    if (paymentMethod && Object.keys(paymentMethod).length > 0) {
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
            <span className="booking-form-add-message-to-owner-btn secondary-text-color" onClick={ () => { this.setState({ showMessageToOwnerTextArea: true }) } }>
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
                     checked={ this.state.booking.agreed_to_rules }
                     onChange={ (event) => { event.preventDefault(); this.toggleModal('acceptRules') } } />
              <label htmlFor="booking_form_agree_to_vehicle_rules"></label>
            </div>

            <ConfirmationModal open={ this.state.modalsOpen.acceptRules }
                               toggleModal={ this.toggleModal }
                               modalName="acceptRules"
                               title={ LocalizationService.formatMessage('bookings.vehicle_rules') }
                               confirmationText={ LocalizationService.formatMessage('application.agree') }
                               cancelText={ LocalizationService.formatMessage('application.decline') }
                               confirmationAction={ () => this.handleBookingChange('agreed_to_rules', true) }
                               cancelAction={ () => this.handleBookingChange('agreed_to_rules', false) } >
              <p className="black-text text-left">
                <b> { `${LocalizationService.formatMessage('application.rules')}:` } </b>
                <br/><br/>
                {
                  listing.rules.map((rule, index) => {
                    return (
                      <span> { `${index + 1}: ${rule.rule}` } { index < listing.rules.length - 1 ? (<br/>) : ''} </span>
                    )
                  })
                }
              </p>
            </ConfirmationModal>
          </div>
        </div>

        <div className="booking-form-details-row col-xs-12 no-side-padding">
          <div className="pull-left"> { LocalizationService.formatMessage('bookings.agree_to_insurance_terms') } </div>
          <div className="pull-right">
            <div className="fleet-checkbox">
              <input type="checkbox"
                     id="booking_form_agree_to_insurance_terms"
                     checked={ this.state.booking.agreed_to_insurance_terms }
                     onChange={ (event) => { event.preventDefault(); this.toggleModal('acceptTerms') } } />
              <label htmlFor="booking_form_agree_to_insurance_terms"></label>
            </div>

            <ConfirmationModal open={ this.state.modalsOpen.acceptTerms }
                               toggleModal={ this.toggleModal }
                               modalName="acceptTerms"
                               title={ LocalizationService.formatMessage('bookings.insurance_terms') }
                               confirmationText={ bookingTerms.actions.agree }
                               cancelText={ bookingTerms.actions.decline }
                               confirmationAction={ () => this.handleBookingChange('agreed_to_insurance_terms', true) }
                               cancelAction={ () => this.handleBookingChange('agreed_to_insurance_terms', false) } >
              <div className="black-text text-left">
                { bookingTerms.text.split('\n').map((paragraph, index) => (<p key={ `insurance_term_paragraph_${index}`}>{ paragraph }<br/></p>)) }
              </div>
            </ConfirmationModal>
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
      if (!this.state.booking.id && !this.state.loading) {
        actionButtonsDiv = (
          <div className="booking-form-action-buttons text-center col-xs-12 no-side-padding">
            <button className="booking-form-request-booking-button btn secondary-color white-text fs-18 col-xs-12"
                    onClick={ this.submitBookingRequest }>
              { LocalizationService.formatMessage('bookings.request_booking') }
            </button>
          </div>
        )
      }
      else if (this.state.booking && ['pending', 'confirmed'].includes(this.state.booking.status)) {
        actionButtonsDiv = (
          <div className="booking-form-action-buttons text-center col-xs-12 no-side-padding">
            <button className="booking-form-cancel-booking-button btn tomato white-text fs-18 col-xs-12"
                    onClick={ () => { this.toggleModal('cancelBooking') } }>
              { LocalizationService.formatMessage('bookings.cancel_booking') }
            </button>

            <ConfirmationModal open={ this.state.modalsOpen.cancelBooking }
                                 toggleModal={ this.toggleModal }
                                 modalName="cancelBooking"
                                 title={ LocalizationService.formatMessage('bookings.confirm_cancel_booking') }
                                 confirmationAction={ this.handleCancelBooking } >
              <span className="tertiary-text-color fs-16"> { LocalizationService.formatMessage('bookings.confirm_cancel_booking_text') } </span>
            </ConfirmationModal>
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

    if (!this.state.booking.id || this.state.booking.status === 'pending') {
      return;
    }

    let messageDiv = '';

    if (this.props.currentUserRole === 'owner' && this.state.booking.status === 'in_progress' && !this.state.booking.survey_confirmed && !this.state.booking.survey_completed) {
      messageDiv = (
        <div className="booking-form-vehicle-survey-check-message fs-14 col-xs-12 no-side-padding">
          <p className="secondary-text-color"> { `*${LocalizationService.formatMessage('bookings.surveys.please_walk_around_the_vehicle')}` } </p>
        </div>
      )
    }

    return (
      <div className="booking-form-vehicle-survey booking-form-box fs-16 col-xs-12 no-side-padding">
        { messageDiv }

        <div className="booking-form-vehicle-survey-row col-xs-12 no-side-padding">
          <span className="tertiary-text-color"> { LocalizationService.formatMessage('bookings.surveys.vehicle_survey') } </span>

          <div className="pull-right text-right">
            <FormField type="checkbox"
                       id="booking_form_survey_completed"
                       value={ this.state.booking.survey_completed || this.state.booking.survey_confirmed }
                       handleChange={ () => { this.showBookingSurvey(true) } } />
          </div>
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
          pathname: `/bookings/${this.state.booking.id}/reviews/new`,
          state: { booking: this.state.booking }
        }} />
      );
    }

    if (this.state.showBookingSurvey) {
      const confirmSurvey = this.props.currentUserRole === 'owner' && this.state.booking.status === 'in_progress' && !this.state.booking.survey_confirmed && !this.state.booking.survey_completed;

      return (
        <BookingSurvey booking={ this.state.booking } currentUserRole={ this.props.currentUserRole } confirmSurvey={ confirmSurvey } handleSaveSurvey={ () => { this.showBookingSurvey(false) } }  />
      )
    }

    return (
      <div className="booking-form col-xs-12 no-side-padding">
        <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          { this.renderListingDetails() }

          { this.renderBookingStatus() }

          { this.renderRenterDetails() }

          <BookingQuotation booking={ this.state.booking }
                            pricingQuote={ this.state.pricingQuote }
                            quotation={ this.state.quotation }
                            listing={ this.state.listing }
                            onDemandAddresses={ this.state.onDemandAddresses }
                            handleDatesChange={ this.handleDatesChange }
                            handleOnDemandSelect={ this.handleOnDemandSelect }
                            handlePickUpDropOffTimeSelect={ this.handlePickUpDropOffTimeSelect }
                            handleOnDemandLocationChange={ this.handleOnDemandLocationChange } />

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
  listing: PropTypes.object,
  pricingQuote: PropTypes.object,
  currentUserRole: PropTypes.string
};

export default BookingForm;
