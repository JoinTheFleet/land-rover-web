import React, { Component } from 'react';

import UserProfileDetails from './user_profile_details';
import UserProfileVerifiedInfo from './user_profile_verified_info';
import UserProfileMenu from './user_profile_menu';
import UserPaymentMethods from './user_payment_methods';
import UserPayoutMethods from './user_payout_methods';
import UserNotificationSettings from './user_notification_settings';

import { Elements } from 'react-stripe-elements';
import { Switch, Route } from 'react-router-dom';

export default class UserManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  render() {
    return (
      <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 no-side-padding'>
        <div className='col-xs-12 col-sm-3'>
          <UserProfileMenu {...this.props} />
        </div>
        <div className='col-xs-12 col-sm-9'>
          <Switch>
            <Route path='/account/verified_info' component={ UserProfileVerifiedInfo } />
            <Route path='/account/payment_methods' render={ (props) => {
              return (
                <Elements>
                  <UserPaymentMethods {...props} />
                </Elements>
              )
            }} />
            <Route path='/account/payout_methods' render={ (props) => {
              return (
                <Elements>
                  <UserPayoutMethods {...props} />
                </Elements>
              )
            }} />
            <Route path='/account/notification_settings' component={ UserNotificationSettings } />
            <Route exact path='/account' component={ UserProfileDetails } />
          </Switch>
        </div>
      </div>
    )
  }
}
