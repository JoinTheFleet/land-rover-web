import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import LocalizationService from '../../shared/libraries/localization_service';

export default class BookingStatus extends Component {
  render() {
    let booking = this.props.booking;
    let className = 'secondary-text-color';

    let statusMessage = LocalizationService.formatMessage(`bookings.statuses.${booking.status}`);

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
        if (booking.reviewed) {
          className = '';
          statusMessage = LocalizationService.formatMessage('bookings.reviewed');
        }
        else {
          statusMessage = (
            <Link to={{
              pathname: `/bookings/${this.props.booking.id}/renter_reviews/new`,
              state: { booking: booking }
            }}>
              <span className="secondary-text-color"> { LocalizationService.formatMessage('reviews.write_a_review') } </span>
            </Link>
          )
        }

        break;
      default:
        className = 'main-text-color';
    }

    return (
      <span className={ `pull-right ${className}` }>
        { statusMessage }
      </span>
    );
  }
}

BookingStatus.propTypes = {
  booking: PropTypes.object.isRequired
};
