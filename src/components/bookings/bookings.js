import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import PropTypes from 'prop-types';

import BookingForm from './forms/booking_form';
import BookingReview from './booking_review';
import OwnerBookingsOverview from './owner_bookings_overview';
import RenterBookingsOverview from './renter_bookings_overview';

import Constants from '../../miscellaneous/constants';


const userRoles = Constants.userRoles();

class Bookings extends Component {

  constructor(props) {
    super(props);

    this.getReviewOptionsForRole = this.getReviewOptionsForRole.bind(this);
  }

  getReviewOptionsForRole() {
    let reviewOptions = [];
    let role = this.props.currentUserRole;
    let location = this.props.location;

    if (location && location.state && location.state.targetMode) {
      role = location.state.targetMode;
    }

    if (this.props.configurations && role) {
      if (role === userRoles.renter) {
        reviewOptions = this.props.configurations.review_options;
      }
      else {
        reviewOptions = this.props.configurations.renter_review_options;
      }
    }

    return reviewOptions;
  }

  render() {
    let role = this.props.currentUserRole;
    let location = this.props.location;

    if (location && location.state && location.state.targetMode) {
      role = location.state.targetMode;
    }

    return (
      <Switch>
        <Route path="/listings/:listing_id/bookings/new" render={(props) => {
          return (<BookingForm {...props} />)
        }} />

        <Route path="/bookings/:id/reviews/new" render={(props) => {
          return (<BookingReview {...props} currentUserRole={ role } reviewOptions={ this.getReviewOptionsForRole() } />)
        }} />

        <Route path="/bookings/:id" render={(props) => {
          return (<BookingForm {...props} currentUserRole={ role } />)
        }} />

        <Route path="/bookings" render={(props) => {
          let overviewDiv = (<OwnerBookingsOverview {...props} currentUserRole={ role }  />);

          if (this.props.currentUserRole === userRoles.renter) {
            overviewDiv = (<RenterBookingsOverview {...props} currentUserRole={ role }  />);
          }

          return overviewDiv;
        }} />
      </Switch>
    );
  }
}

Bookings.propTypes = {
  currentUserRole: PropTypes.string,
  configurations: PropTypes.object
}

export default Bookings;
