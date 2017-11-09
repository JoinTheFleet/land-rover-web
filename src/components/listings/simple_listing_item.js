import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import RatingInput from '../miscellaneous/rating_input';

import likeIcon from '../../assets/images/like.png';
import likedIcon from '../../assets/images/liked.png';
import noImagesPlaceholder from '../../assets/images/placeholder-no-images.png';

export default class SimpleListingItem extends Component {
  constructor(props) {
    super(props);

    this.toggleWishListModal = this.toggleWishListModal.bind(this);
  }

  toggleWishListModal(event) {
    if (event) {
      event.preventDefault();
    }

    this.props.toggleWishListModal(this.props.listing);
  }

  renderItem() {
    let item = this.props.listing;
    let image = <img alt='' src={ `${process.env.REACT_APP_MISSING_LISTING_IMAGE}` } />;

    let vehicleMake = item.make;
    let vehicleModel = item.model;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    let wishListed = item.wish_lists ? (item.wish_lists.length > 0) : false;
    let hasImages = item.gallery ? (item.gallery.length > 0) : false;

    if (hasImages) {
      image = (<img src={ item.gallery[0].images.original_url }
                    alt={ vehicleTitle }
                    ref={img => this.img = img}
                    onError={() => this.img.src = noImagesPlaceholder} />);
    }

    return (
      <div>
        <div className="listing-item-photo-and-title">
          <Link to={{
                  pathname: `/listings/${this.props.listing.id}`,
                  state: {
                    listing: this.props.listing
                  }
                }}>
            { image }
            <div className="listing-item-title fs-16">
              <span className="subtitle-font-weight">{ vehicleTitle }</span>
              <span className="listing-item-year">{ item.year }</span>
            </div>
            <div onClick={ this.toggleWishListModal } className="listing-item-liked">
              <img src={ wishListed ? likedIcon : likeIcon } alt="liked_icon" />
            </div>
            <div className="listing-item-info">
              <div>
                { item.currency_symbol + (item.price / 100) + ' per day' /* TODO: retrieve currency_symbol from API results when available */ }
              </div>
              <RatingInput rating={ item.rating } inputNameSufix={ item.id.toString() } readonly={true} />
              <FormattedMessage id="listings.total_reviews" values={ {total_reviews: item.total_reviews} } />
            </div>
          </Link>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={ 'listing-item col-xs-12 ' + (this.props.additionalClasses || '') }>
        { this.renderItem() }
      </div>
    )
  }
}

SimpleListingItem.propTypes = {
  listing: PropTypes.object,
  additionalClasses: PropTypes.string,
  handleListingSelect: PropTypes.func
}
