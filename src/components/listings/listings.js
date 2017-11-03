import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListingsOverview from './listings_overview';
import ListingView from './listing_view';
import ListingForm from './forms/listing_form';
import BookingForm from '../bookings/forms/booking_form';

import { Switch, Route } from "react-router-dom";

export default class Listings extends Component {
  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        <Switch>
          <Route path="/listings/new" component={ ListingForm } />

          <Route path="/listings/:listing_id/bookings/new" render={(props) => {
            return (<BookingForm {...props} />)
          }} />

          <Route path="/listings/:id/edit" render={(props) => {
            return (<ListingForm {...props}
                                 edit={ true } />)
          }} />

          <Route path="/listings/:id" render={(props) => {
            return <ListingView {...props}
                                enableBooking={ this.props.currentUserRole === 'renter' } />
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
