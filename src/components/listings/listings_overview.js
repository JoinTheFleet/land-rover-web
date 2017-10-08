import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import ListingCard from './listing_card';

import ListingsService from '../../shared/services/listings_service';

export default class ListingsOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedListingId: '',
      listings: []
    };
  }

  componentWillMount() {
    ListingsService.index()
                   .then((response) => {
                     this.setState({ listings: response.data.data.listings });
                   })
                   .catch((error) => {
                     alert(error); // TODO: Some sort of nice flash service.
                   });
  }

  render() {
    return (
      <div className="listings-overview-div col-xs-12 no-side-padding">

        <div className="listings-overview-top-bar smoke-grey col-xs-12">
          <div className="pull-right">
            <button className="btn secondary-color white-text">
              <FormattedMessage id="listings.add_new_listing" />
            </button>
          </div>
        </div>

        <div className="listings-overview-list col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          {
            this.state.listings.map((listing) => ( <ListingCard key={'listing_' + listing.id} listing={ listing } /> ))
          }
        </div>
      </div>
    )
  }
}
