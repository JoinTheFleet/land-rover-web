import React, { Component } from 'react';
import Alert from 'react-s-alert';

import UsersService from '../../shared/services/users/users_service';
import Loading from '../miscellaneous/loading';

import User from './user';
import UserReviews from './user_reviews';
import UserListings from './user_listings';
import { Switch, Route } from 'react-router-dom';

export default class UserController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
      loading: false
    };

    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  componentWillReceiveProps(props) {
    if (this.props.match.params.id !== props.match.params.id) {
      this.setState({
        user: undefined,
        loading: true
      }, this.refreshData);
    }
  }

  refreshData() {
    let location = this.props.location;

    if (location && location.state && location.state.user) {
      this.setState({ user: location.state.user });
    }
    else {
      this.setState({
        loading: true
      }, () => {
        UsersService.show(this.props.match.params.id)
                    .then(response => {
                      this.setState({
                        user: response.data.data.user,
                        loading: false
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
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    else {
      return (
        <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 no-side-padding'>
          <Switch>
            <Route path='/users/:id/reviews' render={(props) => { return <UserReviews user={ this.state.user } {...props} {...this.props} />}} />
            <Route path='/users/:id/listings' render={(props) => { return <UserListings user={ this.state.user } {...props} {...this.props} />}} />
            <Route path='/users/:id' render={(props) => { return <User user={ this.state.user } {...props} {...this.props} />}} />
          </Switch>
        </div>
      );
    }
  }
}
