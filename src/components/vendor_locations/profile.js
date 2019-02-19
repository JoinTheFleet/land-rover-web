import React, { Component } from 'react';

import Avatar from 'react-avatar';
import LocalizationService from '../../shared/libraries/localization_service';

import ReviewSummary from '../reviews/review_summary';
import ListingsSummary from '../listings/listings_summary';
import RatingInput from '../miscellaneous/rating_input';

export default class Profile extends Component {
  render() {
    if (this.props.vendorLocation) {
      let reviews  = '';
      let listings = '';
      let vendorLocation = this.props.vendorLocation;
      let reviewSummary = vendorLocation.owner_review_summary;

      if (reviewSummary && reviewSummary.total_reviews > 0) {
        reviews = (
          <div className='col-xs-12 no-side-padding user-reviews'>
            <ReviewSummary {...this.props} />
          </div>
        )
      }

      if (vendorLocation.listing_count > 0) {
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
              <Avatar src={ vendorLocation.images.large_url } size={ 200 } className='col-xs-12 col-sm-4 user-avatar no-side-padding' round />

              <div className='col-xs-12 col-sm-8 rating-information'>
                <div className='col-xs-12 user-name'>
                  { vendorLocation.name }
                </div>

                <div className='col-xs-12 user-rating'>
                  <RatingInput disabled={ true } length={ 5 } rating={ reviewSummary.rating } readonly>
                    <span className='pull-left rating-text'>{ reviewSummary.total_reviews || 0 } { LocalizationService.formatMessage('reviews.reviews') }</span>
                  </RatingInput>
                </div>
              </div>
            </div>
            <div className='col-xs-12 no-side-padding user-listings-title'>
              <span className='main-text-color title'>
                { LocalizationService.formatMessage('users.description') }
              </span>
              <div className='col-xs-12 no-side-padding user-description'>
                { vendorLocation.description }
              </div>
            </div>
            { reviews }
            { listings }
          </div>
        </div>
      );
    }
    else {
      return <div />;
    }
  }
}
