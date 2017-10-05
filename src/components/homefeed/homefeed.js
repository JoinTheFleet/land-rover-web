import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import ListingList from '../listings/listing_list';
import ListingMap from '../listings/listing_map';
import FiltersTopBar from '../listings/filters_top_bar';
import HomeFeedService from '../../shared/services/home_feed_service';

import Helpers from '../../miscellaneous/helpers';

import mapToggleIcon from '../../assets/images/map_toggle.png';
import listToggleIcon from '../../assets/images/list_toggle.png';
import listingsExampleData from '../../listings_example.json';

const MINIMUM_WIDTH_TO_SHOW_ALL = 1200;

export default class Homefeed extends Component {
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
      if(Helpers.windowWidth() >= MINIMUM_WIDTH_TO_SHOW_ALL && component.state.toggledComponent !== ''){
        component.setState({ toggledComponent: '' });
      }
    });
  }

  componentWillMount(){
    HomeFeedService.show()
                   .then((response) => {
                     this.setState({
                       nearby: response.data.data.home_feed.nearby,
                       collections: response.data.data.home_feed.collections
                    });
                   })
                   .catch((error) => {
                     alert(error); // TODO: Some sort of nice flash service.
                   });
  }

  toggleComponent(component) {
    this.setState({ toggledComponent: component });
  }

  renderListingLists() {
    let nearbyListings = this.state.nearby;
    let collections = this.state.collections;

    return (
      <div>
        <div>
          <p className="top-seller-title strong-font-weight title-font-size">
            <FormattedMessage id="listings.nearby" />
          </p>

          <ListingList simpleListing={true} listings={nearbyListings} />
        </div>

        {
          collections.map((collection) => {
            return (
              <div key={collection.id + '_' + collection.name + '_listing'}>
                <p className="top-seller-title strong-font-weight title-font-size">
                  <span>{collection.name}</span>
                </p>

                <ListingList simpleListing={true} listings={collection.objects} />
              </div>
            );
          })
        }
      </div>
    )
  }

  renderListingMap() {
    let listings = listingsExampleData.data.listings;

    return (
      <ListingMap containerElement={(<div style={{ height: (Helpers.windowHeight() - 130) + 'px' }}></div>)}
                  mapElement={ <div style={{ height: '100%' }}></div> }
                  listings={listings} />
    )
  }

  renderListingsToDisplay() {
    let listingsDivsToDisplay = [];
    let largeWidth = Helpers.windowWidth() >= MINIMUM_WIDTH_TO_SHOW_ALL;

    let listingsListDiv = (
      <div key="listings_list_div" className="homefeed-listings-list col-lg-7 no-side-padding" style={{ height: (Helpers.windowHeight() - 130) + 'px' }}>
        {this.renderListingLists()}
      </div>
    );

    let listingsMapDiv = (
      <div key="listings_map_div" className="homefeed-listings-map col-lg-5 no-side-padding listings-map">
        {this.renderListingMap()}
      </div>
    );

    if(largeWidth || this.state.toggledComponent !== 'map') {
      listingsDivsToDisplay.push(listingsListDiv);
    }

    if(largeWidth || this.state.toggledComponent === 'map') {
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
          <FiltersTopBar />
        </div>

        { this.renderListingsToDisplay() }

        <div className="toggle-map-div hidden-lg">
          <img src={currentIcon} alt="toggle_map_icon" onClick={ () => { this.toggleComponent(nextComponent) } } />
        </div>
      </div>
    );
  }
}
