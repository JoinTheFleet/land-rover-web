import React, { Component } from 'react';
import PropTypes from 'prop-types';

import noContentPlaceholder from '../../assets/images/placeholders/no_content.png';
import noOwnerBookingsPlaceholder from '../../assets/images/placeholders/no_owner_bookings.png';
import noRenterBookingsPlaceholder from '../../assets/images/placeholders/no_renter_bookings.png';
import noOwnerMessagesPlaceholder from '../../assets/images/placeholders/no_owner_messages.png';
import noRenterMessagesPlaceholder from '../../assets/images/placeholders/no_messages.png';
import noReviewsPlaceholder from '../../assets/images/placeholders/no_reviews.png';
import noVehiclesGuestPlaceholder from '../../assets/images/placeholders/no_vehicles_guest.png';
import noCreditsPlaceholder from '../../assets/images/placeholders/no_free_credits.png';
import noNotificationsPlaceholder from '../../assets/images/placeholders/no_notifications.png';
import noPayoutMethodsPlaceholder from '../../assets/images/placeholders/no_payout_methods.png';
import noPaymentMethodsPlaceholder from '../../assets/images/placeholders/no_payment_methods.png';
import noWishlistsPlaceholder from  '../../assets/images/placeholders/no_wishlists.png';
import noVehiclesSearchPlaceholder from '../../assets/images/placeholders/no_vehicles_search.png'

export default class Placeholder extends Component {
  renderPlaceholder() {
    console.log(this.props.contentType) 
    switch(this.props.contentType) {
      case 'owner_bookings':
        return (<img src={ noOwnerBookingsPlaceholder } alt="no_content" />);
      case 'renter_bookings':
        return (<img src={ noRenterBookingsPlaceholder } alt="no_content" />);
      case 'owner_messages':
        return (<img src={ noOwnerMessagesPlaceholder } alt="no_messages" />);
      case 'renter_messages':
        return (<img src={ noRenterMessagesPlaceholder } alt="no_messages" />);
      case 'reviews':
        return (<img src={ noReviewsPlaceholder } alt="no_reviews" />);
      case 'vehicles_guest':
        return (<img src={ noVehiclesGuestPlaceholder } alt="no_vehicles" />);
      case 'credits':
        return (<img src={ noCreditsPlaceholder } alt="no_credits" />);
      case 'notifications':
        return (<img src={ noNotificationsPlaceholder } alt="no_notifications" />);
      case 'payment_methods':
        return (<img src={ noPaymentMethodsPlaceholder } alt='no_payment_methods' />);
      case 'payout_methods':
        return (<img src={ noPayoutMethodsPlaceholder } alt='no_payout_methods' />);
      case 'wishlists':
        return (<img src={ noWishlistsPlaceholder } alt='no_wishlists' />);
      case 'search_vehicles':
        return (<img src={ noVehiclesSearchPlaceholder } alt='no_vehicles' />);
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
