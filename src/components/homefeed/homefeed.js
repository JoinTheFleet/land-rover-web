import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ListingList from '../listings/listing_list';

import homefeedExampleData from '../../homefeed_example.json';

export default class Homefeed extends Component {
  renderListingLists() {
    let nearbyListings = homefeedExampleData.data.home_feed.nearby.objects;

    return (
      <div>
        <p className="top-seller-title strong-font-weight title-font-size">
          <FormattedMessage id="listings.nearby" />
        </p>
        <ListingList simpleListing={true} listings={nearbyListings} />
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderListingLists()}
      </div>
    );
  }
}
