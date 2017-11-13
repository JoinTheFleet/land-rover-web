import React, { Component } from 'react';
import Avatar from 'react-avatar';

import LocalizationService from '../../shared/libraries/localization_service';
import Loading from '../miscellaneous/loading';
import WishListSummary from '../wishlists/wish_list_summary';
import { Link } from 'react-router-dom';

export default class Dashboard extends Component {
  render() {
    if (!this.props.user) {
      return <Loading />;
    }
    else {
      let image;


      if (this.props.user.images && Object.keys(this.props.user.images).length > 0) {
        image = this.props.user.images.large_url;
      }

      return (
        <div className='col-xs-12 user-dashboard'>
          <div className='col-xs-12 no-side-padding user-header'>
            <Avatar src={ image } size={ 200 } className='col-xs-12 col-sm-4 user-avatar no-side-padding' />
            <div className='col-xs-12 col-sm-8 dashboard-information'>
              <div className='dashboard-information-container no-side-padding col-xs-12'>
                <div className='col-xs-12 no-side-padding user-name'>
                  { this.props.user.name }
                </div>
                <div className='col-xs-12 no-side-padding credit-information'>
                  <div className='col-xs-12 credit-amount no-side-padding '>
                    { this.props.user.credit_balance ? this.props.user.credit_balance.message : '' }
                  </div>
                  <div className='col-xs-12 credit-explanation no-side-padding'>
                    { LocalizationService.formatMessage('dashboard.credits.invite') }
                  </div>
                  <div className='col-xs-12 no-side-padding credit-button'>
                    <Link to={ '/dashboard/credits' } className='btn btn-inverted col-xs-12 col-sm-2'>
                      { LocalizationService.formatMessage('dashboard.credits.view') }
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <WishListSummary />
          </div>
        </div>
      );
    }
  }
}
