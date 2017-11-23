import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import moment from 'moment';

import BookingStatus from './booking_status';

import Constants from '../../miscellaneous/constants';

import noImagesPlaceholder from '../../assets/images/placeholder-no-images.png';

const userRoles = Constants.userRoles();

class BookingRow extends Component {
  renderListingDetails() {
    let booking = this.props.booking;

    if (booking) {
      let listing = booking.listing;
      let vehicleMake = listing.variant.make.name;
      let vehicleModel = listing.variant.model.name;
      let vehicleTitle = vehicleMake + ', ' + vehicleModel;
      let userName = this.props.currentUserRole === userRoles.renter ? listing.user.name : booking.renter.name;

      let bookingStartDate = moment.utc(moment.unix(booking.start_at)).format('DD MMM');
      let bookingEndDate = moment.utc(moment.unix(booking.end_at)).format('DD MMM');

      let backgroundImage = `url(${listing.gallery.length > 0 ? listing.gallery[0].images.medium_url : noImagesPlaceholder})`;

      return (
        <div className="booking-row-vehicle-and-owner col-xs-12 no-side-padding">
          <div className="booking-row-vehicle-image" style={ { backgroundImage: backgroundImage } }></div>
          <div className="booking-row-vehicle-and-owner-info">
            <div className="fs-18">
              <b> { vehicleTitle } </b>
              <span> { ` ${listing.variant.year.year}` } </span>
            </div>

            <span> { listing.address } </span>
            <span className="hidden-xs">&nbsp; &bull; &nbsp;</span>
            <br className="visible-xs" />
            <span> { `${bookingStartDate} - ${bookingEndDate}` } </span>

            <div> { userName } </div>
          </div>
        </div>
      )
    }
  }

  renderBookingDetails() {
    let booking = this.props.booking;

    if (booking) {
      let bookingStartDate = moment.utc(moment.unix(booking.start_at)).format('DD MMM');
      let bookingEndDate = moment.utc(moment.unix(booking.end_at)).format('DD MMM');

      let backgroundImage = `url(${Object.keys(booking.renter.images).length > 0 ? booking.renter.images.medium_url : noImagesPlaceholder})`;

      return (
        <div className="booking-row-renter-and-dates col-xs-12 no-side-padding">
          <div className="booking-row-renter-image pull-left" style={ { backgroundImage: backgroundImage } }></div>
          <div className="booking-row-renter-and-dates-info pull-left">
            <div className="fs-18">
              <b> { booking.renter.name } </b>
            </div>
            <div> { `${bookingStartDate} - ${bookingEndDate}` } </div>
          </div>
        </div>
      );
    }
    else {
      return '';
    }
  }

  renderBookingStatus() {
    let status = '';

    if (!this.props.hideStatus) {
      status = (
        <div className="booking-row-status text-right">
          <BookingStatus booking={ this.props.booking } />
        </div>
      )
    }

    return status;
  }

  render() {
    let detailsView = this.renderBookingDetails();

    if (this.props.currentUserRole === userRoles.renter || this.props.showListingDetails) {
      detailsView = this.renderListingDetails();
    }

    if (this.props.booking) {
      return (
        <div className="booking-row col-xs-12 no-side-padding">
          <Link to={{
            pathname: `bookings/${this.props.booking.id}`,
            state: { booking: this.props.booking } }}>
            { detailsView }

            { this.renderBookingStatus() }
          </Link>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

BookingRow.propTypes = {
  currentUserRole: PropTypes.string.isRequired,
  booking: PropTypes.object.isRequired,
  hideStatus: PropTypes.bool,
  showListingDetails: PropTypes.bool
};

export default BookingRow;
