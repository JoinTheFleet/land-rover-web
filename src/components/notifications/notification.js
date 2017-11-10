import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Avatar from 'react-avatar';

import moment from 'moment';

import LocalizationService from '../../shared/libraries/localization_service';

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

    return (
      <div className='row'>
        <div className='col-xs-12'>
          <Avatar src={ this.imageURL() } size={ '80px' } name={ this.sender() } round className='col-xs-12 col-sm-4 platform-avatar no-side-padding' />
          <div className='col-xs-12 credit-container' >
            <span className='strong-font-weight pull-left credit-name no-side-padding col-xs-10 text-left'>
              { this.sender() }
            </span>
            <span className='col-xs-2 pull-right text-right timestamp'>
              { moment.unix(notification.created_at).fromNow() }
            </span>
            <span className='col-xs-10 pull-left no-side-padding'>
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
