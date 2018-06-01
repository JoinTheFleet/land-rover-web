import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import UserReviewsService from '../../shared/services/users/user_reviews_service';
import RenterReviewsService from '../../shared/services/renter_reviews_service';
import VendorLocationReviewsService from '../../shared/services/vendor_locations/vendor_location_reviews_service';
import Review from './review';

import Placeholder from '../miscellaneous/placeholder';

import LocalizationService from '../../shared/libraries/localization_service';

const LIMIT = 5;

export default class ReviewSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: [],
      metadata: undefined
    }

    this.loadOwnerReviews = this.loadOwnerReviews.bind(this);
    this.loadRenterReviews = this.loadRenterReviews.bind(this);
    this.storeResponse = this.storeResponse.bind(this);
  }

  loadOwnerReviews() {
    let vendorLocation = this.props.vendorLocation;
    let user = this.props.user

    if (vendorLocation) {
      VendorLocationReviewsService.index(vendorLocation.vendor.id, vendorLocation.id, {
        limit: LIMIT
      })
      .then(this.storeResponse)
    }
    else if (user) {
      UserReviewsService.index(user.id, {
        limit: LIMIT
      })
      .then(this.storeResponse)
    }
  }

  loadRenterReviews() {
    RenterReviewsService.index(this.props.user.id, {
      limit: LIMIT
    })
    .then(this.storeResponse)
  }

  storeResponse(response) {
    if (response && response.data.data) {
      let data = response.data.data;

      this.setState({
        metadata: data.metadata,
        reviews: data.reviews
      });
    }
  }

  componentWillMount() {
    let location = this.props.location;

    if (location && location.state && location.state.view && location.state.view === 'owner' || this.props.owner) {
      this.loadRenterReviews();
    }
    else {
      this.loadOwnerReviews();
    }
  }

  render() {
    let reviews = (<Placeholder contentType='reviews' />)

    if (this.state.reviews.length > 0) {
      reviews = (
        <div className='row'>
          {
            this.state.reviews.map((review) => {
              return (
                <Review review={review} />
              )
            })
          }
        </div>
      )
    }

    let link = '';
    let vendorLocation = undefined;

    if (this.props.vendorLocation) {
      link = `/vendor_locations/${this.props.vendorLocation.id}/reviews`;
      vendorLocation = this.props.vendorLocation;
    }
    else if (this.props.user) {
      link = `/users/${this.props.user.id}/reviews`;
    }

    let count = this.state.reviews.length;

    if (this.state.metadata) {
      count = this.state.metadata.total_reviews;
    }

    return (
      <div>
        <div className='col-xs-12 no-side-padding review-title'>
          <span className='main-text-color title'>
            { LocalizationService.formatMessage('reviews.reviews') }
          </span>
          <span className='tertiary-text-color count'>
            ({ count })
          </span>
          <span>
            <Link to={{
                    pathname: link,
                    state: {
                      reviews: this.state.reviews,
                      metadata: this.state.metadata,
                      vendorLocation: vendorLocation
                    }
                  }}
                  className='secondary-text-color link pull-right'>
              { LocalizationService.formatMessage('application.see_all') }
            </Link>
          </span>
        </div>
        <div className='col-xs-12 review-summary' >
          { reviews }
        </div>
      </div>
    );
  }
}
