import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import FormField from '../../miscellaneous/forms/form_field';
import Map from '../../miscellaneous/map';
import Loading from '../../miscellaneous/loading';

import Helpers from '../../../miscellaneous/helpers';
import LocalizationService from '../../../shared/libraries/localization_service';

export default class BookingQuotation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: '',
      focusedLocationInput: 'pick_up_location',
      numberOfMonthsToShow: Helpers.pageWidth() >= 768 ? 2 : 1
    };

    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleOnDemandLocationChange = this.handleOnDemandLocationChange.bind(this);

    document.addEventListener('resize', this.handleWindowResize);
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

  handleOnDemandLocationChange(location) {
    if (!location) {
      return;
    }

    this.props.handleOnDemandLocationChange(this.state.focusedLocationInput, location);
  }

  render() {
    let pricingQuote = this.props.pricingQuote;
    let disableInputs = !!this.props.booking.id;

    if (Object.keys(pricingQuote).length === 0) {
      return (<div></div>);
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
                   handleChange={ this.props.handleDatesChange }
                   numberOfMonths={ this.state.numberOfMonthsToShow } />

        <div className="col-xs-12 no-side-padding">
            {
              priceItems.map((priceItem, index) => {
                let className = 'booking-form-quotation-details-rate col-xs-12 no-side-padding text-capitalize tertiary-text-color fs-16';
                className += priceItem.type === 'TOTAL' ? ' subtitle-font-weight' : ' text-secondary-font-weight';

                let onDemandDiv = '';
                let onDemandDetailsDiv = '';
                let isOnDemand = this.props.quotation.on_demand || this.props.booking.on_demand;

                if (this.props.listing.on_demand) {
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
                                   onChange={ event => this.props.handleOnDemandSelect(event.target.checked) } />
                            <label htmlFor={ checkboxId }> { ' ' } </label>
                          </div>
                        </div>
                      </div>
                    )

                    if (isOnDemand) {
                      let on_demand_location = this.props.quotation.on_demand_location || this.props.booking.on_demand_details;
                      let googleMapUrl = LocalizationService.formatMessage('google.maps.javascript_api_link', { key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY });
                      let selectedPosition;
                      let map = '';

                      if (on_demand_location && Object.keys(on_demand_location).length > 0) {
                        selectedPosition = {
                          lat: on_demand_location[this.state.focusedLocationInput].latitude,
                          lng: on_demand_location[this.state.focusedLocationInput].longitude
                        };
                      }

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

                      if (!disableInputs) {
                        map = (
                          <div className="booking-form-quotation-map col-xs-12 no-side-padding">
                            <Map googleMapURL={ googleMapUrl }
                                 loadingElement={ <div style={{ height: `100%` }} ><Loading fullWidthLoading /></div> }
                                 containerElement={ (<div style={{ height: '300px' }}></div>) }
                                 mapElement={ <div style={{ height: '100%' }}></div> }
                                 onPlacesChanged={ this.handleOnDemandLocationChange }
                                 handleMapClick={ this.handleOnDemandLocationChange }
                                 handleMarkerDragEnd={ this.handleOnDemandLocationChange }
                                 center={ selectedPosition }
                                 draggableMarkers={ true }
                                 includeSearchBox={ true }
                                 markers={ selectedPosition ? [{ position: selectedPosition}] : [] } >
                            </Map>
                          </div>
                        );
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
                                               handleChange={ (time, timeString) => this.props.handlePickUpDropOffTimeSelect(type, time) } />
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
                                               value={ this.props.onDemandAddresses[type] }
                                               disabled={ disableInputs }
                                               className={ `col-xs-12 ${!disableInputs && this.state.focusedLocationInput === type ? 'focused' : '' }`}
                                               handleFocusChange={ () => this.setState({ focusedLocationInput: type }) } />

                                  </div>
                                )
                              })
                            }
                          </div>

                          { map }
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
}

BookingQuotation.propTypes = {
  pricingQuote: PropTypes.object,
  quotation: PropTypes.object,
  booking: PropTypes.object,
  listing: PropTypes.object,
  onDemandAddresses: PropTypes.object,
  handleDatesChange: PropTypes.func,
  handleOnDemandSelect: PropTypes.func,
  handleOnDemandLocationChange: PropTypes.func
};