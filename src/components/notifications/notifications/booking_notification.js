import React, { Component } from 'react';
import Notification from '../notification';

export default class BookingNotification extends Notification {
  constructor(props) {
    super(props);

    let resources = props.notification.resources;
    let booking = resources.booking;
    let sender = booking.renter;
    let targetMode = resources.target_mode;
    
    if (targetMode === 'owner') {
      sender = booking.listing.user;
    }

    this.state = {
      booking: booking,
      sender: sender,
      targetMode: targetMode
    }
  }

  imageURL() {
    return this.state.sender.images.original_url;
  }

  sender() {
    let sender = this.state.sender;

    return `${sender.first_name} ${sender.last_name}`;
  }

  linkData() {
    return {
      state: {
        targetMode: this.state.targetMode
      },
      pathname: `/bookings/${this.state.booking.id}`
    };
  }
}


