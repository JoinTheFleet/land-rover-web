import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListingsOverview from './listings_overview';
import ListingView from './listing_view';
import ListingForm from './forms/listing_form';

import Helpers from '../../miscellaneous/helpers';

import { Switch, Route } from "react-router-dom";

export default class Listings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentListing: this.props.currentListing || {},
      currentView: this.props.currentView || 'index',
      currentSelectedListingId: this.props.currentSelectedListingId || -1,
      currentPricingQuote: {},
      currentQuotation: {}
    };

    this.setCurrentView = this.setCurrentView.bind(this);
  }

  setCurrentView(view, params) {
    let newState = { currentView: view };
    let additionalParams = params || {};

    this.setState(Helpers.extendObject(newState, additionalParams));
  }

  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        <Switch>
          <Route path="/listings/new" component={ ListingForm } />
          <Route path="/listings/:id/edit" render={(props) => {
            return (<ListingForm {...props}
                                 edit={ true } />)
          }} />
          <Route path="/listings/:id" render={(props) => {
            return <ListingView {...props}
                                listing={ this.state.currentListing }
                                enableBooking={ this.props.currentUserRole === 'renter' }
                                handleChangeView={ this.setCurrentView } />
          }} />
          <Route path="/listings" component={ ListingsOverview } />
        </Switch>
      </div>
    )
  }
}

Listings.propTypes = {
  currentUserRole: PropTypes.string
}
