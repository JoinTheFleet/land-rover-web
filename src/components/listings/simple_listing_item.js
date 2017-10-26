import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';
import RatingInput from '../miscellaneous/rating_input';

import likeIcon from '../../assets/images/like.png';
import likedIcon from '../../assets/images/liked.png';

import ListingsService from '../../shared/services/listings/listings_service';

export default class SimpleListingItem extends Component {

  constructor(props) {
    super(props);

    this.handleListingSelect = this.handleListingSelect.bind(this);
  }

  handleListingSelect() {
    ListingsService.show(this.props.listing.id)
                   .then(response => {
                     this.props.handleListingSelect(response.data.data.listing);
                   })
                   .catch(error => {
                     // TODO: add error handling (alert or something)
                   });
  }

  renderItem() {
    let item = this.props.listing;
    let image;

    let vehicleMake = item.make;
    let vehicleModel = item.model;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    let wishListed = item.wish_lists ? (item.wish_lists.length > 0) : false;
    let hasImages = item.gallery ? (item.gallery.length > 0) : false;

    if (hasImages) {
      image = (<img src={ item.gallery[0].images.original_url } alt={ vehicleTitle }></img>);
    }

    return (
      <div>
        <div className="listing-item-photo-and-title">
          { image }
          <div className="listing-item-title fs-16">
            <span className="subtitle-font-weight">{ vehicleTitle }</span>
            <span className="listing-item-year">{ item.year }</span>
          </div>
          <div className="listing-item-liked">
            <img src={ wishListed ? likedIcon : likeIcon } alt="liked_icon" />
          </div>
        </div>
        <div className="listing-item-info">
          <div>
            { item.currency_symbol + (item.price / 100) + ' per day' /* TODO: retrieve currency_symbol from API results when available */ }
          </div>
          <RatingInput rating={ item.rating } inputNameSufix={ item.id.toString() } readonly={true} />
          <FormattedMessage id="listings.total_reviews" values={ {total_reviews: item.total_reviews} } />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={ 'listing-item col-xs-12 ' + (this.props.additionalClasses || '') }
           onClick={ () => this.handleListingSelect() }>
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
