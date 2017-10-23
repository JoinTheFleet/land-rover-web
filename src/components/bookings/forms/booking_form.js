import React, { Component } from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

class BookingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: this.props.checkInDate,
      endDate: this.props.checkOutDate
    };
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

  render() {
    return (
      <div className="booking-form col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
        { this.renderListingDetails() }
      </div>
    );
  }
}

BookingForm.propTypes = {
  listing: PropTypes.object,
  checkInDate: momentPropTypes.momentObj,
  checkOutDate: momentPropTypes.momentObj
};

export default BookingForm;
