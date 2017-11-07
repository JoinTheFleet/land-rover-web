import React, { Component } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

export default class WishList extends Component {
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
      <div className='col-xs-12 no-side-padding review'>
        <div className='row'>
          <div className='col-xs-12 no-side-padding'>
            <Link to={ `/dashboard/wish_lists/${wish_list.id}` } >
              <div className='col-xs-12 col-sm-2 col-lg-1 text-left'>
                <Avatar src={ imageSRC } />
              </div>
              <div className='col-xs-12 col-sm-10 col-lg-11'>
                <span className='strong-font-weight reviewer-name col-xs-12 text-left'>
                  { wish_list.name }
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
