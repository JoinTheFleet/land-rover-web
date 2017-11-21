import React, { Component } from 'react';
import Alert from 'react-s-alert';

import UserProfileDetails from './user_profile_details';
import UserProfileVerifiedInfo from './user_profile_verified_info';
import UserProfileMenu from './user_profile_menu';
import UserPaymentMethods from './user_payment_methods';
import UserPayoutMethods from './user_payout_methods';
import UserNotificationSettings from './user_notification_settings';

import { Elements } from 'react-stripe-elements';
import { Switch, Route } from 'react-router-dom';

import LocalizationService from '../../shared/libraries/localization_service';

export default class UserManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    if (this.props.location && this.props.location.state) {
      let verificationsNeeded = this.props.location.state.verificationsNeeded;

      if (verificationsNeeded && verificationsNeeded.length > 0) {
        Alert.error(LocalizationService.formatMessage('user_profile.verified_info.need_to_complete_verifications',
                                                      { info_to_verify: verificationsNeeded.map(verification => verification.replace(/_/g, ' ')).join(', ') }));
      }
    }
  }

  render() {
    return (
      <div className='user-management col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 no-side-padding'>
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
