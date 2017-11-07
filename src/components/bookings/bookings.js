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

    if (this.props.configurations && this.props.currentUserRole) {
      if (this.props.currentUserRole === userRoles.renter) {
        reviewOptions = this.props.configurations.review_options;
      }
      else {
        reviewOptions = this.props.configurations.renter_review_options;
      }
    }

    return reviewOptions;
  }

  render() {
    return (
      <Switch>
        <Route path="/listings/:listing_id/bookings/new" render={(props) => {
          return (<BookingForm {...props} />)
        }} />

        <Route path="/bookings/:id/renter_reviews/new" render={(props) => {
          return (<BookingReview {...props} currentUserRole={ this.props.currentUserRole } reviewOptions={ this.getReviewOptionsForRole() } />)
        }} />

        <Route path="/bookings/:id" render={(props) => {
          return (<BookingForm {...props} currentUserRole={ this.props.currentUserRole } />)
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
  currentUserRole: PropTypes.string,
  configurations: PropTypes.object
}

export default Bookings;
