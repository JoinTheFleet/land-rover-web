import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import NotificationsList from './notifications_list';

export default class NotificationsController extends Component {
  render() {
    return (
      <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2'>
        <Switch>
          <Route exact path='/notifications' component={ NotificationsList } />
        </Switch>
      </div>
    );
  }
}
