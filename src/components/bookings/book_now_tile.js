import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { DateRangePicker } from 'react-dates';

import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

import Loading from '../miscellaneous/loading';

import ListingQuotationService from '../../shared/services/listings/listing_quotation_service';

class BookNowTile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      errors: [],
      loadingRates: false
    };

    this.addError = this.addError.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
  }

  addError(error) {
    this.setState(prevState => ({
      errors: prevState.errors.concat([error]),
      loadingRates: false
    }));
  }

  handleDatesChange(startDate, endDate) {
    let newState = {
      startDate,
      endDate
    };

    if (startDate && endDate) {
      newState.loadingRates = true;
    }

    this.setState({
      startDate,
      endDate
    }, () => {
      if (startDate && endDate) {
        ListingQuotationService.create(this.props.listing.id, startDate.unix(), endDate.unix(), false, {}, {})
                              .then(response => {
                                this.setState({
                                  pricingQuote: response.data.data.pricing_quote,
                                  loadingRates: false
                                });
                              })
                              .catch(error => { this.addError(error); });
      }
    });
  }

  renderBookingRates() {
    let pricingQuote = this.state.pricingQuote;
    let bookingRates = (<div></div>);

    if (this.state.loadingRates) {
      bookingRates = (<Loading />);
    }

    if (pricingQuote) {
      let bookingRatesContent = (<div className="text-center tertiary-text-color fs-18 text-secondary-font-weight"> <FormattedMessage id="bookings.not_available" /> </div>);

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
              <button className="book-now-button btn secondary-color white-text fs-18"
                      onClick={ this.handleBookButtonClick(this.state.startDate, this.state.endDate) }>
                <FormattedMessage id="bookings.book_now" />
              </button>
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

    return (
      <div className="book-now-tile">
        <div className="book-now-tile-title secondary-color white-text ls-dot-two col-xs-12 no-side-padding">
          <FormattedMessage id="bookings.book_now_from" />
          <FormattedMessage id="listings.price_per_day"
                            values={ { currency_symbol: listing.country_configuration.country.currency_symbol,
                                       price: listing.price / 100 } }>
            {
              (text) => {
                return (<b> { ' ' + text } </b>);
              }
            }
          </FormattedMessage>
        </div>

        <div className="book-now-tile-details col-xs-12 no-side-padding">
          <div className="book-now-tile-datepicker-title col-xs-12 no-side-padding">
            <div className="tertiary-text-color">
              <FormattedMessage id="bookings.check_in_date" />
            </div>
            <div className="tertiary-text-color">
              <FormattedMessage id="bookings.check_out_date" />
            </div>
          </div>

          <DateRangePicker startDate={this.state.startDate}
                           endDate={this.state.endDate}
                           onDatesChange={({ startDate, endDate }) => this.handleDatesChange(startDate, endDate) }
                           focusedInput={this.state.focusedInput}
                           onFocusChange={focusedInput => this.setState({ focusedInput })} />

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
