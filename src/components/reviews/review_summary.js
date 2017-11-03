import React, { Component } from 'react';

import Loading from '../miscellaneous/loading';
import RatingInput from '../miscellaneous/rating_input';
import { Link } from 'react-router-dom';

import UserReviewsService from '../../shared/services/users/user_reviews_service';
import RenterReviewsService from '../../shared/services/renter_reviews_service';
import Review from './review';

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
    UserReviewsService.index(this.props.user.id, {
      limit: LIMIT
    })
    .then(this.storeResponse)
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

    if (location && location.state && location.state.view && location.state.view === 'owner') {
      this.loadRenterReviews();
    }
    else {
      this.loadOwnerReviews();
    }
  }

  render() {
    return (
      <div>
        <div className='col-xs-12 no-side-padding review-title'>
          <span className='main-text-color title'>
            { LocalizationService.formatMessage('reviews.reviews') }
          </span>
          <span className='tertiary-text-color count'>
            ({ this.state.reviews.length })
          </span>
          <span>
            <Link to={{
                    pathname: `/users/${this.props.user.id}/reviews`,
                    state: {
                      reviews: this.state.reviews,
                      metadata: this.state.metadata
                    }
                  }}
                  className='secondary-text-color link pull-right'>
              { LocalizationService.formatMessage('application.see_all') }
            </Link>
          </span>
        </div>
        <div className='col-xs-12 review-summary' >
          <div className='row'>
            {
              this.state.reviews.map((review) => {
                return (
                  <Review review={review} />
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
