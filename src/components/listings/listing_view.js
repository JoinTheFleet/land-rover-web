import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import ImageGallery from '../miscellaneous/image_gallery';
import RatingInput from '../miscellaneous/rating_input';

import specDoorsIcon from '../../assets/images/spec-doors.png';
import specPassengersIcon from '../../assets/images/spec-passengers.png';
import specTransmissionIcon from '../../assets/images/spec-transmission.png';

class ListingView extends Component {
  render() {
    let listing = this.props.listing;

    let vehicleMake = listing.variant.make.name;
    let vehicleModel = listing.variant.model.name;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    return (
      <div className="listing-view-div col-xs-12 no-side-padding">
        <div className="listing-view-image-gallery">
          <ImageGallery images={ listing.gallery.map(galleryImage => galleryImage.images.original_url) } />
        </div>
        <div className="listing-view-main-content col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          <div className="listing-view-top-part col-xs-12 no-side-padding">
            <div className="listing-view-listing-title">
              <p className="fs-36">
                <span className="subtitle-font-weight">{ vehicleTitle }</span>
                <span className="listing-view-listing-year">{ listing.variant.year.year }</span>
              </p>
              <p className="fs-18">
                <FormattedMessage id="listings.price_per_day"
                                  values={ {
                                    currency_symbol: listing.country_configuration.country.currency_symbol,
                                    price: listing.price / 100
                                  } } />

                <br/>
                <div className="listing-view-rating-reviews">
                  <RatingInput rating={ listing.rating } inputNameSufix={ listing.id.toString() } readonly={true} />
                  <FormattedMessage id="listings.total_reviews" values={ {total_reviews: listing.total_reviews} } />
                </div>
              </p>
            </div>

            <div className="listing-view-user-details text-center pull-right">
              <img src={ listing.user.images.original_url } alt="listing_user_avatar" />
              <span className="secondary-text-color fs-18">{ listing.user.first_name + ' ' + listing.user.last_name }</span>
            </div>
          </div>

          <div className="listing-view-listing-specs col-xs-12 no-side-padding">
            <div className="listing-view-listing-spec">
              <img src={ specPassengersIcon } alt="listing_passengers_icon" />
              <FormattedMessage id="listings.seat_count">
                {
                  (text) => {
                    return (<span> { listing.variant.seat_count.seats + ' ' + text } </span>)
                  }
                }
              </FormattedMessage>
            </div>

            <div className="listing-view-listing-spec">
              <img src={ specDoorsIcon } alt="listing_doors_icon" />
              <FormattedMessage id="listings.door_count">
                {
                  (text) => {
                    return (<span> { listing.variant.door_count.doors + ' ' + text } </span>)
                  }
                }
              </FormattedMessage>
            </div>

            <div className="listing-view-listing-spec">
              <img src={ specTransmissionIcon } alt="listing_transmission_icon" />
              <span> { listing.variant.transmission.transmission + ' (' + listing.variant.transmission.gears + ')' } </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListingView.propTypes = {
  listing: PropTypes.object
};

export default ListingView;
