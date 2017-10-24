import React, {
  Component
} from 'react';

import Constants from '../../miscellaneous/constants';

import ListingsOverview from './listings_overview';
import ListingView from './listing_view';
import ListingForm from './forms/listing_form';

import Helpers from '../../miscellaneous/helpers';

const listingsViews = Constants.listingViews();

export default class Listings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentListing: {},
      currentView: 'index',
      currentSelectedListingId: -1
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
        viewToRender = (
          <ListingForm setCurrentView={ this.setCurrentView }
                       edit={ this.state.currentView === listingsViews.edit }
                       listing={ this.state.currentListing } />
        );
        break;
      case listingsViews.view:
        viewToRender = <ListingView listing={ this.state.currentListing } enableBooking={ true } />;
        break;
      default:
        viewToRender = (<ListingsOverview handleChangeView={ this.setCurrentView }></ListingsOverview>);
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
