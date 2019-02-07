import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Avatar from 'react-avatar';

import moment from 'moment';

export default class Notification extends Component {
  sender() {
    return '';
  }

  imageURL() {
    return process.env.REACT_APP_PLATFORM_IMAGE_URL;
  }

  linkData() {
    return undefined;
  }

  linkedNotification() {
    return (
      <NavLink to={ this.linkData() } >
        { this.notification() }
      </NavLink>
    );
  }

  notification() {
    let notification = this.props.notification;
    let className = notification.status === 'read' ? '' : 'unread';

    return (
      <div className='row'>
        <div className='col-xs-12'>
          <Avatar src={ this.imageURL() } size={ 80 } name={ this.sender() } round className='col-xs-12 col-sm-4 platform-avatar no-side-padding' />
          <div className='col-xs-12 credit-container' >
            <span className={ `strong-font-weight pull-left credit-name no-side-padding col-xs-10 text-left ${className}` }>
              { this.sender() }
            </span>
            <span className={ `col-xs-2 pull-right text-right timestamp ${className}` } >
              { moment.unix(notification.created_at).fromNow() }
            </span>
            <span className={ `col-xs-10 pull-left no-side-padding ${className}` }>
              { notification.message }
            </span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let notification = this.notification();

    if (this.linkData()) {
      notification = this.linkedNotification();
    }

    return (
      <div className='col-xs-12 no-side-padding wishlist-card credit-card'>
        { notification }
      </div>
    )
  }
}
