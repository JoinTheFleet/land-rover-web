import React, { Component } from 'react'
import PropTypes from 'prop-types';
import RatingInput from '../miscellaneous/rating_input'
import { FormattedMessage } from 'react-intl'

import likeIcon from '../../assets/images/like.png';
import likedIcon from '../../assets/images/liked.png';

export default class ListingItem extends Component {

  renderItem(){
    let item = this.props.listing;
    let image;

    let vehicleMake = item.variant.make.name;
    let vehicleModel = item.variant.model.name;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    let wishListed = item.wish_lists.length > 0;

    if(item.gallery.length > 0) {
      image = <img src={item.gallery[0].images.original_url} alt={vehicleTitle}></img>;
    }

    return (
      <div>
        <div className="listing-item-photo-and-title">
          { image }
          <div className="listing-item-title fs-16px">
            <span className="subtitle-font-weight">{ vehicleTitle }</span>
            <span className="listing-item-year">{ item.variant.year.year }</span>
          </div>
          <div className="listing-item-liked">
            <img src={ wishListed ? likedIcon : likeIcon } alt="liked_icon" />
          </div>
        </div>
        <div className="listing-item-info">
          <div>
            { '€' + (item.price / 100) + ' per day' }
          </div>
          <RatingInput rating={4} inputNameSufix={item.id.toString()} readonly={true} />
          <FormattedMessage id="listings.total_reviews" values={ {total_reviews: item.total_reviews} } />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className="listing-item col-xs-12 col-sm-6 col-lg-4"> { this.renderItem() } </div>
    )
  }
}

ListingItem.propTypes = {
  listing: PropTypes.object
}
