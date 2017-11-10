import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import LocalizationService from '../../shared/libraries/localization_service';
import NotificationsService from '../../shared/services/notifications_service';

import Pageable from '../miscellaneous/pageable';

import NotificationBuilder from './notification_builder';

const LIMIT = 10;

export default class NotificationsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      page: 0,
      pages: 1,
      notifications: [],
    }

    this.handlePageChange = this.handlePageChange.bind(this);
    this.reloadData = this.reloadData.bind(this);
  }

  componentWillMount() {
    this.reloadData();
  }

  handlePageChange(page) {
    this.setState({
      page: page - 1
    }, this.reloadData)
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
    return (
      <Pageable loading={ this.state.loading } currentPage={ this.state.page + 1 } totalPages={ this.state.pages } handlePageChange={ this.handlePageChange }>
        {
          this.state.notifications.map((notification) => {
            return <NotificationBuilder key={ `notification_builder_${notification.id}` } notification={ notification } />;
          })
        }
      </Pageable>
    )
  }
}
