import React, { Component } from 'react';
import Alert from 'react-s-alert';

import UsersService from '../../shared/services/users/users_service';
import Loading from '../miscellaneous/loading';

import Dashboard from './dashboard';
import Credits from '../credits/credits';
import WishListsController from '../wishlists/wish_lists_controller';

import { Switch, Route } from 'react-router-dom';

export default class DashboardController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
      },
      loading: false,
    };

    this.refreshData = this.refreshData.bind(this);
  }

  componentWillMount() {
    this.refreshData();
  }

  refreshData() {
    this.setState({
      loading: true
    }, () => {
      UsersService.show('me')
                  .then(response => {
                    this.setState({
                      user: response.data.data.user,
                      loading: false,
                    });
                  })
                  .catch(error => {
                    this.setState({
                      loading: false
                    }, () => {
                      if (error.response) {
                        Alert.error(error.response.data.message);
                      }
                    })
                  });
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    else {
      return (
        <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 no-side-padding'>
          <Switch>
            <Route path='/dashboard/credits' render={ (props) => {
              return <Credits user={ this.state.user } {...props} {...this.props} />
            }} />
            <Route path='/dashboard/wish_lists' render={ (props) => {
              return <WishListsController {...props} {...this.props} />
            }} />
            <Route exact path='/dashboard' render={ (props) => {
              return <Dashboard user={ this.state.user } {...props} {...this.props} />
            }} />
          </Switch>
        </div>
      );
    }
  }
}
