import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListingsOverview from './listings_overview';
import ListingView from './listing_view';
import ListingForm from './forms/listing_form';
import BookingForm from '../bookings/forms/booking_form';
import ListingReviews from '../listings/listing_reviews';

import { Switch, Route } from "react-router-dom";

export default class Listings extends Component {
  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        <Switch>
          <Route path="/listings/new" render={(props) => {
            return (<ListingForm {...props}
                                 configurations={ this.props.configurations } />)
          }} />

          <Route path="/listings/preview" render={(props) => {
            return <ListingView {...props}
                                preview={ true }
                                currentUserRole={ this.props.currentUserRole } />
          } } />

          <Route path="/listings/:listing_id/bookings/new" render={(props) => {
            return (<BookingForm {...props} />)
          }} />

          <Route path="/listings/:id/edit" render={(props) => {
            return (<ListingForm {...props}
                                 configurations={ this.props.configurations }
                                 edit={ true } />)
          }} />

          <Route path="/listings/:id/reviews" render={(props) => {
            return (
              <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                <ListingReviews {...props}
                                currentUserRole={ this.props.currentUserRole } />
              </div>
            )
          }} />

          <Route path="/listings/:id" render={(props) => {
            return <ListingView {...props}
                                currentUserRole={ this.props.currentUserRole } />
          }} />

          <Route path="/listings" component={ ListingsOverview } />
        </Switch>
      </div>
    )
  }
}

Listings.propTypes = {
  currentUserRole: PropTypes.string
}
