import React, { Component } from 'react';

import RatingInput from '../miscellaneous/rating_input';
import Avatar from 'react-avatar';

import LocalizationService from '../../shared/libraries/localization_service';

import ReviewSummary from '../reviews/review_summary';
import ListingsSummary from '../listings/listings_summary';

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewSummary: this.props.user ? this.props.user.owner_review_summary : {}
    };
  }

  componentDidMount() {
    let location = this.props.location;

    if (location && location.state && location.state.view && location.state.view === 'owner') {
      this.setState({
        reviewSummary: this.props.user.renter_review_summary
      });
    }
  }

  render() {
    let reviews  = '';
    let listings = '';

    if (!this.props.user) {
      return (<div></div>);
    }

    if (this.state.reviewSummary.total_reviews > 0) {
      reviews = (
        <div className='col-xs-12 no-side-padding user-reviews'>
          <ReviewSummary {...this.props} />
        </div>
      )
    }

    if (this.props.user.listing_count > 0) {
      listings = (
        <div className='col-xs-12 no-side-padding user-listings'>
          <ListingsSummary {...this.props} />
        </div>
      )
    }

    return (
      <div className='user-profile'>
        <div className='col-xs-12'>
          <div className='col-xs-12 no-side-padding user-header'>
            <Avatar src={ this.props.user.images.large_url } size={ 200 } className='col-xs-12 col-sm-4 user-avatar no-side-padding' round />

            <div className='col-xs-12 col-sm-8 rating-information'>
              <div className='col-xs-12 user-name'>
                { this.props.user.first_name }
              </div>

              <div className='col-xs-12 user-rating'>
                <RatingInput disabled={ true } length={ 5 } rating={ this.state.reviewSummary.rating } readonly>
                  <span className='pull-left rating-text'>{ this.state.reviewSummary.total_reviews || 0 } { LocalizationService.formatMessage('reviews.reviews') }</span>
                </RatingInput>
              </div>
            </div>
          </div>

          { reviews }
          { listings }
        </div>
      </div>
    );
  }
}
