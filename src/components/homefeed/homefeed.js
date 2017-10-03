import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import ListingList from '../listings/listing_list';
import ListingMap from '../listings/listing_map';

import Helpers from '../miscellaneous/helpers';

import homefeedExampleData from '../../homefeed_example.json';
import listingsExampleData from '../../listings_example.json';

export default class Homefeed extends Component {
  renderListingLists() {
    let nearbyListings = homefeedExampleData.data.home_feed.nearby.objects;
    let collections = homefeedExampleData.data.home_feed.collections;

    return (
      <div>
        <div>
          <p className="top-seller-title strong-font-weight title-font-size">
            <FormattedMessage id="listings.nearby" />
          </p>

          <ListingList simpleListing={true} listings={nearbyListings} />
        </div>

        {
          collections.map((collection) => {
            return (
              <div key={collection.id + '_' + collection.name + '_listing'}>
                <p className="top-seller-title strong-font-weight title-font-size">
                  <span>{collection.name}</span>
                </p>

                <ListingList simpleListing={true} listings={collection.objects} />
              </div>
            );
          })
        }
      </div>
    )
  }

  renderListingMap() {
    let listings = listingsExampleData.data.listings;

    return (
      <ListingMap containerElement={(<div style={{ height: Helpers.pageHeight() + 'px' }}></div>)}
                  mapElement={ <div style={{ height: `100%` }}></div> }
                  listings={listings} />
    )
  }

  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        <div className="col-lg-7 no-side-padding">
          {this.renderListingLists()}
        </div>
        <div className="col-lg-5 no-side-padding">
          {this.renderListingMap()}
        </div>
      </div>
    );
  }
}
