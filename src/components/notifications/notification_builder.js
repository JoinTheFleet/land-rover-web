import React, { Component } from 'react';

import Notification from './notification';
import MessageSentNotification from './notifications/message_sent_notification';
import CreditAwardedNotification from './notifications/credit_awarded_notification';
import BookingNotification from './notifications/booking_notification';
import BookingReviewPendingNotification from './notifications/booking_review_pending_notification';
export default class NotificationBuilder extends Component {
  render() {
    switch(this.props.notification.notification_type) {
      case 'message_sent':
        return <MessageSentNotification {...this.props} />;
      case 'credit_awarded':
        return <CreditAwardedNotification {...this.props} />;
      case 'booking_request':
      case 'booking_check_in':
      case 'booking_confirmation':
      case 'booking_upcoming':
        return <BookingNotification {...this.props} />;
      case 'booking_owner_review_pending':
      case 'booking_renter_review_pending':
        return <BookingReviewPendingNotification {...this.props} />;
      default:
        return <Notification {...this.props} />;
    }
  }
}
