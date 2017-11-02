import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import BookingCard from './booking_card';

import ListingsService from '../../shared/services/listings/listings_service';
import ListingsBookingsService from '../../shared/services/listings/listing_bookings_service';

import Errors from '../../miscellaneous/errors';

import ListingsSelector from '../listings/listings_selector';
import Loading from '../miscellaneous/loading';

class OwnerBookingsOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      bookings: [],
      currentListing: null,
      loading: false
    };

    this.addError = this.addError.bind(this);
    this.fetchListings = this.fetchListings.bind(this);
    this.fetchBookings = this.fetchBookings.bind(this);
  }

  componentWillMount() {
    this.fetchListings();
  }

  fetchListings() {
    this.setState({
      loading: true
    }, () => {
      ListingsService.index()
                     .then(response => {
                       let listings = response.data.data.listings;

                       if (listings.length > 0) {
                         this.setState({
                           listings: listings,
                           currentListing: listings[0]
                         }, this.fetchBookings);
                       }
                       else {
                         this.setState({ loading: false });
                       }
                     })
                     .catch(error => this.addError(error));
    });
  }

  fetchBookings() {
    this.setState({
      loading: true
    }, () => {
      ListingsBookingsService.index(this.state.selectedListingId)
                             .then(response => {
                               this.setState({
                                 bookings: response.data.data.bookings,
                                 loading: false
                               });
                             })
                             .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  addError(error) {
    this.setState({ loading: false }, Alert.error(error));
  }

  renderTopBar() {
    return (
      <ListingsSelector listings={ this.state.listings }
                        currentListing={ this.state.currentListing }
                        handleVehicleSelect= { this.handleVehicleSelect } />
    );
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
        { this.renderTopBar() }

        <div className="owner-bookings-overview-list col-xs-12 no-side-padding">
          { this.state.bookings.map((booking, index) => (<BookingCard key={ `owner_bookings_${index}` } booking={ booking } />)) }
        </div>

        { this.renderLoading() }
      </div>
    );
  }
}

OwnerBookingsOverview.propTypes = {
  currentUserRole: PropTypes.string.isRequired
};

export default OwnerBookingsOverview;
