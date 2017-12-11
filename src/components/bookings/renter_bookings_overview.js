import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import BookingRow from './booking_row';
import ListingsSelector from '../listings/listings_selector';

import Loading from '../miscellaneous/loading';
import Pageable from '../miscellaneous/pageable';
import Placeholder from '../miscellaneous/placeholder';

import Errors from '../../miscellaneous/errors';

import BookingsService from '../../shared/services/bookings/bookings_service';
import LocalizationService from '../../shared/libraries/localization_service';

const BOOKINGS_PER_PAGE = 10;

class RenterBookingsOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      bookings: {
        current: [],
        previous: []
      },
      totalCounts: {
        current: 0,
        previous: 0
      },
      expandedList: '',
      currentPage: 1,
      loading: false
    };

    this.fetchBookings = this.fetchBookings.bind(this);
    this.handleExpandList = this.handleExpandList.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount() {
    this.fetchBookings();
  }

  fetchBookings() {
    let bookings = this.state.bookings;
    let totalCounts = this.state.totalCounts;
    let expandedList = this.state.expandedList;

    let limit = expandedList.length > 0 ? BOOKINGS_PER_PAGE : 3;
    let offset = (this.state.currentPage - 1) * BOOKINGS_PER_PAGE;

    if (expandedList !== 'previous') {
      this.setState({
        loading: true
      }, () => {
        BookingsService.index('current', { limit: limit, offset: offset })
                        .then(response => {
                          bookings.current = response.data.data.bookings;
                          totalCounts.current = response.data.data.count;

                          this.setState({ bookings: bookings, totalCounts: totalCounts, loading: false });
                        })
                        .catch(error => this.addError(Errors.extractErrorMessage(error)));
      });
    }

    if (expandedList !== 'current') {
      this.setState({
        loading: true
      }, () => {
        BookingsService.index('previous', { limit: limit, offset: offset })
                        .then(response => {
                          bookings.previous = response.data.data.bookings;
                          totalCounts.previous = response.data.data.count;

                          this.setState({ bookings: bookings, totalCounts: totalCounts, loading: false });
                        })
                        .catch(error => this.addError(Errors.extractErrorMessage(error)));
      });
    }
  }

  addError(error) {
    this.setState({ loading: false }, Alert.error(error));
  }

  handleExpandList(listToExpand) {
    let newExpandedList = this.state.expandedList === listToExpand ? '' : listToExpand;

    this.setState({ expandedList: newExpandedList, currentPage: 1 }, this.fetchBookings);
  }

  handlePageChange(page) {
    this.setState({ currentPage: page }, this.fetchBookings);
  }

  renderCurrentList() {
    if ( this.state.expandedList === 'previous' || this.state.bookings.previous.length === 0 ) {
      return '';
    }

    let expandMessageId = this.state.expandedList === 'current' ? 'application.see_less' : 'application.see_all';

    return (
      <div className="renter-bookings-overview-current-list col-xs-12 no-side-padding">
        <div className="bookings-overview-list-title col-xs-12 no-side-padding">
          <span className="fs-36"> { LocalizationService.formatMessage('bookings.current') } </span>
          <span className="fs-18 tertiary-text-color"> { `(${this.state.totalCounts.current})` } </span>

          <div className="bookings-overview-list-expand pull-right">
            <span className="fs-18 secondary-text-color" onClick={ () => { this.handleExpandList('current') } }>
              { LocalizationService.formatMessage(expandMessageId) }
            </span>
          </div>
        </div>

        <Pageable currentPage={ this.state.currentPage }
                  totalPages={ this.state.expandedList === 'current' ? Math.ceil(this.state.totalCounts.current / BOOKINGS_PER_PAGE) : 1 }
                  loading={ this.state.loading }
                  handlePageChange={ this.handlePageChange }>
          { this.state.bookings.current.map((booking, index) => (<BookingRow key={ `renter_current_bookings_${index}` } booking={ booking } currentUserRole={ this.props.currentUserRole }  />)) }
        </Pageable>
      </div>
    )
  }

  renderPreviousList() {
    if ( this.state.expandedList === 'current' || this.state.bookings.current.length === 0  ) {
      return '';
    }

    let expandMessageId = this.state.expandedList === 'previous' ? 'application.see_less' : 'application.see_all';

    return (
      <div className="renter-bookings-overview-previous-list col-xs-12 no-side-padding">
        <div className="bookings-overview-list-title col-xs-12 no-side-padding">
          <span className="fs-36"> { LocalizationService.formatMessage('bookings.previous') } </span>
          <span className="fs-18 tertiary-text-color"> { `(${this.state.totalCounts.previous})` } </span>

          <div className="bookings-overview-list-expand pull-right">
            <span className="fs-18 secondary-text-color" onClick={ () => { this.handleExpandList('previous') } }>
              { LocalizationService.formatMessage(expandMessageId) }
            </span>
          </div>
        </div>

        <Pageable currentPage={ this.state.currentPage }
                  totalPages={ this.state.expandedList === 'previous' ? Math.ceil(this.state.totalCounts.previous / BOOKINGS_PER_PAGE) : 1 }
                  loading={ this.state.loading }
                  handlePageChange={ this.handlePageChange }>
          { this.state.bookings.previous.map((booking, index) => (<BookingRow key={ `renter_previous_bookings_${index}` } booking={ booking } currentUserRole={ this.props.currentUserRole }  />)) }
        </Pageable>
      </div>
    )
  }

  renderTopBar() {
    return (
      <ListingsSelector role={ this.props.currentUserRole }
                        changeCurrentUserRole={ this.props.changeCurrentUserRole }
                        handleVehicleSelect= { this.handleVehicleSelect } />
    );
  }

  render() {
    let lists = (<Placeholder contentType="bookings" />);

    if (this.state.loading) {
      lists = (<Loading />);
    }

    if (this.state.bookings.current.length > 0 || this.state.bookings.current.length > 0) {
      lists = (
        <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          { this.renderCurrentList() }
          { this.renderPreviousList() }
        </div>
      )
    }

    return (
      <div className="bookings-overview col-xs-12 no-side-padding">
        { this.renderTopBar() }

        { lists }
      </div>
    );
  }
}

RenterBookingsOverview.propTypes = {
  currentUserRole: PropTypes.string.isRequired
};

export default RenterBookingsOverview;
