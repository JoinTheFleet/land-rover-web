import React, { Component } from 'react';

import NotificationBuilder from './notification_builder';
import Pageable from '../miscellaneous/pageable';
import Placeholder from '../miscellaneous/placeholder';
import Loading from '../miscellaneous/loading';
import NotificationsService from '../../shared/services/notifications_service';

const LIMIT = 10;

export default class NotificationsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      page: 0,
      pages: 1,
      notifications: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.reloadData = this.reloadData.bind(this);
  }

  componentWillMount() {
    this.reloadData();
  }

  handlePageChange(page) {
    this.setState({
      page: page - 1
    }, this.reloadData);
  }

  reloadData() {
    this.setState({
      loading: true
    }, () => {
      NotificationsService.index({
        limit: LIMIT,
        offset: LIMIT * this.state.page
      })
      .then(response => {
        let data = response.data.data;

        this.setState({
          loading: false,
          notifications: data.notifications,
          pages: Math.ceil(data.count / LIMIT)
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    else if (this.state.notifications.length === 0) {
      return (<Placeholder contentType={ 'notifications' } />);
    }
    else {
      return (
        <Pageable loading={ this.state.loading } currentPage={ this.state.page + 1 } totalPages={ this.state.pages } handlePageChange={ this.handlePageChange }>
          <div className="notifications-list col-xs-12 no-side-padding">
            {
              this.state.notifications.map((notification) => {
                return <NotificationBuilder key={ `notification_builder_${notification.id}` } notification={ notification } />;
              })
            }
          </div>
        </Pageable>
      )
    } 
  }
}
