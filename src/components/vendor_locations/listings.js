import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Loading from '../miscellaneous/loading';
import RatingInput from '../miscellaneous/rating_input';
import Avatar from 'react-avatar';

import VendorLocationListingsService from '../../shared/services/vendor_locations/vendor_location_listings_service';
import LocalizationService from '../../shared/libraries/localization_service';

import UserListingList from '../user_listings/user_listing_list';

const LIMIT = 10;

export default class Listings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewSummary: this.props.vendorLocation ? this.props.vendorLocation.owner_review_summary : undefined,
      metadata: undefined,
      loading: false,
      initialLoad: true,
      page: 0,
      pages: 1,
      count: 1,
      listings: []
    };

    this.loadData = this.loadData.bind(this);
    this.loadListings = this.loadListings.bind(this);
    this.storeResponse = this.storeResponse.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  loadListings() {
    VendorLocationListingsService.index(this.props.vendorLocation.vendor.id, this.props.vendorLocation.id, {
      offset: this.state.page * LIMIT,
      limit: LIMIT
    })
    .then(this.storeResponse);
  }

  storeResponse(response) {
    if (response && response.data.data) {
      let data = response.data.data;

      this.setState({
        listings: data.listings,
        initialLoad: false,
        pages: Math.ceil(data.count / LIMIT),
        count: data.count,
        loading: false
      });
    }
  }

  loadData() {
    let location = this.props.location;

    this.setState({
      loading: true
    }, () => {
      if (location) {
        let state = location.state;

        if (state && state.listings && this.state.initialLoad ) {
          this.setState({
            listings: state.listings,
            count: state.count || 1,
            initialLoad: false
          });
        }

        this.loadListings();
      }
    });
  }

  handlePageChange(page) {
    this.setState({
      page: page - 1
    }, this.loadData);
  }

  componentWillMount() {
    this.loadData();
  }

  render() {
    if (this.state.initialLoad) {
      return <Loading />;
    }
    else {
      let listings = '';

      if (this.state.listings.length > 0) {
        listings = (
          <div className='col-xs-12 no-side-padding user-reviews'>
            <UserListingList listings={ this.state.listings } page={ this.state.page + 1 } pages={ this.state.pages } handlePageChange={ this.handlePageChange } initialLoad={ this.state.initialLoad } count={ this.state.count }/>
          </div>
        )
      }

      return (
        <div className='user-profile'>
          <div className='col-xs-12'>
            <div className='col-xs-12 no-side-padding user-header'>
              <Link to={ `/vendor_locations/${this.props.vendorLocation.id}` }>
                <Avatar src={ this.props.vendorLocation.images.large_url } size={ 200 } className='col-xs-12 col-sm-4 user-avatar no-side-padding' round />
              </Link>
              <div className='col-xs-12 col-sm-8 rating-information'>
                <div className='col-xs-12 user-name'>
                  <Link to={ `/vendor_locations/${this.props.vendorLocation.id}` }>
                    { this.props.vendorLocation.name }
                  </Link>
                </div>
                <div className='col-xs-12 user-rating'>
                  <RatingInput disabled={ true } length={ 5 } rating={ this.state.reviewSummary.rating } readonly>
                    <span className='pull-left rating-text'>{ this.state.reviewSummary.total_reviews } { LocalizationService.formatMessage('reviews.reviews') }</span>
                  </RatingInput>
                </div>
              </div>
            </div>
            { listings }
            <div className='col-xs-12 user-listings'>
            </div>
          </div>
        </div>
      );
    }
  }
}
