import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import ListingsOverview from './listings_overview';
import ListingView from './listing_view';
import ListingForm from './forms/listing_form';
import BookingForm from '../bookings/forms/booking_form';
import ListingReviews from '../listings/listing_reviews';

import UsersService from '../../shared/services/users/users_service'
import Errors from '../../miscellaneous/errors';

export default class Listings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: undefined
    };
  }

  componentDidMount() {
    if (this.props.loggedIn) {
      UsersService.show('me')
                  .then(response => {
                    this.setState({
                      loggedUser: response.data.data.user
                    });
                  })
                  .catch(error => Alert.error(Errors.extractErrorMessage(error)));
    }
  }

  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        <Switch>
          <Route path="/listings/new" render={(props) => {
            return (<ListingForm {...props}
                                 configurations={ this.props.configurations } />)
          }} />

          <Route path="/listings/preview" render={(props) => {
            return <ListingView {...props}
                                preview={ true }
                                loggedUser={ this.state.loggedUser }
                                loggedIn={ this.props.loggedIn } />
          } } />

          <Route path="/listings/:listing_id/bookings/new" render={(props) => {
            return (<BookingForm {...props} />)
          }} />

          <Route path="/listings/:id/edit" render={(props) => {
            return (<ListingForm {...props}
                                 configurations={ this.props.configurations }
                                 edit={ true } />)
          }} />

          <Route path="/listings/:id/reviews" render={(props) => {
            return (
              <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                <ListingReviews {...props}
                                currentUserRole={ this.props.currentUserRole } />
              </div>
            )
          }} />

          <Route path="/listings/:id" render={(props) => {
            return <ListingView {...props}
                                loggedIn={ this.props.loggedIn }
                                loggedUser={ this.state.loggedUser }
                                toggleModal={ this.props.toggleModal } />
          }} />

          <Route path="/listings" component={ ListingsOverview } />
        </Switch>
      </div>
    )
  }
}

Listings.propTypes = {
  currentUserRole: PropTypes.string,
  loggedIn: PropTypes.bool
}
