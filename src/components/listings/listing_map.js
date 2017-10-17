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
import GeolocationService from '../../shared/services/geolocation_service';

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height + 10),
});

class ListingMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markerSelected: '',
      latitude: 0,
      longitude: 0
    };

    this.toggleMarker = this.toggleMarker.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onPositionChange = this.onPositionChange.bind(this);
  }

  componentWillMount() {
    GeolocationService.getCurrentPosition()
                      .then(position => {
                        this.setState({
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude
                        });
                      });
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
    let center = this.map.getCenter();

    this.setState({
      latitude: center.lat(),
      longitude: center.lng()
    });

    this.props.onDragEnd(this.map.getBounds(), this.map.getCenter());
  }

  onPositionChange() {
    let center = this.map.getCenter();

    this.setState({
      latitude: center.lat(),
      longitude: center.lng()
    });

    this.props.onPositionChange(this.map.getBounds(), this.map.getCenter());
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
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;

    return (
      <GoogleMap defaultZoom={10}
                 center={ { lat: latitude, lng: longitude } }
                 className="listingsMap"
                 onDragEnd={ this.onDragEnd }
                 onZoomChange={ this.onPositionChange }
                 onTilesLoaded={ this.onPositionChange }
                 ref={ (map) => { this.map = map } }>
        {
          listings.map((listing, index) => {
            return this.renderMarker(listing, index);
          })
        }
      </GoogleMap>
    )
  }
}

export default withScriptjs(withGoogleMap(ListingMap));
