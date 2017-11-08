import React, { Component } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import LocalizationService from '../../shared/libraries/localization_service';

export default class WishListCard extends Component {
  render() {
    let wish_list = this.props.wish_list;
    let imageSRC = `${process.env.REACT_APP_MISSING_LISTING_IMAGE}`;

    if (wish_list.listings && wish_list.listings.length > 0) {
      let listing = wish_list.listings[0];

      if (listing && listing.gallery && listing.gallery.length > 0) {
        imageSRC = listing.gallery[0].images.original_url
      }
    }

    return (
      <div className='col-xs-12 no-side-padding wishlist-card'>
        <Link to={{
          pathname: `/dashboard/wish_lists/${wish_list.id}`,
          state: {
            wish_list: wish_list
          }
        }} >
          <div className='row'>
            <div className='col-xs-12'>
              <Avatar src={ imageSRC } size={ '100px' } className='col-xs-12 col-sm-4 user-avatar no-side-padding' />
              <div className='col-xs-12 wishlist-container' >
                <span className='strong-font-weight wishlist-name no-side-padding col-xs-12 text-left'>
                  { wish_list.name }
                </span>
                <span className='col-xs-12 no-side-padding'>
                  { LocalizationService.formatMessage('wish_lists.listings', { listings: wish_list.listings_count }) }
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}
