import React, { Component } from 'react';

import UserListing from '../user_listings/user_listing';
import { Link } from 'react-router-dom';
import Placeholder from '../miscellaneous/placeholder';

import UserListingsService from '../../shared/services/users/user_listings_service';
import VendorLocationListingsService from '../../shared/services/vendor_locations/vendor_location_listings_service';
import LocalizationService from '../../shared/libraries/localization_service';

const LIMIT = 5;

export default class ListingsSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      listings: []
    }

    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    this.setState({
      loading: true
    }, () => {
      if (this.props.vendorLocation) {
        VendorLocationListingsService.index(this.props.vendorLocation.vendor.id, this.props.vendorLocation.id, {
          limit: LIMIT
        })
        .then(response => {
          this.setState({
            loading: false,
            listings: response.data.data.listings
          });
        })
      }
      else if (this.props.user) {
        UserListingsService.index(this.props.user.id, {
          limit: LIMIT
        })
        .then(response => {
          this.setState({
            loading: false,
            listings: response.data.data.listings
          });
        })
      }
    });
  }

  componentWillMount() {
    this.loadData();
  }

  render() {
    let listings = (<Placeholder contentType="vehicles_guest" />)

    if (this.state.listings.length > 0) {
      listings = (
        <div className='row'>
          {
            this.state.listings.map((listing) => {
              return (
                <UserListing listing={listing} />
              )
            })
          }
        </div>
      )
    }

    let count = 0;
    let link = '';

    if (this.props.vendorLocation) {
      link = `/vendor_locations/${this.props.vendorLocation.id}/listings`;
      count = this.props.vendorLocation.listing_count;
    }
    else if (this.props.user) {
      link = `/vendor_locations/${this.props.user.id}/listings`;
      count = this.props.user.listing_count;
    }

    return (
      <div>
        <div className='col-xs-12 no-side-padding user-listings-title'>
          <span className='main-text-color title'>
            { LocalizationService.formatMessage('listings.listings') }
          </span>
          <span className='tertiary-text-color count'>
            ({ count })
          </span>
          <span>
            <Link to={{
                    pathname: link,
                    state: {
                      listings: this.state.listings
                    }
                  }}
                  className='secondary-text-color link pull-right'>
              { LocalizationService.formatMessage('application.see_all') }
            </Link>
          </span>
        </div>
        <div className='col-xs-12' >
          { listings }
        </div>
      </div>
    );
  }
}
