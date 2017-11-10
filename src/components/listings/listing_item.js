import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import RatingInput from '../miscellaneous/rating_input';

import likeIcon from '../../assets/images/like.png';
import likedIcon from '../../assets/images/liked.png';

import LocalizationService from '../../shared/libraries/localization_service';

export default class ListingItem extends Component {
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
    let spotlightDiv = '';

    let vehicleMake = item.variant.make.name;
    let vehicleModel = item.variant.model.name;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;
    let hasImages = item.gallery ? (item.gallery.length > 0) : false;
    let wishListed = item.wish_lists.length > 0;

    if (hasImages) {
      image = (<img src={ item.gallery[0].images.original_url }
                    alt={ vehicleTitle }
                    ref={img => this.img = img}
                    onError={() => this.img.src =  process.env.REACT_APP_MISSING_LISTING_IMAGE} />);
    }

    console.log(item.current_spotlight);
    if (item.current_spotlight && item.current_spotlight.spotlighted) {
      spotlightDiv = (
        <div className="listing-item-spotlighted text-secondary-font-weight ls-dot-two white-text">
          { LocalizationService.formatMessage('listings.spotlighted') }
        </div>
      )
    }

    return (
      <div className="col-xs-12 no-side-padding white">
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
              <span className="listing-item-year">{ item.variant.year.year }</span>
            </div>
            <div onClick={ this.toggleWishListModal } className="listing-item-liked">
              <img src={ wishListed ? likedIcon : likeIcon } alt="liked_icon" />
            </div>
            <div className="listing-item-info">
              <div>
                { item.country_configuration.country.currency_symbol + (item.price / 100) + ' per day' }
              </div>
              <RatingInput rating={ item.rating } inputNameSufix={ item.id.toString() } readonly={true} />
              <FormattedMessage id="listings.total_reviews" values={ {total_reviews: item.total_reviews} } />
            </div>
          </Link>

          { spotlightDiv }
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

ListingItem.propTypes = {
  listing: PropTypes.object
}
