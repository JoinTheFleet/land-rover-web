import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListingsOverview from './listings_overview';
import ListingView from './listing_view';
import ListingForm from './forms/listing_form';

import Bookings from '../bookings/bookings';

import Constants from '../../miscellaneous/constants';
import Helpers from '../../miscellaneous/helpers';

const listingsViews = Constants.listingsViews();
const bookingsViews = Constants.bookingsViews();
const userRoles = Constants.userRoles();

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

  getViewToRender() {
    let viewToRender;

    switch(this.state.currentView) {
      case listingsViews.new:
      case listingsViews.edit:
        viewToRender = (<ListingForm setCurrentView={ this.setCurrentView }
                                     edit={ this.state.currentView === listingsViews.edit }
                                     listing={ this.state.currentListing } />);
        break;
      case listingsViews.view:
        viewToRender = (<ListingView listing={ this.state.currentListing }
                                     enableBooking={ this.props.currentUserRole === userRoles.renter }
                                     handleChangeView={ this.setCurrentView } />);
        break;
      case listingsViews.requestBooking:
        viewToRender = (<Bookings currentView={ bookingsViews.new }
                                  listing={ this.state.currentListing }
                                  quotation={ this.state.currentQuotation }
                                  pricingQuote={ this.state.currentPricingQuote } />);
        break;
      default:
        viewToRender = (<ListingsOverview handleChangeView={ this.setCurrentView } />);
    }

    return viewToRender;
  }

  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        { this.getViewToRender() }
      </div>
    )
  }
}

Listings.propTypes = {
  currentUserRole: PropTypes.string,
  currentView: PropTypes.oneOf(listingsViews),
  currentSelectedListingId: PropTypes.number
}
