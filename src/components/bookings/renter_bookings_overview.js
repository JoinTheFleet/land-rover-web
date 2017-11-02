import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import BookingCard from './booking_card';

import BookingsService from '../../shared/services/bookings/bookings_service';

import Loading from '../miscellaneous/loading';
import Errors from '../../miscellaneous/errors';

class RenterBookingsOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      bookings: {
        current: [],
        previous: []
      },
      loading: false
    };

    this.fetchBookings = this.fetchBookings.bind(this);
  }

  componentWillMount() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.setState({
      loading: true
    }, () => {
      let bookings = this.state.bookings;

        BookingsService.index()
                       .then(response => {
                         bookings.current = response.data.data.bookings;

                         this.setState({ bookings: bookings }, () => {
                           BookingsService.index('previous')
                                          .then(response => {
                                            bookings.previous = response.data.data.bookings;

                                            this.setState({ bookings: bookings, loading: false });
                                          });
                         });
                       })
                       .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  addError(error) {
    this.setState({ loading: false }, Alert.error(error));
  }

  renderLoading() {
    if (!this.state.loading) {
      return '';
    }

    return (<Loading fullWidthLoading={ true } />);
  }

  render() {
    return (
      <div className="bookings-overview col-xs-12 no-side-padding">
        <div className="renter-bookings-overview-current-list col-xs-12 no-side-padding">
          { this.state.bookings.current.map((booking, index) => (<BookingCard key={ `renter_current_bookings_${index}` } booking={ booking } />)) }
        </div>

        <div className="renter-bookings-overview-previous-list col-xs-12 no-side-padding">
          { this.state.bookings.previous.map((booking, index) => (<BookingCard key={ `renter_previous_bookings_${index}` } booking={ booking } />)) }
        </div>
      </div>
    );
  }
}

RenterBookingsOverview.propTypes = {
  currentUserRole: PropTypes.string.isRequired
};

export default RenterBookingsOverview;
