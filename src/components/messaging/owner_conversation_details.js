import React, { Component } from 'react';
import moment from 'moment';
import DateRange from '../miscellaneous/date_range';
import BookingStatus from '../bookings/booking_status';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

export default class OwnerConversationDetails extends Component {
  render() {
    let conversation = this.props.conversation;
    let booking = conversation.booking;
    let start = moment.unix(booking.start_at).utc();
    let end = moment.unix(booking.end_at).utc();
    let renter = booking.renter;

    let message = conversation.messages[0];
    let messageClassName = conversation.unread ? 'strong-font-weight primary-text-color' : 'tertiary-text-color';
    let imageURL = renter.images.small_url;

    return (
      <Link key={ `conversation_link_${conversation.id}` } to={ `/messages/${conversation.id}` }>
        <div className='col-xs-12 conversation-detail' onClick={ this.props.onClick }>
          <div className='row'>
            <div className='col-xs-2 col-lg-1'>
              <Avatar src={ imageURL } round />
            </div>
            <div className='col-xs-8 col-lg-9 owner-message-information'>
              <div className='col-xs-12'>
                <span className='strong-font-weight conversation-header'>
                  { renter.name }
                </span>
              </div>
              <div className='col-xs-12'>
                <DateRange start={ start } end={ end } />
              </div>
              <div className={ `col-xs-12 owner-message-text ${messageClassName}` }>
                { message.text }
              </div>
            </div>
            <div className='col-xs-2 col-lg-2'>
              <BookingStatus booking={ booking } />
            </div>
          </div>
        </div>
      </Link>
    );
  }
}
