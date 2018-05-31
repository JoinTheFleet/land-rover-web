import React, { Component } from 'react';

import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';

import ListingItem from '../listings/listing_item';

import Helpers from '../../miscellaneous/helpers';
import closest from 'closest';

class ListingMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markerSelected: ''
    };

    this.selectMarker = this.selectMarker.bind(this);
    this.onPositionChange = this.onPositionChange.bind(this);
    this.mapDragged = this.mapDragged.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  selectMarker(id) {
    this.setState({markerSelected: `listing_${id}`});
  }

  mapDragged() {
    this.setState({mapDragged: true})
  }

  renderMarker(listing, index) {
    let markerKey = `listing_${listing.id}`;
    let coordinates = this.listingLocation(listing);
    let selected = false;

    if (this.state.markerSelected === markerKey) {
      selected = true;
    }

    if (!listing.location && !listing.geometry) {
      return '';
    }
    else {
      let marker = '';
      let className = 'listing_map_price';

      if (selected) {
        marker = (
          <div lat={coordinates.latitude}
               lng={coordinates.longitude}
               key={`listing_${listing.id}`}
               id={`listing_${listing.id}_map_pin`}
               className={`${className} expanded`}>
                <ListingItem toggleWishListModal={ this.props.toggleWishListModal } additionalClasses='no-side-padding' listing={listing} />
          </div>
        )
      }
      else {
        marker = (
          <div lat={coordinates.latitude}
               lng={coordinates.longitude}
               key={`listing_${listing.id}`}
               id={`listing_${listing.id}_map_pin`}
               onClick={(event) => {this.selectMarker(listing.id)}}
               className={className}>
                <span>
                  {listing.country_configuration.country.currency_symbol}{Math.round(listing.price / 100)}
                </span>
          </div>
        );
      }

      return marker;
    }
  }

  onClick(event) {
    if (this.state.markerSelected && closest(event.event.target, '.expanded')) {
      return;
    }

    this.setState({markerSelected: undefined})
  }

  onPositionChange(options) {
    let center = options.center;

    this.setState({
      latitude: options.center.lat,
      longitude: options.center.lng
    });

    if (this.state.mapDragged) {
      this.props.onDragEnd(options.bounds, center);
    }
    else {
      this.props.onPositionChange(options.bounds, center);
    }
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

  componentDidUpdate(props, state) {
    if (this.map) {
      let center = { lat: this.props.location.latitude, lng: this.props.location.longitude};
      let boundingBox = this.props.boundingBox;
      let bounds = undefined;
      let zoom = this.map ? this.map.props.zoom : 10;
      let mapCenter = this.map.props.center;

      if ((!this.state.center || props.boundingBox !== this.props.boundingBox || props.location !== this.props.location) || (mapCenter && mapCenter.lat !== center.lat && mapCenter.lng !== center.lng)) {
        if (boundingBox) {
          bounds = {
            nw: {
              lat: boundingBox.top,
              lng: boundingBox.left
            },
            sw: {
              lat: boundingBox.bottom,
              lng: boundingBox.left
            },
            ne: {
              lat: boundingBox.top,
              lng: boundingBox.right
            },
            se: {
              lat: boundingBox.bottom,
              lng: boundingBox.right
            }
          }

          // Calculate adjusted bounds to fit the specified bounds exactly within the map container.
          let adjustedBounds = fitBounds(bounds, {width: this.mapContainer.clientWidth, height: this.mapContainer.clientHeight });

          center = adjustedBounds.center;
          zoom = adjustedBounds.zoom;

          let mapPosition = {};

          // Update our map positioning if any of it has changed from the last record.
          if (zoom !== state.zoom) {
            mapPosition.zoom = zoom;
          }

          if (bounds !== state.bounds) {
            mapPosition.bounds = bounds;
          }

          if (center !== state.center) {
            mapPosition.center = center;
          }

          if (zoom !== state.zoom && bounds !== state.bounds && center !== state.center) {
            this.setState(mapPosition);
          }
        }
        else if (center !== this.state.center) {
          this.setState({ center: center });
        }
      }
    }
  }

  render() {
    let listings = this.props.listings || [];
    let center = this.state.center || { lat: this.state.latitude || this.props.location.latitude || parseFloat(process.env.REACT_APP_LOCATION_1_LAT), lng: this.state.longitude || this.props.location.longitude || parseFloat(process.env.REACT_APP_LOCATION_1_LNG) };
    let bounds = this.state.bounds;
    let zoom = this.state.zoom || 10;

    return (
      <div ref={(ref) => {this.mapContainer = ref}} style={{ height: (Helpers.windowHeight() - 130) + 'px' }}>
        <GoogleMapReact
          id={'map'}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            language: 'EN'
          }}
          options={(map) => {
            return {
              fullscreenControl: false,
              zoomControl: true,
              zoomControlOptions: {
                  position: map.ControlPosition.TOP_RIGHT
              }
            }
          }}
          onClick={this.onClick}
          bounds={ bounds }
          marginBounds={ bounds }
          draggable={true}
          onChange={this.onPositionChange}
          onDrag={this.mapDragged}
          resetBoundsOnResize={true}
          center={ center }
          ref={(ref) => {this.map = ref}}
          zoom={ zoom }
        >
          {
            listings.map((listing, index) => {
              return this.renderMarker(listing, index);
            })
          }
        </GoogleMapReact>
      </div>
    )
  }
}

export default ListingMap;
