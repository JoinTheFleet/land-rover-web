import React, { Component } from 'react';

import UserProfileMenu from './user_profile_menu';
import UserNotificationSettings from './user_notification_settings';

export default class UserManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  render() {
    return (
      <div className='user-management col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 no-side-padding'>
        <div className='col-xs-12 col-sm-3'>
          <UserProfileMenu {...this.props} />
        </div>
        <div className='col-xs-12 col-sm-9'>
          <UserNotificationSettings {...this.props} />
        </div>
      </div>
    )
  }
}
