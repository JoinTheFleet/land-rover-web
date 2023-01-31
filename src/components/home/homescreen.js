import React, { Component } from 'react';

import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import ListingList from '../listings/listing_list';
import BlogList from './blog_list';
import FeaturesList from './features_list';
import FeaturedIn from '../information/featured_in';

// Images
import topBanner from '../../assets/images/homescreen_top_banner.jpg';
import axaLogo from '../../assets/images/axa-logo.png';

import TopSellersService from '../../shared/services/listings/top_sellers_service';
import NearbyListingsService from '../../shared/services/listings/nearby_listings_service';

import GeolocationService from '../../shared/services/geolocation_service';

import LocationPeriodFilter from '../listings/filters/location_period_filter';
import momentPropTypes from 'react-moment-proptypes';

import MediumService from '../../shared/services/medium_service';

import Errors from '../../miscellaneous/errors';

export default class Homescreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blog: {
        posts: [],
        authors: {}
      },
      topSellers: [],
      nearbyListings: [],
      topSellersLoading: false,
      nearbyListingsLoading: false,
      loadingPosts: false
    };

    this.setupEvents = this.setupEvents.bind(this);
    this.addedWishListToListing = this.addedWishListToListing.bind(this);
    this.addWishListIDToListingArray = this.addWishListIDToListingArray.bind(this);
    this.removedWishListFromListing = this.removedWishListFromListing.bind(this);
    this.removeWishListIDFromListing = this.removeWishListIDFromListing.bind(this);
    this.removeWishListIDFromListingArray = this.removeWishListIDFromListingArray.bind(this);

    this.setupEvents();
  }

  setupEvents() {
    this.props.eventEmitter.on('REMOVED_LISTING_WISHLIST', this.removedWishListFromListing);
    this.props.eventEmitter.on('ADDED_LISTING_WISHLIST', this.addedWishListToListing);
  }

  addedWishListToListing(options, error) {
    if (options && options.listingID && options.wishListID) {
      this.addWishListIDToListingArray(this.state.topSellers, options.listingID, options.wishListID)
      this.addWishListIDToListingArray(this.state.nearbyListings, options.listingID, options.wishListID)
    }
  }

  addWishListIDToListingArray(objects, listingID, wishListID) {
    let listing = objects.find((listing) => {
      return listing.id === listingID;
    });

    if (listing) {
      listing.wish_lists.push(wishListID);
    }
  }

  removedWishListFromListing(options, error) {
    if (options && options.listingID && options.wishListID) {
      this.removeWishListIDFromListingArray(this.state.topSellers, options.listingID, options.wishListID)
      this.removeWishListIDFromListingArray(this.state.nearbyListings, options.listingID, options.wishListID)
    }
  }

  removeWishListIDFromListingArray(objects, listingID, wishListID) {
    let listing = objects.find((listing) => {
      return listing.id === listingID;
    });

    if (listing) {
      this.removeWishListIDFromListing(listing, wishListID)
    }
  }

  removeWishListIDFromListing(listing, wishListID) {
    let wishListIndex = listing.wish_lists.findIndex((listingWishListID) => {
      return listingWishListID === wishListID;
    });

    if (wishListIndex >= 0) {
      listing.wish_lists.splice(wishListIndex, 1);
    }
  }

  componentDidMount() {
    this.setState({
      topSellersLoading: true,
      loadingPosts: true,
      nearbyListingsLoading: true
    }, () => {
      MediumService.show()
                   .then(response => {
                     this.setState({
                       blog: {
                         posts: response.data.data.posts.payload.posts,
                         authors: response.data.data.posts.payload.references.User
                       },
                       loadingPosts: false
                     });
                   })
                   .catch(error => { this.setState({ loadingPosts: false }, () => { Errors.extractErrorMessage(error); }); });

      TopSellersService.index()
                       .then(response => {
                         this.setState({
                           topSellers: response.data.data.listings,
                           topSellersLoading: false
                         });
                       });

      GeolocationService.getCurrentPosition()
                        .then(position => {
                          NearbyListingsService.index({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                          }).then(response => {
                            this.setState({
                              nearbyListings: response.data.data.listings,
                              nearbyListingsLoading: false
                            });
                          });
                        })
                        .catch((error) => {
                          NearbyListingsService.index()
                                                .then(response => {
                                                  this.setState({
                                                    nearbyListings: response.data.data.listings,
                                                    nearbyListingsLoading: false
                                                  });
                                                });
                        });
    });

    let referralCode = this.props.match.params.referral_code;

    if (referralCode) {
      this.props.handleReferral(referralCode);
    }
  }

  render() {
    let topSellers = (
      <div>
        <p className="top-seller-title strong-font-weight title-font-size">
          <FormattedMessage id="listings.top_seller" />
        </p>
        <ListingList toggleWishListModal={ this.props.toggleWishListModal } listings={ this.state.topSellers } scrollable={ true } loading={ this.state.topSellersLoading } />
      </div>
    );

    let nearbyListings = (
      <div>
        <p className="top-seller-title strong-font-weight title-font-size">
          <FormattedMessage id="listings.nearby" />
        </p>
        <ListingList toggleWishListModal={ this.props.toggleWishListModal } listings={ this.state.nearbyListings } scrollable={ true } loading={ this.state.nearbyListingsLoading } />
      </div>
    );

    if (!this.state.topSellersLoading && this.state.topSellers.length === 0) {
      topSellers = '';
    }

    if (!this.state.nearbyListingsLoading && this.state.nearbyListings.length === 0) {
      nearbyListings = '';
    }

    return (
      
      <div>
        <div id="homescreen_top_banner">
          <img src={topBanner} alt="homescreen_top_banner" id="homescreen_top_banner_bg" />
          <div id="homescreen_top_banner_content" className="white-text">
            <p>
              <span className="title-font-weight title-font-size ls-dot-five text-uppercase">
                <FormattedMessage id="homescreen.top_banner_title" />
              </span>
              <br/>
            </p>
            <LocationPeriodFilter {...this.props} homescreen={ true } shouldClearFilters={true} />
          </div>
          <div id="homescreen_top_banner_insurance_div" className="twilight-blue fs-20 ls-dot-five white-text text-uppercase">
            <FormattedMessage id="homescreen.insurance_partner" />
          </div>
        </div>

        <div id="homescreen_axa_banner" className="text-center">
          <img src={axaLogo} alt="homescreen_axa_banner" />
          <div className="axa-text">
            In order to qualify as a renter you must be 25 years of age or older and hold a fully valid Irish, UK or Eu driving license
          </div>
        </div>

        { topSellers }
        { nearbyListings }

        <FeaturesList />
        <BlogList posts={ this.state.blog.posts } authors={ this.state.blog.authors } loading={ this.state.loadingPosts } />

        <FeaturedIn />
      </div>
    )
  }
}

Homescreen.propTypes = {
  accessToken: PropTypes.string,
  handleLocationChange: PropTypes.func.isRequired,
  handleLocationFocus: PropTypes.func.isRequired,
  handleDatesChange: PropTypes.func.isRequired,
  handleLocationSelect: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj,
  locationName: PropTypes.string,
  searchLocations: PropTypes.array,
  showSearchButton: PropTypes.bool
}
