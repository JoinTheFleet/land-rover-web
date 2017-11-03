import React, { Component } from 'react';

import Loading from '../miscellaneous/loading';
import RatingInput from '../miscellaneous/rating_input';
import Avatar from 'react-avatar';

import UserListingsService from '../../shared/services/users/user_listings_service';
import UserReviewsService from '../../shared/services/users/user_reviews_service';
import RenterReviewsService from '../../shared/services/renter_reviews_service';

import ReviewSummary from '../reviews/review_summary';
import ReviewList from '../reviews/review_list';

const LIMIT = 10;

export default class UserReviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      metadata: undefined,
      loading: false,
      initialLoad: true,
      page: 0,
      pages: 1,
      reviews: []
    }

    this.loadOwnerReviews = this.loadOwnerReviews.bind(this);
    this.loadRenterReviews = this.loadRenterReviews.bind(this);
    this.storeResponse = this.storeResponse.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  loadOwnerReviews() {
    UserReviewsService.index(this.props.user.id, {
      offset: this.state.page * LIMIT,
      limit: LIMIT
    })
    .then(this.storeResponse)
  }

  loadRenterReviews() {
    RenterReviewsService.index(this.props.user.id, {
      offset: this.state.page * LIMIT,
      limit: LIMIT
    })
    .then(this.storeResponse)
  }

  storeResponse(response) {
    if (response && response.data.data) {
      let data = response.data.data;

      this.setState({
        reviews: data.reviews,
        metadata: data.metadata,
        initialLoad: false,
        pages: Math.ceil(data.metadata.total_reviews / LIMIT),
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

        if (state && state.metadata) {
          this.setState({ metadata: state.metadata });
        }

        if (state && state.reviews) {
          this.setState({
            reviews: state.reviews,
            initialLoad: false
          });
        }

        if (state && state.view && state.view === 'owner') {
          this.loadRenterReviews();
        }
        else {
          this.loadOwnerReviews();
        }
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

  renderRatings() {
    let location = this.props.location;

    if (this.state.metadata) {
      let metadata = this.state.metadata;
      let averageRatings = metadata.average_ratings;
      return (
        <div>
          <div className='col-xs-12 text-center visible-xs'>
            <RatingInput disabled={ true } length={ 5 } rating={ this.state.metadata.rating } readonly className='reviews-rating' />
          </div>
          {
            averageRatings.map((rating) => {
              return (
                <div className='col-xs-12 user-option-rating hidden-xs'>
                  <RatingInput disabled={ true } length={ 5 } rating={ rating.rating } readonly>
                    <span className='pull-left rating-text'>{ rating.option.description }</span>
                  </RatingInput>
                </div>
              )
            })
          }
        </div>
      )
    }
    else {
      return '';
    }
  }

  render() {
    let reviews = '';

    if (this.state.reviews.length > 0) {
      reviews = (
        <div className='col-xs-12 no-side-padding user-reviews'>
          <ReviewList reviews={ this.state.reviews } page={ this.state.page + 1 } pages={ this.state.pages } handlePageChange={ this.handlePageChange } initialLoad={ this.state.initialLoad }/>
        </div>
      )
    }
    return (
      <div className='user-profile'>
        <div className='col-xs-12'>
          <div className='col-xs-12 no-side-padding user-header'>
            <Avatar src={ this.props.user.images.large_url } size={ '200px' } className='col-xs-12 col-sm-4 user-avatar no-side-padding' round />
            <div className='col-xs-12 col-sm-8 rating-information'>
              <div className='col-xs-12 user-name'>
                { this.props.user.name }
              </div>

              { this.renderRatings() }
            </div>
          </div>
          { reviews }
          <div className='col-xs-12 user-listings'>
          </div>
        </div>
      </div>
    );
  }
}
