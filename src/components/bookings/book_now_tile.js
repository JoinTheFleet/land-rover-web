import React, { Component } from 'react';
import { DateRangePicker } from 'react-dates';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Alert from 'react-s-alert';

import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

import Loading from '../miscellaneous/loading';

import ListingQuotationService from '../../shared/services/listings/listing_quotation_service';
import LocalizationService from '../../shared/libraries/localization_service';

import Errors from '../../miscellaneous/errors';
import Helpers from '../../miscellaneous/helpers';

class BookNowTile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      pricingQuote: {},
      quotation: {},
      loadingRates: false,
      numberOfMonthsToShow: Helpers.pageWidth() >= 768 ? 2 : 1,
      daySize: Helpers.pageWidth() < 400 ? Math.round((Helpers.pageWidth() - 90) / 7) : null
    };

    this.addError = this.addError.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);

    window.addEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize() {
    let width = Helpers.pageWidth();

    if (width < 400) {
      this.setState({ daySize: Math.round((Helpers.pageWidth() - 90) / 7) });
    }

    if (width > 400 && this.state.daySize) {
      this.setState({ daySize: null });
    }

    if (width < 768 && this.state.numberOfMonthsToShow === 2) {
      this.setState({ numberOfMonthsToShow: 1 });
    }
    else if(width >= 768 && this.state.numberOfMonthsToShow === 1 ) {
      this.setState({ numberOfMonthsToShow: 2 });
    }
  }

  addError(error) {
    this.setState(prevState => ({ loadingRates: false }), () => { Alert.error(error); });
  }

  handleDatesChange(dates) {
    let quotation = this.state.quotation;
    quotation.start_at = dates.startDate.unix();

    if (dates.endDate) {
      quotation.end_at = dates.endDate.unix();
    }

    let newState = { quotation: quotation };
    let fetchQuotation = dates.startDate && dates.endDate;

    if (fetchQuotation) {
      newState.loadingRates = true;
    }

    this.setState(newState, () => {
      if (fetchQuotation) {
        ListingQuotationService.create(this.props.listing.id, quotation.start_at, quotation.end_at, false, {}, {})
                               .then(response => {
                                 this.setState({
                                   pricingQuote: response.data.data.pricing_quote,
                                   loadingRates: false
                                 });
                               })
                               .catch(error => { this.addError(Errors.extractErrorMessage(error)); });
      }
    });
  }

  renderBookingRates() {
    let pricingQuote = this.state.pricingQuote;
    let bookingRates = (<div></div>);

    if (this.state.loadingRates) {
      bookingRates = (<Loading />);
    }
    else if (Object.keys(pricingQuote).length > 0) {
      let bookingRatesContent = (
        <div className="text-center tertiary-text-color fs-18 text-secondary-font-weight">
          { LocalizationService.formatMessage('bookings.not_available') }
        </div>
      );

      if (pricingQuote.available) {
        bookingRatesContent = (
          <div className="col-xs-12 no-side-padding">
            {
              pricingQuote.price_items.map((priceItem, index) => {
                let className = 'book-now-tile-details-rate col-xs-12 no-side-padding text-capitalize tertiary-text-color fs-16 ls-dot-five';
                className += priceItem.type === 'TOTAL' ? ' subtitle-font-weight' : ' text-secondary-font-weight';

                return (
                  <div key={ 'booking_details_rate_' + index } className={ className }>
                    <div className="pull-left"> { priceItem.title } </div>
                    <div className="pull-right"> { priceItem.total.currency_symbol + priceItem.total.amount.toFixed(2) } </div>
                  </div>
                )
              })
            }
            <div className="col-xs-12 no-side-padding text-center">
              <Link to={{
                    pathname: `/listings/${this.props.listing.id}/bookings/new`,
                    state: {
                      listing: this.props.listing,
                      quotation: this.state.quotation,
                      pricingQuote: this.state.pricingQuote
                    }
                  }}>
                <button className="book-now-button btn secondary-color white-text fs-18">
                  { LocalizationService.formatMessage('bookings.book_now') }
                </button>
              </Link>
            </div>
          </div>
        );
      }

      bookingRates = (
        <div className="book-now-tile-details-rates col-xs-12 no-side-padding">
          { bookingRatesContent }
        </div>
      )
    }

    return bookingRates;
  }

  render() {
    let listing = this.props.listing;
    let startDate = this.state.quotation.start_at ? moment.unix(this.state.quotation.start_at) : null;
    let endDate = this.state.quotation.end_at ? moment.unix(this.state.quotation.end_at) : null;
    let pricePerDay = LocalizationService.formatMessage('listings.price_per_day',
                                                        { currency_symbol: listing.country_configuration.country.currency_symbol,
                                                          price: listing.price / 100 }
                                                       );

    return (
      <div className="book-now-tile">
        <div className="book-now-tile-title secondary-color white-text ls-dot-two col-xs-12 no-side-padding">

          { LocalizationService.formatMessage('bookings.book_now_from') }

          <b> { ` ${ pricePerDay }` } </b>
        </div>

        <div className="book-now-tile-details col-xs-12 no-side-padding">
          <div className="book-now-tile-datepicker-title col-xs-12 no-side-padding">
            <div className="tertiary-text-color">
              { LocalizationService.formatMessage('bookings.check_in_date') }
            </div>

            <div className="tertiary-text-color">
              { LocalizationService.formatMessage('bookings.check_out_date') }
            </div>
          </div>

          <DateRangePicker startDate={ startDate }
                           endDate={ endDate }
                           minimumNights={ 0 }
                          //  daySize={ this.state.daySize } TODO: This is incorrect
                           numberOfMonths={ this.state.numberOfMonthsToShow }
                           focusedInput={this.state.focusedInput}
                           onDatesChange={ this.handleDatesChange }
                           onFocusChange={ focusedInput => this.setState({ focusedInput }) }
                           hideKeyboardShortcutsPanel={ true }
                           isDayBlocked={ (day) => day.utc().isBefore(moment().utc()) } />

          { this.renderBookingRates() }
        </div>
      </div>
    );
  }
}

BookNowTile.propTypes = {
  listing: PropTypes.object.isRequired,
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj,
  handleBookButtonClick: PropTypes.func
};

export default BookNowTile;
