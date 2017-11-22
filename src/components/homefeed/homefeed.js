import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import Advertisement from '../advertisements/advertisement';

// Fleet Components
import ListingList from '../listings/listing_list';
import ListingMap from '../listings/listing_map';
import ListingsFiltersTopBar from '../listings/filters/listings_filters_top_bar';

// Services / Miscellaneous
import Pageable from '../miscellaneous/pageable';
import Loading from '../miscellaneous/loading';
import HomeFeedService from '../../shared/services/home_feed_service';
import Helpers from '../../miscellaneous/helpers';

// Icons
import mapToggleIcon from '../../assets/images/map_toggle.png';
import listToggleIcon from '../../assets/images/list_toggle.png';

import LocalizationService from '../../shared/libraries/localization_service';
import GeolocationService from '../../shared/services/geolocation_service';
import Placeholder from '../miscellaneous/placeholder';

const MINIMUM_WIDTH_TO_SHOW_ALL = 1200;

export default class Homefeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggledComponent: '',
      nearby: [],
      collections: [],
      loading: false
    };

    this.toggleComponent = this.toggleComponent.bind(this);

    let component = this;

    window.addEventListener('resize', () => {
      if (Helpers.windowWidth() < MINIMUM_WIDTH_TO_SHOW_ALL && component.state.toggledComponent === '') {
        component.setState({ toggledComponent: 'list' });
      }
      if (Helpers.windowWidth() >= MINIMUM_WIDTH_TO_SHOW_ALL && component.state.toggledComponent !== '') {
        component.setState({ toggledComponent: '' });
      }
    });

    this.addedWishListToListing = this.addedWishListToListing.bind(this);
    this.removedWishListFromListing = this.removedWishListFromListing.bind(this);
    this.removeWishListFromNearbyListing = this.removeWishListFromNearbyListing.bind(this);
    this.removeWishListFromCollectionListing = this.removeWishListFromCollectionListing.bind(this);
    this.fetchHomeFeed = this.fetchHomeFeed.bind(this);
  }

  componentDidMount() {
    if (this.props.accessToken) {
      this.setState({
        loading: true
      }, () => {
        GeolocationService.getCurrentPosition()
        .then(position => {
          this.fetchHomeFeed(position.coords.latitude, position.coords.longitude);
        })
        .catch(error => {
          this.fetchHomeFeed();
        })
      });
    }

    this.setupEvents();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.accessToken && !this.props.accessToken) {
      GeolocationService.getCurrentPosition()
      .then(position => {
        this.fetchHomeFeed(position.coords.latitude, position.coords.longitude);
      })
      .catch(error => {
        this.fetchHomeFeed();
      })
    }
  }

  fetchHomeFeed(latitude, longitude) {
    if (latitude && longitude) {
      HomeFeedService.index({
        latitude: latitude,
        longitude: longitude
      })
      .then((response) => {
        this.setState({
          nearby: response.data.data.home_feed.nearby,
          collections: response.data.data.home_feed.collections,
          loading: false
        });
      });
    }
    else {
      HomeFeedService.index()
      .then((response) => {
        this.setState({
          nearby: response.data.data.home_feed.nearby,
          collections: response.data.data.home_feed.collections,
          loading: false
        });
      });
    }
  }

  setupEvents() {
    this.props.eventEmitter.on('REMOVED_LISTING_WISHLIST', this.removedWishListFromListing);
    this.props.eventEmitter.on('ADDED_LISTING_WISHLIST', this.addedWishListToListing);
  }

  addedWishListToListing(options, error) {
    if (options && options.listingID && options.wishListID) {
      this.addWishListToNearbyListing(options);
      this.addWishListToCollectionListing(options);
    }
  }

  addWishListToNearbyListing(options) {
    let nearby = this.state.nearby;

    this.addWishListIDToListingArray(nearby.objects, options.listingID, options.wishListID);

    this.setState({ nearby: nearby });
  }

  addWishListToCollectionListing(options) {
    let collections = this.state.collections;

    collections.map(collection => {
      if (collection.objects && collection.objects.length > 0) {
        return this.addWishListIDToListingArray(collection.objects, options.listingID, options.wishListID);
      }
      else {
        return undefined;
      }
    });

    this.setState({ collections: collections });
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
      this.removeWishListFromNearbyListing(options);
      this.removeWishListFromCollectionListing(options);
    }
  }

  removeWishListFromNearbyListing(options) {
    let nearby = this.state.nearby;
    let objects = nearby.objects;

    this.removeWishListIDFromListingArray(objects, options.listingID, options.wishListID);

    this.setState({ nearby: nearby });
  }

  removeWishListFromCollectionListing(options) {
    let collections = this.state.collections;

    collections.map(collection => {
      if (collection.objects && collection.objects.length > 0) {
        return this.removeWishListIDFromListingArray(collection.objects, options.listingID, options.wishListID);
      }
      else {
        return undefined;
      }
    });

    this.setState({ collections: collections });
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

  toggleComponent(component) {
    this.setState({ toggledComponent: component });
  }

  renderListingLists() {
    let nearbyListings = this.state.nearby.objects;
    let collections = this.state.collections;

    if ((this.props.customSearch || this.props.currentSearch || (this.state.collections.length === 0 && this.state.nearby.length === 0)) && this.props.listings && this.props.listings.length > 0) {
      return (
        <div>
          <div>
            <Pageable totalPages={ this.props.pages }
                      currentPage={ this.props.page }
                      handlePageChange={ this.props.handlePageChange }>
              <ListingList toggleWishListModal={ this.props.toggleWishListModal } scrollable={ false } listings={ this.props.listings } />
            </Pageable>
          </div>
        </div>
      )
    }
    else {
      if ((collections.length === 0 || collections.every((collection) => { return collection.object_type === 'Advertisement' })) && (!nearbyListings || nearbyListings.length === 0)) {
        return <Placeholder contentType='vehicles_renter' />;
      }
      else {
        return (
          <div>
            <div>
              <p className="top-seller-title strong-font-weight title-font-size">
                <FormattedMessage id="listings.nearby" />
              </p>
  
              <ListingList toggleWishListModal={ this.props.toggleWishListModal } scrollable={true} simpleListing={true} listings={nearbyListings} />
            </div>
  
            {
              collections.map((collection) => {
                let body = '';
                if (collection.object_type === 'Listing') {
                  body = <ListingList toggleWishListModal={ this.props.toggleWishListModal } scrollable={true} simpleListing={true} listings={collection.objects} />;
                }
                else if (collection.object_type === 'Advertisement') {
                  body = <Advertisement advertisement={ collection.objects[0] } accessToken={ this.props.accessToken } />;
                }
  
                return (
                  <div key={collection.id + '_' + collection.name + '_listing'}>
                    <p className="top-seller-title strong-font-weight title-font-size">
                      <span>{collection.name}</span>
                    </p>
                    { body }
                  </div>
                )
              })
            }
          </div>
        )
      }
    }
  }

  renderListingMap() {
    let googleMapUrl = LocalizationService.formatMessage('google.maps.javascript_api_link', { key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY });

    return (
      <ListingMap googleMapURL={ googleMapUrl }
                  loadingElement={ <div style={{ height: `100%` }} /> }
                  containerElement={ (<div style={{ height: (Helpers.windowHeight() - 130) + 'px' }}></div>) }
                  mapElement={ <div style={{ height: '100%' }}></div> }
                  onDragEnd={ this.props.handleMapDrag }
                  onPositionChange={ this.props.handlePositionChange }
                  listings={ this.props.listings }
                  location={ this.props.location }
                  boundingBox={ this.props.boundingBox }
                  toggleWishListModal={ this.props.toggleWishListModal } />
    )
  }

  renderListingsToDisplay() {
    let listingsDivsToDisplay = [];
    let largeWidth = Helpers.windowWidth() >= MINIMUM_WIDTH_TO_SHOW_ALL;
    let loadingDiv = '';
    const isLoading = this.state.loading || this.props.loading;

    if ( isLoading ) {
      loadingDiv = (<Loading fullWidthLoading={ true } />)
    }

    let listingsListDiv = (
      <div key="listings_list_div" className={ `homefeed-listings-list col-lg-7 no-side-padding ${ isLoading ? 'loading-listings' : ''}` } style={{ height: (Helpers.windowHeight() - 130) + 'px' }}>
        { this.renderListingLists() }

        { loadingDiv }
      </div>
    );

    let listingsMapDiv = (
      <div key="listings_map_div" className="homefeed-listings-map col-lg-5 no-side-padding listings-map">
        { this.renderListingMap() }
      </div>
    );

    if (largeWidth || this.state.toggledComponent !== 'map') {
      listingsDivsToDisplay.push(listingsListDiv);
    }

    if (largeWidth || this.state.toggledComponent === 'map') {
      listingsDivsToDisplay.push(listingsMapDiv);
    }

    return (
      <div className="col-xs-12 no-side-padding">
        {
          listingsDivsToDisplay.map((listingDiv) => { return listingDiv })
        }
      </div>
    );
  }

  render() {
    let nextComponent = this.state.toggledComponent === 'map' ? 'list' : 'map';
    let currentIcon = this.state.toggledComponent === 'map' ? listToggleIcon : mapToggleIcon;

    return (
      <div className="col-xs-12 no-side-padding">
        <div className="col-xs-12 no-side-padding">
          <ListingsFiltersTopBar selectedSort={ this.props.sort } handleSortToggle={ this.props.handleSortToggle } handleFilterToggle={ this.props.handleFilterToggle } />
        </div>

        { this.renderListingsToDisplay() }

        <div className="toggle-map-div hidden-lg">
          <img src={currentIcon} alt="toggle_map_icon" onClick={ () => { this.toggleComponent(nextComponent) } } />
        </div>
      </div>
    );
  }
}

Homefeed.propTypes = {
  handleSortToggle: PropTypes.func.isRequired,
  handleFilterToggle: PropTypes.func.isRequired,
  handleMapDrag: PropTypes.func.isRequired,
  handlePositionChange: PropTypes.func.isRequired,
  listings: PropTypes.array.isRequired,
  sort: PropTypes.string.isRequired,
  currentSearch: PropTypes.bool.isRequired,
  customSearch: PropTypes.bool.isRequired
}
