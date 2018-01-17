import React, { Component } from 'react';
import Alert from 'react-s-alert';

import UsersService from '../../shared/services/users/users_service';
import Loading from '../miscellaneous/loading';

import Dashboard from './dashboard';
import Credits from '../credits/credits';
import WishListsController from '../wishlists/wish_lists_controller';
import LocalizationService from '../../shared/libraries/localization_service';

import { Switch, Route } from 'react-router-dom';

export default class DashboardController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      loading: false,
    };

    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  componentWillMount() {
    if (this.props.location && this.props.location.state) {
      let verificationsNeeded = this.props.location.state.verificationsNeeded;

      if (verificationsNeeded && verificationsNeeded.length > 0) {
        let localisedIdentifier = 'user_profile.verified_info.need_to_complete_verifications_rental';

        if (this.props.location.state.listingVerifications) {
          localisedIdentifier = 'user_profile.verified_info.need_to_complete_verifications_listing';
        }

        Alert.error(LocalizationService.formatMessage(localisedIdentifier,
                                                      { info_to_verify: verificationsNeeded.map(verification => verification.replace(/_/g, ' ')).join(', ').replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }) }));

        this.setState({ verificationAlertShown: true });
      }
    }
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
                    });
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
            <Route path='/profile/credits' render={ (props) => {
              return <Credits user={ this.state.user } {...props} {...this.props} />
            }} />
            <Route path='/profile/wish_lists' render={ (props) => {
              return <WishListsController {...props} {...this.props} />
            }} />
            <Route exact path='/profile' render={ (props) => {
              return <Dashboard user={ this.state.user } {...props} {...this.props} />
            }} />
          </Switch>
        </div>
      );
    }
  }
}
