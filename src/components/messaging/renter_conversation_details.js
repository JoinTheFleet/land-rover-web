import React, { Component } from 'react';
import moment from 'moment';
import DateRange from '../miscellaneous/date_range';
import BookingStatus from '../bookings/booking_status';
import Avatar from 'react-avatar';

export default class RenterConversationDetails extends Component {
  render() {
    let conversation = this.props.conversation;
    let booking = conversation.booking;
    let start = moment.unix(booking.start_at).utc();
    let end = moment.unix(booking.end_at).utc();
    let listing = conversation.listing;
    let variant = listing.variant;

    let message = conversation.messages[0];
    let owner = listing.user;
    let messageClassName = conversation.unread ? 'strong-font-weight primary-text-color' : 'tertiary-text-color';
    let imageURL = '';

    if (listing.gallery && listing.gallery.length > 0) {
      imageURL = listing.gallery[0].images.small_url;
    }

    return (
      <div className='col-xs-12 conversation-detail'>
        <div className='row'>
          <div className='col-xs-2 col-lg-1'>
            <Avatar src={ imageURL } round />
          </div>
          <div className='col-xs-8 col-lg-9'>
            <div className='col-xs-12'>
              <span className='strong-font-weight conversation-header'>
                { variant.make.display }, { variant.model.name }
              </span>
              <span className='conversation-header'>
                { variant.year.year }
              </span>
            </div>
            <div className='col-xs-12'>
              <span>{ listing.address }</span>
              &nbsp; &bull; &nbsp;
              <DateRange start={ start } end={ end } />
            </div>
            <div className='col-xs-12'>
              { owner.name }
            </div>
            <div className={ `col-xs-12 ${messageClassName}` }>
              { message.text }
            </div>
          </div>
          <div className='col-xs-2 col-lg-2'>
            <BookingStatus booking={ booking } />
          </div>
        </div>
      </div>
    );
  }
}
