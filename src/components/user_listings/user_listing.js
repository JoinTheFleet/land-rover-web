import React, { Component } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import RatingInput from '../miscellaneous/rating_input';
import LocalizationService from '../../shared/libraries/localization_service';

export default class UserListing extends Component {
  render() {
    let listing = this.props.listing;
    let variant = listing.variant;
    let imageSrc = process.env.REACT_APP_MISSING_LISTING_IMAGE;

    let rating = '';

    if (listing.total_reviews > 0) {
      rating = (
        <div className='col-xs-12 no-side-padding'>
          <RatingInput disabled={ true } length={ 5 } rating={ listing.rating } readonly>
            <span className='pull-left rating-text'>{ listing.total_reviews } { LocalizationService.formatMessage('reviews.reviews') }</span>
          </RatingInput>
        </div>
      )
    }

    if (listing.gallery && listing.gallery.length > 0) {
      imageSrc = listing.gallery[0].images.original_url;
    }

    return (
      <div className='col-xs-12 no-side-padding user-listing'>
        <Link to={{
          pathname: `/listings/${listing.id}`,
          state: {
            listing: listing
          }
        }} >
          <div className='row'>
            <div className='col-xs-12'>
              <Avatar src={ imageSrc } size={ 100 } className='col-xs-12 col-sm-4 user-avatar no-side-padding' />
              <div className='col-xs-12 listing-container'>
                <div className='col-xs-12 col-sm-10 no-side-padding'>
                  <div className='col-xs-12 no-side-padding'>
                    <span className='strong-font-weight header'>
                      { variant.make.display }, { variant.model.name }
                    </span>
                    <span className='header'>
                      { variant.year.year }
                    </span>
                  </div>
                  <div className='col-xs-12 no-side-padding address'>
                    <span>{ `${listing.country_configuration.country.currency_symbol} ${ (listing.price / 100).toFixed(2) } ${ LocalizationService.formatMessage('listings.per_day') }` }</span>
                  </div>
                  { rating }
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}
