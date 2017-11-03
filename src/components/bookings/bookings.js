import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import PropTypes from 'prop-types';

import BookingForm from './forms/booking_form';
import OwnerBookingsOverview from './owner_bookings_overview';
import RenterBookingsOverview from './renter_bookings_overview';

import Constants from '../../miscellaneous/constants';

const userRoles = Constants.userRoles();

class Bookings extends Component {

  render() {
    return (
      <Switch>
        <Route path="/listings/:listing_id/bookings/new" render={(props) => {
          return (<BookingForm {...props} />)
        }} />

        <Route path="/bookings" render={(props) => {
          let overviewDiv = (<OwnerBookingsOverview {...props} currentUserRole={ this.props.currentUserRole }  />);

          if (this.props.currentUserRole === userRoles.renter) {
            overviewDiv = (<RenterBookingsOverview {...props} currentUserRole={ this.props.currentUserRole }  />);
          }

          return overviewDiv;
        }} />
      </Switch>
    );
  }
}

Bookings.propTypes = {
  currentUserRole: PropTypes.string
}

export default Bookings;
