import React, { Component } from 'react';
import Avatar from 'react-avatar';

import LocalizationService from '../../shared/libraries/localization_service';
import Loading from '../miscellaneous/loading';
import WishListSummary from '../wishlists/wish_list_summary';
import { Link } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';

import UserProfileVerifiedInfo from '../user_management/user_profile_verified_info';
import UserPaymentMethods from '../user_management/user_payment_methods';
import UserPayoutMethods from '../user_management/user_payout_methods';
import UserProfileDetails from '../user_management/user_profile_details';

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
                    <Link to={ '/profile/credits' } className='btn btn-inverted col-xs-12 col-sm-2'>
                      { LocalizationService.formatMessage('dashboard.credits.view') }
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <UserProfileDetails />
          </div>
          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <UserProfileVerifiedInfo {... this.props } />
          </div>
          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <Elements>
              <UserPaymentMethods {... this.props} />
            </Elements>
          </div>
          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <Elements>
              <UserPayoutMethods {... this.props} />
            </Elements>
          </div>

          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <WishListSummary />
          </div>
        </div>
      );
    }
  }
}
