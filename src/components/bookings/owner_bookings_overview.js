import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import BookingRow from './booking_row';
import Pageable from '../miscellaneous/pageable';

import ListingsService from '../../shared/services/listings/listings_service';
import ListingsBookingsService from '../../shared/services/listings/listing_bookings_service';

import Errors from '../../miscellaneous/errors';

import ListingsSelector from '../listings/listings_selector';

const BOOKINGS_PER_PAGE = 10;

class OwnerBookingsOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      bookings: [],
      currentListing: null,
      currentPage: 1,
      totalPages: 1,
      loading: false
    };

    this.addError = this.addError.bind(this);
    this.fetchListings = this.fetchListings.bind(this);
    this.fetchBookings = this.fetchBookings.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleVehicleSelect = this.handleVehicleSelect.bind(this);
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
      let offset = (this.state.currentPage - 1) * BOOKINGS_PER_PAGE;

      ListingsBookingsService.index(this.state.currentListing.id, { limit: BOOKINGS_PER_PAGE, offset: offset })
                             .then(response => {
                               this.setState({
                                 bookings: response.data.data.bookings,
                                 totalPages: Math.ceil(response.data.data.count / BOOKINGS_PER_PAGE),
                                 loading: false
                               });
                             })
                             .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  addError(error) {
    this.setState({ loading: false }, Alert.error(error));
  }

  handleVehicleSelect(listing) {
    this.setState({
      currentListing: listing,
      loading: true
    }, () => {
      this.fetchBookings();
    });
  }

  handlePageChange(page) {
    this.setState({ currentPage: page }, this.fetchBookings);
  }

  renderTopBar() {
    return (
      <ListingsSelector listings={ this.state.listings }
                        currentListing={ this.state.currentListing }
                        handleVehicleSelect= { this.handleVehicleSelect } />
    );
  }

  render() {
    return (
      <div className="bookings-overview col-xs-12 no-side-padding">
        { this.renderTopBar() }


        <Pageable currentPage={ this.state.currentPage }
                  totalPages={ this.state.totalPages }
                  loading={ this.state.loading }
                  handlePageChange={ this.handlePageChange }>
          <div className="owner-bookings-overview-list col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
            { this.state.bookings.map((booking, index) => (<BookingRow key={ `owner_bookings_${index}` } booking={ booking } currentUserRole={ this.props.currentUserRole } />)) }
          </div>
        </Pageable>
      </div>
    );
  }
}

OwnerBookingsOverview.propTypes = {
  currentUserRole: PropTypes.string.isRequired
};

export default OwnerBookingsOverview;
