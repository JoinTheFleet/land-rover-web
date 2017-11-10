import React, { Component } from 'react';
import BookingNotification from './booking_notification';

export default class BookingReviewPendingNotification extends BookingNotification {
  linkData() {
    return {
      state: {
        targetMode: this.state.targetMode
      },
      pathname: `/bookings/${this.state.booking.id}/reviews/new`
    };
  }
}


