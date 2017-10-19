import React, {
  Component
} from 'react';

import {
  injectIntl,
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';

// Fleet Components
import ListingList from '../listings/listing_list';
import ListingMap from '../listings/listing_map';
import ListingsFiltersTopBar from '../listings/filters/listings_filters_top_bar';

// Services / Miscellaneous
import HomeFeedService from '../../shared/services/home_feed_service';
import ListingsService from '../../shared/services/listings/listings_service';
import SearchService from '../../shared/services/search_service';
import Helpers from '../../miscellaneous/helpers';

// Icons
import mapToggleIcon from '../../assets/images/map_toggle.png';
import listToggleIcon from '../../assets/images/list_toggle.png';

import Pageable from '../miscellaneous/pageable';

const MINIMUM_WIDTH_TO_SHOW_ALL = 1200;

class Homefeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggledComponent: '',
      nearby: [],
      collections: [],
      listings: [], // Added temporarily to show listings on map until HomeFeed endpoint returns locations
      hasBeenScrolled: false,
      currentSearch: false,
      sort: 'distance'
    };

    this.toggleComponent = this.toggleComponent.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
    this.handleMapDrag = this.handleMapDrag.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.handleSortToggle = this.handleSortToggle.bind(this);

    let component = this;

    window.addEventListener('resize', () => {
      if (Helpers.windowWidth() >= MINIMUM_WIDTH_TO_SHOW_ALL && component.state.toggledComponent !== '') {
        component.setState({ toggledComponent: '' });
      }
    });
  }

  componentWillMount() {
    HomeFeedService.show()
                   .then((response) => {
                     this.setState({
                       nearby: response.data.data.home_feed.nearby,
                       collections: response.data.data.home_feed.collections
                    }, () => {
                      // Added temporarily to show listings on map until HomeFeed endpoint returns locations
                      ListingsService.index()
                      .then((response) => {
                        this.setState({
                          listings: [],
                        });
                      })
                      .catch((error) => {
                        alert(error); // TODO: Some sort of nice flash service.
                      });
                    });
                   })
                   .catch((error) => {
                     alert(error); // TODO: Some sort of nice flash service.
                   });
  }

  toggleComponent(component) {
    this.setState({ toggledComponent: component });
  }

  handlePageChange() {

  }

  renderListingLists() {
    let nearbyListings = this.state.nearby;
    let collections = this.state.collections;

    if ((this.state.hasBeenScrolled || this.state.currentSearch) && this.state.listings && this.state.listings.length > 0) {
      return (
        <div>
          <div>
            <Pageable totalPages={ 60 }
                      currentPage={ 1 }
                      handlePageChange={ this.handlePageChange }>
              <ListingList scrollable={false} listings={this.state.listings} />
            </Pageable>
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div>
            <p className="top-seller-title strong-font-weight title-font-size">
              <FormattedMessage id="listings.nearby" />
            </p>

            <ListingList scrollable={true} simpleListing={true} listings={nearbyListings} />
          </div>

          {
            collections.map((collection) => {
              return (
                <div key={collection.id + '_' + collection.name + '_listing'}>
                  <p className="top-seller-title strong-font-weight title-font-size">
                    <span>{collection.name}</span>
                  </p>

                  <ListingList scrollable={true} simpleListing={true} listings={collection.objects} />
                </div>
              );
            })
          }
        </div>
      )
    }
  }

  handlePositionChange(bounds, center) {
    let location = {
      latitude: center.lat,
      longitude: center.lng
    }

    let boundingBox = {
      left: bounds.sw.lng,
      right: bounds.ne.lng,
      bottom: bounds.sw.lat,
      top: bounds.ne.lat
    }

    this.setState({
      location: location,
      boundingBox: boundingBox,
      currentSearch: false
    }, this.handleSearch);
  }

  handleFilterToggle(filters) {
    this.setState({
      filters: filters,
      currentSearch: true
    }, this.handleSearch);
  }

  handleSortToggle(eventKey, event) {
    this.setState({
      sort: eventKey
    }, this.handleSearch)
  }

  handleSearch() {
    let searchParams = {
      sort: this.state.sort
    };
    let location = this.state.location;
    let boundingBox = this.state.boundingBox;
    let filters = this.state.filters;

    if (location) {
      searchParams.location = location;
    }

    if (boundingBox) {
      searchParams.bounding_box = boundingBox;
      searchParams.force_bounding_box = true;
    }

    if (filters) {
      Object.keys(filters).forEach(filter => {
        if (filters[filter]) {
          searchParams[filter] = filters[filter];
        }
      });
    }

    SearchService.create({
      search: searchParams
    }).then((response) => {
      this.setState({
        listings: response.data.data.listings,
      });
    })
  }

  handleMapDrag(bounds, center) {
    this.setState({
      hasBeenScrolled: true
    });
    this.handlePositionChange(bounds, center);
  }

  renderListingMap() {
    let googleMapUrl = this.props.intl.formatMessage({
      id: 'google.maps.javascript_api_link',
    }, {
      key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    return (
      <ListingMap googleMapURL={ googleMapUrl }
                  loadingElement={ <div style={{ height: `100%` }} /> }
                  containerElement={ (<div style={{ height: (Helpers.windowHeight() - 130) + 'px' }}></div>) }
                  mapElement={ <div style={{ height: '100%' }}></div> }
                  onDragEnd={ this.handleMapDrag }
                  onPositionChange={ this.handlePositionChange }
                  listings={ this.state.listings } />
    )
  }

  renderListingsToDisplay() {
    let listingsDivsToDisplay = [];
    let largeWidth = Helpers.windowWidth() >= MINIMUM_WIDTH_TO_SHOW_ALL;

    let listingsListDiv = (
      <div key="listings_list_div" className="homefeed-listings-list col-lg-7 no-side-padding" style={{ height: (Helpers.windowHeight() - 130) + 'px' }}>
        { this.renderListingLists() }
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
          <ListingsFiltersTopBar selectedSort={ this.state.sort } handleSortToggle={ this.handleSortToggle } handleFilterToggle={ this.handleFilterToggle } />
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
  searchParams: PropTypes.object.isRequired,
  setCurrentSearchParams: PropTypes.func.isRequired
}

export default injectIntl(Homefeed);
