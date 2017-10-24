import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import FormField from '../../miscellaneous/forms/form_field';

class BookingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pricingQuote: this.props.pricingQuote,
      focusedInput: null,
      loading: false
    };

    this.handleDatesChange = this.handleDatesChange.bind(this);
  }

  handleDatesChange(startDate, endDate) {
    let pricingQuote = this.state.pricingQuote;

    pricingQuote.check_in = startDate.unix();
    pricingQuote.check_out = endDate.unix();

    this.setState({ pricingQuote: pricingQuote });
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

    return (
      <div className="bookings-form-quotation-details col-xs-12 no-side-padding">
        <FormField type="daterange"
                   startDate={ moment.unix(pricingQuote.check_in) }
                   endDate={ moment.unix(pricingQuote.check_out) }
                   focused={ this.state.focusedInput }
                   handleFocusChange={ (focusedInput) => { this.setState({ focusedInput }) } }
                   handleChange={ this.handleDatesChange }/>
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
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="booking-form col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
        { this.renderListingDetails() }

        { this.renderQuotationDetails() }
      </div>
    );
  }
}

BookingForm.propTypes = {
  listing: PropTypes.object,
  pricingQuote: PropTypes.object
};

export default BookingForm;
