import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, injectIntl } from 'react-intl';

import ImageGallery from '../miscellaneous/image_gallery';
import RatingInput from '../miscellaneous/rating_input';
import Loading from '../miscellaneous/loading';
import Map from '../miscellaneous/map';

import BookNowTile from '../bookings/book_now_tile';

import Constants from '../../miscellaneous/constants';

// Icons
import specDoorsIcon from '../../assets/images/spec-doors.png';
import specPassengersIcon from '../../assets/images/spec-passengers.png';
import specTransmissionIcon from '../../assets/images/spec-transmission.png';

const listingsViews = Constants.listingsViews();

class ListingView extends Component {

  constructor(props) {
    super(props);

    this.handleBookButtonClick = this.handleBookButtonClick.bind(this);
  }

  handleBookButtonClick(pricingQuote) {
    this.props.handleChangeView(listingsViews.requestBooking, { currentPricingQuote: pricingQuote });
  }

  renderListingOverview() {
    let listing = this.props.listing;

    let vehicleMake = listing.variant.make.name;
    let vehicleModel = listing.variant.model.name;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    return (
      <div className="listing-view-top-part col-xs-12 no-side-padding">
        <div className="listing-view-listing-title">
          <p className="fs-36">
            <span className="subtitle-font-weight">{ vehicleTitle }</span>
            <span className="listing-view-listing-year">{ listing.variant.year.year }</span>
          </p>
          <div className="fs-18">
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
          </div>
        </div>

        <div className="listing-view-user-details text-center pull-right">
          <img src={ listing.user.images.original_url } alt="listing_user_avatar" />
          <span className="secondary-text-color fs-18">{ listing.user.first_name + ' ' + listing.user.last_name }</span>
        </div>
      </div>
    )
  }

  renderSpecs() {
    let listing = this.props.listing;

    return (
      <div className="listing-view-listing-specs col-xs-12 no-side-padding">
        <div className="listing-view-listing-spec">
          <img src={ specPassengersIcon } alt="listing_passengers_icon" />
          <FormattedMessage id="listings.seat_count">
            {
              (text) => {
                return (<span className="fs-18"> { listing.variant.seat_count.seats + ' ' + text } </span>)
              }
            }
          </FormattedMessage>
        </div>

        <div className="listing-view-listing-spec">
          <img src={ specDoorsIcon } alt="listing_doors_icon" />
          <FormattedMessage id="listings.door_count">
            {
              (text) => {
                return (<span className="fs-18"> { listing.variant.door_count.doors + ' ' + text } </span>)
              }
            }
          </FormattedMessage>
        </div>

        <div className="listing-view-listing-spec">
          <img src={ specTransmissionIcon } alt="listing_transmission_icon" />
          <span className="fs-18 text-capitalize"> { listing.variant.transmission.transmission + ' (' + listing.variant.transmission.gears + ')' } </span>
        </div>
      </div>
    )
  }

  renderAmenities() {
    return (
      <div className="listing-view-listing-amenities col-xs-12 no-side-padding">
        <div className="listing-view-listing-amenities-title fs-18 subtitle-font-weight pull-left">
          <FormattedMessage id="listings.amenities" />
        </div>

        <div className="listing-view-listing-amenities-list pull-left">
          {
            this.props.listing.amenities.sort((amenity_A, amenity_B) => amenity_A.name > amenity_B.name)
                                        .map(amenity => {
              return (
                <div key={ 'listing_amenity_' + amenity.id } className="listing-view-listing-amenity col-xs-12 col-sm-4 no-side-padding">
                  <img src={ amenity.images.small_url } alt={ amenity.name } />
                  <span className="fs-18"> { amenity.name } </span>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  renderMap() {
    let listing = this.props.listing;
    let listingCircle = {
      position: {
        lat: listing.location.latitude,
        lng: listing.location.longitude
      },
      radius: listing.location.radius,
      options: {
        strokeColor: '#23a9f6',
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: '#23a9f6',
        fillOpacity: 0.35
      }
    }
    let googleMapUrl = this.props.intl.formatMessage({ id: 'google.maps.javascript_api_link' }, { key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY });

    return (
      <div className="listing-view-map col-xs-12 no-side-padding">
        <Map googleMapURL={ googleMapUrl }
             loadingElement={ <div style={{ height: `100%` }} ><Loading /></div> }
             containerElement={ (<div style={{ height: '275px' }}></div>) }
             mapElement={ <div style={{ height: '100%' }}></div> }
             options={ { disableDefaultUI: true, draggable: false, disableDoubleClickZoom: true } }
             center={ { lat: listing.location.latitude, lng: listing.location.longitude } }
             zoom={ 13 }
             disableClick={ true }
             circles={ [ listingCircle ] } />
      </div>
    )
  }

  renderBookingTile() {
    let bookingDiv = '';

    if (this.props.enableBooking) {
      bookingDiv = (
        <div className="listing-view-booking-div">
          <BookNowTile listing={ this.props.listing } handleBookButtonClick={ this.handleBookButtonClick } />
        </div>
      );
    }

    return bookingDiv;
  }

  render() {
    let listing = this.props.listing;

    return (
      <div className="listing-view-div col-xs-12 no-side-padding">
        <div className="listing-view-image-gallery">
          <ImageGallery images={ listing.gallery.map(galleryImage => galleryImage.images.original_url) } />
        </div>

        <div className="listing-view-main-content col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          { this.renderListingOverview() }

          { this.renderSpecs() }

          { this.renderAmenities() }

          { this.renderBookingTile() }

          { this.renderMap() }
        </div>
      </div>
    );
  }
}

ListingView.propTypes = {
  listing: PropTypes.object,
  enableBooking: PropTypes.bool,
  handleChangeView: PropTypes.func
};

export default injectIntl(ListingView);
