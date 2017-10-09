import React, {
  Component
} from 'react';

import Constants from '../../miscellaneous/constants';

import ListingsOverview from './listings_overview';

const listingsViews = Constants.listingViews();

export default class Listings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: 'index',
      currentSelectedListingId: -1
    };
  }

  getViewToRender() {
    let viewToRender;

    switch(this.state.currentView) {
      case listingsViews.new:
        viewToRender = '';
        break;
      case listingsViews.view:
        viewToRender = '';
        break;
      default:
        viewToRender = (<ListingsOverview></ListingsOverview>);
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
