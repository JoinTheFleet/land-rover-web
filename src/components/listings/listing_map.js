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
    this.onDragEnd = this.onDragEnd.bind(this);
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

    if (!listing.location && !listing.geometry) {
      return '';
    }
    else {
      let coordinates = this.listingLocation(listing);
      let marker = (
        <Marker key={ 'listing_map_item_' + (index + 1) }
                position={ { lat: coordinates.latitude, lng: coordinates.longitude } }
                onClick={ () => { this.toggleMarker(markerKey) } }>
          { infoWindow }
        </Marker>
      )

      return marker;
    }
  }

  onDragEnd() {
    this.props.onDragEnd(this.map.getBounds(), this.map.getCenter());
  }

  listingLocation(listing) {
    let latitude = 0;
    let longitude = 0;
    if (listing.location) {
      latitude = listing.location.latitude;
      longitude = listing.location.longitude;
    }
    else if (listing.geometry && listing.geometry.bounds) {
      let northeast = listing.geometry.bounds.northeast;
      let southwest = listing.geometry.bounds.southwest;

      latitude = (northeast.latitude + southwest.latitude) / 2;
      longitude = (northeast.longitude + southwest.longitude) / 2;
    }
    else if (!listing.location && this.map) {
      let center = this.map.getCenter();

      latitude = center.lat();
      longitude = center.lng();
    }

    return {
      latitude: latitude,
      longitude: longitude
    };
  }

  render() {
    let listings = this.props.listings;
    let elementToReturn;

    if (listings.length === 0) {
      elementToReturn = (<div></div>);
    }
    else {
      let averageCoordinates = Geolocation.getCoordinatesCenter(listings.map((listing) => {
        let coordinates = this.listingLocation(listing);

        return [coordinates.latitude, coordinates.longitude];
      }));

      elementToReturn = (
        <GoogleMap defaultZoom={10}
                   defaultCenter={ { lat: averageCoordinates.latitude, lng: averageCoordinates.longitude } }
                   className="listingsMap"
                   onDragEnd={ this.onDragEnd }
                   ref={ (map) => { this.map = map } }>
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
