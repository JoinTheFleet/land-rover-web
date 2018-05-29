import React, { Component } from 'react';
import moment from 'moment';
import DateRange from '../miscellaneous/date_range';
import BookingStatus from '../bookings/booking_status';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

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
    let vendorLocation = listing.user.vendor_location;
    let messageClassName = conversation.unread ? 'strong-font-weight primary-text-color' : 'tertiary-text-color';
    let imageURL = '';

    let link = `/users/${owner.id}`;
    let name = owner.first_name;

    if (vendorLocation) {
      imageURL = vendorLocation.images.small_url;
      link = `/vendor_locations/${vendorLocation.id}`;
      name = vendorLocation.name;
    }
    else if (listing.gallery && listing.gallery.length > 0) {
      imageURL = listing.gallery[0].images.small_url;
    }

    return (
      <Link key={ `conversation_link_${conversation.id}` }
            to={{
              pathname: `/messages/${conversation.id}`,
              state: {
                conversation: conversation
              }
            }}>
        <div className='col-xs-12 conversation-detail' onClick={ this.props.onClick }>
          <div className='row'>
            <div className='col-xs-3 col-sm-2 col-lg-1 no-side-padding'>
              <Avatar src={ imageURL } round />
            </div>
            <div className='col-xs-7 col-sm-8 col-lg-9 renter-message-information'>
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
                <span className="hidden-xs">&nbsp; &bull; &nbsp;</span>
                <br className="visible-xs" />
                <DateRange start={ start } end={ end } />
              </div>
              <div className='col-xs-12 owner-name'>
                <Link to={{
                  pathname: link,
                }} >
                  { name }
                </Link>
              </div>
              <div className={ `col-xs-12 renter-message-text ${messageClassName}` }>
                { message.text }
              </div>
            </div>
            <div className='text-right col-xs-2 col-lg-2 no-side-padding'>
              <BookingStatus booking={ booking } />
            </div>
          </div>
        </div>
      </Link>
    );
  }
}
