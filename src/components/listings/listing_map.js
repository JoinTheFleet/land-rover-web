import React, {
  Component
} from 'react';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  OverlayView
} from 'react-google-maps';

import ListingItem from '../listings/listing_item';
import Geolocation from '../../miscellaneous/geolocation';

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height + 10),
});

class ListingMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markerSelected: ''
    };

    this.toggleMarker = this.toggleMarker.bind(this);
  }

  toggleMarker(markerKey) {
    if (this.state.markerSelected === markerKey) {
      this.setState({
        markerSelected: ''
      });
    }
    else {
      this.setState({
        markerSelected: markerKey
      });
    }
  }

  renderMarker(listing, index) {
    let markerKey = 'listing_map_item_' + (index + 1);
    let infoWindow = '';

    if (this.state.markerSelected === markerKey) {
      infoWindow = (
        <OverlayView position={{ lat: listing.location.latitude, lng: listing.location.longitude }}
                     mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                     getPixelPositionOffset={getPixelPositionOffset}>
          <div className="listings-map-listing-details-div">
            <ListingItem additionalClasses="no-side-padding" listing={listing} />
          </div>
        </OverlayView>
      )
    }

    let marker = (
      <Marker key={'listing_map_item_' + (index + 1)}
              position={{ lat: listing.location.latitude, lng: listing.location.longitude }}
              onClick={() => { this.toggleMarker(markerKey) } }>
        { infoWindow }
      </Marker>
    )

    return marker;
  }

  render() {
    let listings = this.props.listings;
    let elementToReturn;

    if (listings.length === 0) {
      elementToReturn = (<div></div>);
    }
    else {
      let averageCoordinates = Geolocation.getCoordinatesCenter(listings.map((listing) => {
        return [ listing.location.latitude, listing.location.longitude ];
      }));

      elementToReturn = (
        <GoogleMap defaultZoom={10}
                   defaultCenter={{ lat: averageCoordinates.latitude, lng: averageCoordinates.longitude }}
                   className="listingsMap"
                   ref={(map) => { this.map = map } }>
          {
            listings.map((listing, index) => {
              return this.renderMarker(listing, index);
            })
          }
        </GoogleMap>
      )
    }

    return elementToReturn;
  }
}

export default withScriptjs(withGoogleMap(ListingMap));
