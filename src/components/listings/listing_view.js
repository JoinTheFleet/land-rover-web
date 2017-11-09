import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import Avatar from 'react-avatar';
import moment from 'moment';

import Map from '../miscellaneous/map';
import Button from '../miscellaneous/button';
import Loading from '../miscellaneous/loading';
import RatingInput from '../miscellaneous/rating_input';
import ImageGallery from '../miscellaneous/image_gallery';
import ConfirmationModal from '../miscellaneous/confirmation_modal';

import BookNowTile from '../bookings/book_now_tile';

import Errors from '../../miscellaneous/errors';
import Constants from '../../miscellaneous/constants';
import Geolocation from '../../miscellaneous/geolocation';
import ListingsHelper from '../../miscellaneous/listings_helper';

// Icons
import specDoorsIcon from '../../assets/images/spec-doors.png';
import specPassengersIcon from '../../assets/images/spec-passengers.png';
import specTransmissionIcon from '../../assets/images/spec-transmission.png';

import ListingsService from '../../shared/services/listings/listings_service';
import ListingPreviewService from '../../shared/services/listings/listing_preview_service';
import LocalizationService from '../../shared/libraries/localization_service';

import noImagesPlaceholder from '../../assets/images/placeholder-no-images.png';

const listingsViews = Constants.listingsViews();
const userRoles = Constants.userRoles();

class ListingView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: undefined,
      loading: false,
      redirectTo: undefined,
      openModals: {
        deleteListing: false
      }
    };

    this.addError = this.addError.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.fetchListing = this.fetchListing.bind(this);
    this.handleDeleteListing = this.handleDeleteListing.bind(this);
    this.handleBookButtonClick = this.handleBookButtonClick.bind(this);
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
  }

  componentDidMount() {
    let location = this.props.location;

    if (location && location.state && location.state.listing) {
      if (this.props.preview) {
        let listingParams = ListingsHelper.extractListingParamsForSubmission(location.state.listing);

        this.setState({ loading: true }, () => {
          ListingPreviewService.create({ listing: listingParams })
                               .then(response => {
                                 this.setState({ listing: response.data.data.listing, loading: false });
                               })
                               .catch(error => this.addError(Errors.extractErrorMessage(error)));
        });
      }
      else if (!location.state.listing.variant) {
        this.fetchListing(location.state.listing.id);
      }
      else {
        this.setState({ listing: location.state.listing });
      }
    }
    else {
      this.fetchListing(this.props.match.params.id);
    }
  }

  fetchListing(id) {
    this.setState({ loading: true }, () => {
      ListingsService.show(id)
                      .then(response => {
                        this.setState({ listing: response.data.data.listing, loading: false });
                      })
                      .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  addError(error) {
    this.setState({ loading: false }, () => { Alert.error(error) });
  }

  toggleModal(modalName) {
    let openModals = this.state.openModals;
    openModals[modalName] = !openModals[modalName];

    this.setState({ openModals: openModals });
  }

  handleDeleteListing() {
    if (!this.state.listing) {
      return;
    }

    this.setState({
      loading: true
    }, () => {
      ListingsService.destroy(this.state.listing.id)
                     .then(response => {
                       this.setState({ 
                         loading: false,
                         redirectTo: {
                           pathname: '/listings',
                           state: { listingDeleted: true } 
                         }
                       });
                     })
                     .catch((error) => {
                       this.setState({ loading: false }, () => { Alert.error(Errors.extractErrorMessage(error)); });
                     });
    });
  }

  handleDeleteButtonClick(listing) {
    let openModals = this.state.openModals;
    openModals.deleteListing = true;

    this.setState({ selectedListing: listing, openModals: openModals });
  }

  handleBookButtonClick(quotation, pricingQuote) {
    this.props.handleChangeView(listingsViews.requestBooking, { currentQuotation: quotation, currentPricingQuote: pricingQuote });
  }

  renderListingOverview() {
    let listing = this.state.listing;

    let vehicleMake = listing.variant ? listing.variant.make.name : listing.make;
    let vehicleModel = listing.variant ? listing.variant.model.name : listing.model;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    return (
      <div className="listing-view-top-part col-xs-12 no-side-padding">
        <div className="listing-view-listing-title">
          <p className="fs-36">
            <span className="subtitle-font-weight">{ vehicleTitle }</span>
            <span className="listing-view-listing-year">{ listing.variant ? listing.variant.year.year : listing.year }</span>
          </p>
          <div className="fs-18">
            <FormattedMessage id="listings.price_per_day"
                              values={ {
                                currency_symbol: listing.country_configuration ? listing.country_configuration.country.currency_symbol : listing.currency_symbol,
                                price: listing.price / 100
                              } } />

            <br/>
            <div className="listing-view-rating-reviews">
              <RatingInput rating={ listing.rating } inputNameSufix={ listing.id ? listing.id.toString() : '' } readonly={true} />
              <FormattedMessage id="listings.total_reviews" values={ {total_reviews: listing.total_reviews} } />
            </div>
          </div>
        </div>

        <div className="listing-view-user-details text-center pull-right">
          <Link to={{
            pathname: `/users/${listing.user.id}`,
            state: {
              user: listing.user
            }
          }} >
            <img src={ listing.user.images.original_url } alt="listing_user_avatar" />
            <span className="secondary-text-color fs-18">{ listing.user.first_name + ' ' + listing.user.last_name }</span>
          </Link>
        </div>
      </div>
    )
  }

  renderSpecs() {
    let listing = this.state.listing;

    if (!listing.variant) {
      return '';
    }

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
    let listing = this.state.listing;

    if (!listing.amenities) {
      return '';
    }

    return (
      <div className="listing-view-listing-amenities col-xs-12 no-side-padding">
        <div className="listing-view-listing-amenities-title fs-18 subtitle-font-weight pull-left">
          <FormattedMessage id="listings.amenities" />
        </div>

        <div className="listing-view-listing-amenities-list pull-left">
          {
            listing.amenities.sort((amenity_A, amenity_B) => amenity_A.name > amenity_B.name)
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
    let listing = this.state.listing;
    let location = Geolocation.getLocationFromListing(listing);

    if (!location) {
      return <div className="listing-view-map col-xs-12 no-side-padding"></div>;
    }

    let listingCircle = {
      position: {
        lat: location.latitude,
        lng: location.longitude
      },
      radius: location.radius,
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
             center={ { lat: location.latitude, lng: location.longitude } }
             zoom={ 13 }
             disableClick={ true }
             circles={ [ listingCircle ] } />
      </div>
    )
  }

  renderBookingTile() {
    let bookingDiv = '';

    if (this.props.currentUserRole === userRoles.renter) {
      bookingDiv = (
        <div className="listing-view-booking-div col-xs-12 no-side-padding">
          <BookNowTile listing={ this.state.listing } handleBookButtonClick={ this.handleBookButtonClick } />
        </div>
      );
    }

    return bookingDiv;
  }

  renderReviewsTile() {
    let reviewDiv = (
      <span className="tertiary-text-color text-secondary-font-weight fs-16">
        { LocalizationService.formatMessage('reviews.no_reviews') }
      </span>
    );

    if (this.state.listing && this.state.listing.total_reviews > 0) {
      let review = this.state.listing.review;

      reviewDiv = (
        <div className="col-xs-12 no-side-padding">
          <div className="listing-view-review-reviewer-image pull-left">
            <Avatar src={ review.reviewer.images ? review.reviewer.images.medium_url : noImagesPlaceholder }
                    size={ 65 }
                    round />
          </div>
          <div className="listing-view-review-details pull-left">
            <p>
              <span className="subtitle-font-weight fs-16"> { review.reviewer.name } </span>
              <br/>
              <span className="tertiary-text-color"> { moment.utc(moment.unix(review.created_at)).format('DD MMM YYYY') } </span>
            </p>
            <p> { review.feedback } </p>
            <div className="pull-right">
              <Link to={{
                pathname: `/listings/${this.state.listing.id}/reviews`,
                state: {
                  previousPage: `/listings/${this.state.listing.id}`
                }
              }}>
                <span className="secondary-text-color"> { LocalizationService.formatMessage('application.read_more') } </span>
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="listing-view-reviews col-xs-12 no-side-padding">
        <div className="listing-view-reviews-title fs-18 subtitle-font-weight col-xs-12 no-side-padding">
          <FormattedMessage id="reviews.reviews" />

          <div className="pull-right">
            <Link to={{
              pathname: `/listings/${this.state.listing.id}/reviews`,
              state: {
                previousPage: `/listings/${this.state.listing.id}`
              }
            }}>
              <span className="secondary-text-color"> { LocalizationService.formatMessage('application.read') } </span>
            </Link>
          </div>
        </div>

        <div className="listing-view-review-list col-xs-12 no-side-padding">
          { reviewDiv }
        </div>

      </div>
    )
  }

  renderButtons() {
    if (this.props.currentUserRole === userRoles.renter) {
      return '';
    }

    return (
      <div className="listing-view-buttons text-center col-xs-12 no-side-padding">
        { this.renderGoBackButton() }

        { this.renderDeleteButton() }
      </div>
    )
  }

  renderGoBackButton() {
    if (this.props.location && this.props.location.state && this.props.location.state.previousPage) {
      return (
        <Link to={ this.props.location.state.previousPage }>
          <Button className="tomato white-text">
            { LocalizationService.formatMessage('application.go_back') }
          </Button>
        </Link>
      )
    }
    else {
      return '';
    }
  }

  renderDeleteButton() {
    if (!this.state.listing.id || this.props.currentUserRole === userRoles.renter) {
      return '';
    }

    return (
      <Button className="listing-card-delete-button tomato white-text"
              onClick={ () => { this.handleDeleteButtonClick(this.props.listing) } }>
        { LocalizationService.formatMessage('listings.delete_listing') }
      </Button>
    )
  }

  render() {
    let listing = this.state.listing;

    if (this.state.redirectTo) {
      return (<Redirect to={ this.state.redirectTo } />)
    }

    if (this.state.loading) {
      return <Loading />;
    }
    else if (listing) {
      let images =  listing.gallery.map(galleryImage => galleryImage.images.original_url);

      if (this.props.preview && this.props.location && this.props.location.state && this.props.location.state.listing) {
        images = this.props.location.state.listing.images.map(image => image.url);
      }

      return (
        <div className="listing-view-div col-xs-12 no-side-padding">
          <div className="listing-view-image-gallery">
            <ImageGallery images={ images } />
          </div>

          <div className="listing-view-main-content col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
            { this.renderListingOverview() }

            { this.renderSpecs() }

            { this.renderAmenities() }

            { this.renderBookingTile() }

            { this.renderMap() }

            { this.renderReviewsTile() }

            { this.renderButtons() }

            <ConfirmationModal open={ this.state.openModals.deleteListing }
                              toggleModal={ this.toggleModal }
                              modalName="deleteListing"
                              confirmationAction={ this.handleDeleteListing }
                              title={ LocalizationService.formatMessage('listings.confirm_delete') }>
              <span className="tertiary-text-color text-secondary-font-weight fs-18">
                { LocalizationService.formatMessage('listings.confirm_delete_text') }
              </span>
            </ConfirmationModal>
          </div>
        </div>
      );
    }
    else {
      return <div></div>;
    }
  }
}

ListingView.propTypes = {
  listing: PropTypes.object,
  currentUserRole: PropTypes.string.isRequired,
  handleChangeView: PropTypes.func,
  preview: PropTypes.bool
};

export default injectIntl(ListingView);
