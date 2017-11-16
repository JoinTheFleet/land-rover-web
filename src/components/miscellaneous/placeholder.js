import React, { Component } from 'react';
import PropTypes from 'prop-types';

import noContentPlaceholder from '../../assets/images/placeholders/no_content.png';
import noBookingsPlaceholder from '../../assets/images/placeholders/no_bookings.png';
import noMessagesPlaceholder from '../../assets/images/placeholders/no_messages.png';
import noReviewsPlaceholder from '../../assets/images/placeholders/no_reviews.png';
import noVehiclesGuestPlaceholder from '../../assets/images/placeholders/no_vehicles_guest.png';
import noVehiclesRenterPlaceholder from '../../assets/images/placeholders/no_vehicles_renter.png';

export default class Placeholder extends Component {
  renderPlaceholder() {
    switch(this.props.contentType) {
      case 'bookings':
        return (<img src={ noBookingsPlaceholder } alt="no_content" />);
      case 'messages':
        return (<img src={ noMessagesPlaceholder } alt="no_messages" />);
      case 'reviews':
        return (<img src={ noReviewsPlaceholder } alt="no_reviews" />);
      case 'vehicles_guest':
        return (<img src={ noVehiclesGuestPlaceholder } alt="no_vehicles" />);
      case 'vehicles_renter':
        return (<img src={ noVehiclesRenterPlaceholder } alt="no_vehicles" />);
      default:
        return (<img src={ noContentPlaceholder } alt="no_content" />);
    }
  }

  render() {
    return (
      <div className="fleet-placeholder col-xs-12 text-center">
        { this.renderPlaceholder() }
      </div>
    );
  }
}

Placeholder.propTypes = {
  contentType: PropTypes.string
};
