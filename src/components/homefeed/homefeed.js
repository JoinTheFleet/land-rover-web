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
      collections: []
    };

    this.toggleComponent = this.toggleComponent.bind(this);

    let component = this;

    window.addEventListener('resize', () => {
      if (Helpers.windowWidth() >= MINIMUM_WIDTH_TO_SHOW_ALL && component.state.toggledComponent !== '') {
        component.setState({ toggledComponent: '' });
      }
    });
  }

  componentWillMount() {
    if (this.props.accessToken) {
      HomeFeedService.show()
                     .then((response) => {
                       this.setState({
                         nearby: response.data.data.home_feed.nearby,
                         collections: response.data.data.home_feed.collections
                       });
                     });
    }
  }

  toggleComponent(component) {
    this.setState({ toggledComponent: component });
  }

  handlePageChange() {

  }

  renderListingLists() {
    let nearbyListings = this.state.nearby;
    let collections = this.state.collections;

    if ((this.props.customSearch || this.props.currentSearch || (this.state.collections.length === 0 && this.state.nearby.length === 0))  && this.props.listings && this.props.listings.length > 0) {
      return (
        <div>
          <div>
            <Pageable totalPages={ 60 }
                      currentPage={ 1 }
                      handlePageChange={ this.handlePageChange }>
              <ListingList scrollable={false} listings={this.props.listings} />
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

            <ListingList scrollable={true} simpleListing={true} listings={nearbyListings} changeCurrentView={ this.props.changeCurrentView } />
          </div>

          {
            collections.map((collection) => {
              return (
                <div key={collection.id + '_' + collection.name + '_listing'}>
                  <p className="top-seller-title strong-font-weight title-font-size">
                    <span>{collection.name}</span>
                  </p>

                  <ListingList scrollable={true} simpleListing={true} listings={collection.objects} changeCurrentView={ this.props.changeCurrentView } />
                </div>
              );
            })
          }
        </div>
      )
    }
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
                  onDragEnd={ this.props.handleMapDrag }
                  onPositionChange={ this.props.handlePositionChange }
                  listings={ this.props.listings }
                  location={ this.props.location }
                  boundingBox={ this.props.boundingBox } />
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
  customSearch: PropTypes.bool.isRequired,
  changeCurrentView: PropTypes.func
}

export default injectIntl(Homefeed);
