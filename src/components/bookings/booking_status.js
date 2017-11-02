import React, { Component } from 'react';

import PropTypes from 'prop-types';
import LocalizationService from '../../shared/libraries/localization_service';

export default class BookingStatus extends Component {
  render() {
    let booking = this.props.booking;
    let className = 'secondary-text-color';

    switch (booking.status) {
      case 'rejected':
      case 'pending':
      case 'cancelled':
        className = 'text-danger';
        break;
      case 'confirmed':
      case 'in_progress':
        className = 'secondary-text-color';
        break;
      case 'completed':
        className = 'text-success';
        break;
      default:
        className = 'main-text-color';
    }

    return (
      <span className={ `pull-right ${className}` }>
        { LocalizationService.formatMessage(`bookings.statuses.${booking.status}`) }
      </span>
    );
  }
}

BookingStatus.propTypes = {
  booking: PropTypes.object.isRequired
};
