import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import BookingForm from './forms/booking_form';

class Bookings extends Component {

  render() {
    return (
      <Switch>
        <Route path="listings/:listing_id/bookings/new" render={(props) => {
          return (<BookingForm {...props} />)
        }} />
      </Switch>
    );
  }
}

export default Bookings;
