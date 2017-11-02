import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BookingStatus from './booking_status';

class BookingRow extends Component {
  render() {
    let listing = this.props.booking.listing;
    let vehicleMake = listing.variant.make.name;
    let vehicleModel = listing.variant.model.name;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    return (
      <div className="col-xs-12 no-side-padding">
        { vehicleTitle }

        <BookingStatus booking={ this.props.booking } />
      </div>
    );
  }
}

BookingRow.propTypes = {
  booking: PropTypes.object.isRequired
};

export default BookingRow;
