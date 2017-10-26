import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Alert from 'react-s-alert';

import FormField from '../../miscellaneous/forms/form_field';
import Loading from '../../miscellaneous/loading';
import Toggleable from '../../miscellaneous/toggleable';

import ListingQuotationService from '../../../shared/services/listings/listing_quotation_service';
import ListingBookingsService from '../../../shared/services/listings/listing_bookings_service';
import PaymentMethodsService from '../../../shared/services/payment_methods_service';
import GeolocationService from '../../../shared/services/geolocation_service';
import LocalizationService from '../../../shared/libraries/localization_service';

import Helpers from '../../../miscellaneous/helpers';
import Errors from '../../../miscellaneous/errors';
import Constants from '../../../miscellaneous/constants';

import infoIcon from '../../../assets/images/info_icon.png';

const bookingsViews = Constants.bookingsViews();

class BookingForm extends Component {
  constructor(props) {
    super(props);

    let quotation = this.props.quotation;

    if (!quotation.on_demand) {
      quotation.on_demand = false;
    }

    if (!quotation.on_demand_location) {
      quotation.on_demand_location = {
        pick_up_time: this.props.listing.check_in_time,
        drop_off_time: this.props.listing.check_out_time
      };
    }

    if (!quotation.insurance_criteria) {
      quotation.insurance_criteria = [];
    }

    this.state = {
      quotation: quotation,
      pricingQuote: this.props.pricingQuote,
      booking: {
        quotation: quotation.uuid,
        agreed_to_rules: false,
        agreed_to_insurance_terms: false,
        host_message: ''
      },
      paymentMethod: {},
      focusedInput: '',
      showMessageToOwnerTextArea: false,
      loading: false,
      errors: []
    };

    this.fetchQuotation = this.fetchQuotation.bind(this);
    this.fetchPaymentMethods = this.fetchPaymentMethods.bind(this);
    this.fetchLocationFromListingPosition = this.fetchLocationFromListingPosition.bind(this);

    this.addError = this.addError.bind(this);
    this.submitBookingRequest = this.submitBookingRequest.bind(this);

    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleBookingChange = this.handleBookingChange.bind(this);
    this.handleOnDemandSelect = this.handleOnDemandSelect.bind(this);
    this.handleInsuranceCriteriaChange = this.handleInsuranceCriteriaChange.bind(this);
    this.handlePickUpDropOffTimeSelect = this.handlePickUpDropOffTimeSelect.bind(this);
  }

  componentDidMount() {
    this.fetchPaymentMethods(this.fetchLocationFromListingPosition, this.fetchLocationFromListingPosition);
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
    if (!this.props.listing.location) {
      return;
    }

    let location = {
      lat: this.props.listing.location.latitude,
      lng: this.props.listing.location.longitude
    };

    this.setState({
      loading: true,
    }, () => {
      GeolocationService.getLocationFromPosition(location)
                        .then(results => {
                          let quotation = this.state.quotation;
                          quotation.on_demand_location.pick_up_location = quotation.on_demand_location.drop_off_location = {
                            latitude: location.lat,
                            longitude: location.lng,
                            address: results[0].formatted_address
                          };

                          this.setState({ loading: false, quotation: quotation });
                        })
                        .catch(error => this.addError(error));
    });
  }

  fetchQuotation() {
    this.setState({
      loading: true
    }, () => {
      let quotation = this.state.quotation;

      ListingQuotationService.create(this.props.listing.id, quotation.start_at, quotation.end_at, quotation.on_demand, quotation.on_demand_location, {})
                             .then(response => {
                               this.setState({
                                 pricingQuote: response.data.data.pricing_quote,
                                 loading: false
                               });
                             })
                             .catch(error => {
                               this.addError(error);
                             });
    });
  }

  addError(error) {
    this.setState({ loading: false }, () => { Alert.error(Errors.extractErrorMessage(error)); });
  }

  submitBookingRequest(){
    let booking = this.state.booking;

    this.setState({ loading: true }, () => {
      ListingBookingsService.create(this.props.listing.id, this.state.pricingQuote.uuid, booking.agreed_to_rules, booking.agreed_to_insurance_terms, booking.host_message)
      .then(response => {
        this.props.setCurrentView(bookingsViews.index);
      })
      .catch(error => {
        this.addError(error);
      });
    });
  }

  handleDatesChange(dates) {
    let quotation = this.state.quotation;

    quotation.start_at = dates.startDate.unix();
    quotation.end_at = dates.endDate.unix();

    this.setState({ quotation: quotation }, this.fetchQuotation);
  }

  handleOnDemandSelect(selected) {
    let quotation = this.state.quotation;
    quotation.on_demand = selected;

    this.setState({ quotation: quotation }, this.fetchQuotation);
  }

  handlePickUpDropOffTimeSelect(type, time, timeString) {
    let quotation = this.state.quotation;
    quotation.on_demand_location[type] = moment.duration(time.format('HH:MM:SS')).asSeconds();

    this.setState({ quotation: quotation }, this.fetchQuotation);
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

  renderListingDetails() {
      let listing = this.props.listing;
      let vehicleTitle = `${listing.variant.make.name}, ${listing.variant.model.name}`;

    return (
      <div className="booking-form-listing-details col-xs-12 no-side-padding">
        <span className="subtitle-font-weight fs-36">{ vehicleTitle }</span>
        <span className="fs-36"> { ` ${listing.variant.year.year}` } </span>

        <div className="booking-form-listing-user-details text-center pull-right">
          <img src={ listing.user.images.original_url } alt="listing_user_avatar" />
          <span className="secondary-text-color fs-18">{ listing.user.first_name + ' ' + listing.user.last_name }</span>
        </div>
      </div>
    )
  }

  renderQuotationDetails() {
    let pricingQuote = this.state.pricingQuote;
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
                   showClearDates={ false }
                   handleFocusChange={ (focusedInput) => { this.setState({ focusedInput }) } }
                   handleChange={ this.handleDatesChange }/>

        <div className="col-xs-12 no-side-padding">
            {
              priceItems.map((priceItem, index) => {
                let className = 'booking-form-quotation-details-rate col-xs-12 no-side-padding text-capitalize tertiary-text-color fs-16';
                className += priceItem.type === 'TOTAL' ? ' subtitle-font-weight' : ' text-secondary-font-weight';

                let onDemandDiv = '';
                let onDemandDetailsDiv = '';

                if (this.props.listing.on_demand) {
                  if ((this.state.quotation.on_demand && priceItem.type === 'ON_DEMAND') || (!this.state.quotation.on_demand && priceItem.type === 'TOTAL')) {
                    let checkboxId = 'booking_form_quotation_on_demand_checkbox';

                    onDemandDiv = (
                      <div className="booking-form-quotation-on-demand text-secondary-font-weight col-xs-12 no-side-padding">
                        <div className="pull-left"> { LocalizationService.formatMessage('listings.on_demand_collection') } </div>
                        <div className="pull-right">
                          <div className="booking-form-quotation-on-demand-checkbox fleet-checkbox">
                            <input type="checkbox"
                                   id={ checkboxId }
                                   checked={ this.state.quotation.on_demand }
                                   onChange={ event => this.handleOnDemandSelect(event.target.checked) } />
                            <label htmlFor={ checkboxId }> { ' ' } </label>
                          </div>
                        </div>
                      </div>
                    )

                    if (this.state.quotation.on_demand) {
                      let on_demand_location = this.state.quotation.on_demand_location;
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
                                               id={ `booking_form_quotation_${type}` }
                                               value={ onDemandDetailsValues[type].address }
                                               handleChange={ (time, timeString) => this.handlePickUpDropOffTimeSelect(type, time) } />
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
    let insuranceCriteria = this.props.listing.country_configuration.insurance_provider.criteria;
    let filledInCriteria = this.state.quotation.insurance_criteria;

    return (
      <div className="booking-form-insurance-criteria booking-form-box tertiary-text-color col-xs-12 no-side-padding">
        {
          insuranceCriteria.map(criteria => {
            let index = filledInCriteria ? filledInCriteria.findIndex(filledCriteria => filledCriteria.id === criteria.id) : -1
            let criteriaValue = index > -1 ? filledInCriteria[index].value : '';
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
              <div key={ `booking_form_insurance_criteria_${criteria.id}` } className="booking-form-insurance-criteria-row booking-form-details-row">
                <div>
                  <img src={ infoIcon } alt="info_icon" width="18" height="18" />
                  <span> { criteria.name } </span>

                  <div className="pull-right">
                    { criteriaInput }
                  </div>
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

  renderRequestBooking() {
    return (
      <div className="booking-form-request-booking text-center col-xs-12 no-side-padding">
        <button className="booking-form-request-booking-button btn secondary-color white-text fs-18 col-xs-12"
                onClick={ this.submitBookingRequest }>
          { LocalizationService.formatMessage('bookings.request_booking') }
        </button>
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
    return (
      <div className="booking-form col-xs-12 no-side-padding">
        <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          { this.renderListingDetails() }

          { this.renderQuotationDetails() }

          { this.renderInsuranceCriteria() }

          { this.renderTermsAndRules() }

          { this.renderLoading() }
        </div>

        <div className="request-booking-div">
          { this.renderRequestBooking() }
        </div>
      </div>
    );
  }
}

BookingForm.propTypes = {
  listing: PropTypes.object.isRequired,
  pricingQuote: PropTypes.object
};

export default BookingForm;
