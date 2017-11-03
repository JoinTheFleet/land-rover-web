import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import BookingStatus from './booking_status';

import Constants from '../../miscellaneous/constants';

class BookingRow extends Component {
  renderDetailsForRenter() {
    let booking = this.props.booking;
    let listing = booking.listing;
    let vehicleMake = listing.variant.make.name;
    let vehicleModel = listing.variant.model.name;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    let bookingStartDate = moment.utc(moment.unix(booking.start_at)).format('DD MMM');
    let bookingEndDate = moment.utc(moment.unix(booking.end_at)).format('DD MMM');

    return (
      <div className="booking-row-vehicle-and-owner col-xs-12 no-side-padding">
        <div className="booking-row-vehicle-image pull-left" style={ { backgroundImage: `url(${listing.gallery[0].images.medium_url})` } }></div>
        <div className="booking-row-vehicle-and-owner-info pull-left">
          <div className="fs-18">
            <b> { vehicleTitle } </b>
            <span> { ` ${listing.variant.year.year}` } </span>
          </div>
          <div> { `${listing.address} • ${bookingStartDate} - ${bookingEndDate}` } </div>
          <div> { listing.user.name } </div>
        </div>
      </div>
    )
  }

  renderDetailsForOwner() {
    let booking = this.props.booking;

    let bookingStartDate = moment.utc(moment.unix(booking.start_at)).format('DD MMM');
    let bookingEndDate = moment.utc(moment.unix(booking.end_at)).format('DD MMM');

    return (
      <div className="booking-row-renter-and-dates col-xs-12 no-side-padding">
        <div className="booking-row-renter-image pull-left" style={ { backgroundImage: `url(${booking.renter.images.medium_url})` } }></div>
        <div className="booking-row-renter-and-dates-info pull-left">
          <div className="fs-18">
            <b> { booking.renter.name } </b>
          </div>
          <div> { `${bookingStartDate} - ${bookingEndDate}` } </div>
        </div>
      </div>
    );
  }

  render() {
    let detailsView = this.props.currentUserRole === Constants.userRoles().renter ? this.renderDetailsForRenter() : this.renderDetailsForOwner();

    return (
      <div className="booking-row col-xs-12 no-side-padding">
        { detailsView }

        <div className="booking-row-status">
          <BookingStatus booking={ this.props.booking } />
        </div>
      </div>
    );
  }
}

BookingRow.propTypes = {
  currentUserRole: PropTypes.string.isRequired,
  booking: PropTypes.object.isRequired
};

export default BookingRow;
