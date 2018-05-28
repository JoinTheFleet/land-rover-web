import React, { Component } from 'react';

import Avatar from 'react-avatar';
import LocalizationService from '../../shared/libraries/localization_service';

import { Link } from 'react-router-dom';

export default class Overview extends Component {
  renderMobile() {
    let user = this.props.user;

    return (
      <div className="listing-view-user-details-mobile visible-xs col-xs-12 no-side-padding">
        <div className="pull-left"> 
          <div> { LocalizationService.formatMessage('application.owner') } </div>

          <div className="col-xs-12 no-side-padding">
            <div>
              <Link to={{
                  pathname: `/users/${user.id}`,
                  state: {
                    user: user
                  }
                }} >
                <span className="secondary-text-color fs-18">{ user.first_name }</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="listing-view-user-details-mobile-image pull-right">
          <Link to={{
                pathname: `/users/${user.id}`,
                state: {
                  user: user
                }
              }} >
            <Avatar size={ 50 } src={ user.images.original_url } alt="listing_user_avatar" round />
          </Link>
        </div>
      </div>
    );
  }

  renderNormal() {
    let user = this.props.user;

    return (
      <div className="listing-view-user-details hidden-xs text-center pull-right">
        <Link to={{
          pathname: `/users/${user.id}`,
          state: {
            user: user
          }
        }} >
          <div className='text-center block'>
            <Avatar size={ 50 } src={ user.images.original_url } alt="listing_user_avatar" round />
            <span className="secondary-text-color fs-18">{ user.first_name }</span>
          </div>
        </Link>
      </div>
    )
  }

  render() {
    if (this.props.mobile) {
      return this.renderMobile();
    }
    else {
      return this.renderNormal();
    }
  }
}
