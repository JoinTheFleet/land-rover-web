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
      let selectedClassName = '';
      let additionalClasses= "no-side-padding";

      if (selected) {
        marker = (
          <div lat={coordinates.latitude}
               lng={coordinates.longitude}
               key={`listing_${listing.id}`}
               listing_id={listing.id}
               id={`listing_${listing.id}_map_pin`}
               className="listings-map-listing-details-div">
                <ListingItem additionalClasses={additionalClasses} listing={listing} />
          </div>
        )
      }
      else {
        marker = (
          <div lat={coordinates.latitude}
               lng={coordinates.longitude}
               key={`listing_${listing.id}`}
               listing_id={listing.id}
               id={`listing_${listing.id}_map_pin`}
               onClick={(event) => {this.selectMarker(listing.id)}}
               className={className}>
                <span className={selectedClassName}>
                  {`${listing.country_configuration.country.currency_symbol}${Math.round(listing.price / 100)}`}
                </span>
          </div>
        );
      }

      return marker;
    }
  }

  onClick(event) {
    if (this.state.markerSelected && closest(event.event.target, '.listings-map-listing-details-div')) {
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

  boundingBoxIsDefault(boundingBox) {
    return boundingBox &&
           Math.floor(Math.abs(boundingBox.top)) === 0 &&
           Math.floor(Math.abs(boundingBox.bottom)) === 0 &&
           Math.floor(Math.abs(boundingBox.left)) === 0 &&
           Math.floor(Math.abs(boundingBox.right)) === 0;
  }

  componentDidUpdate(props, state) {
    if (this.map) {
      let center = { lat: this.props.location.latitude, lng: this.props.location.longitude};
      let boundingBox = this.props.boundingBox;
      let bounds = undefined;
      let zoom = this.map ? this.map.props.zoom : 10;
      let mapCenter = this.map.props.center;

      if (mapCenter && mapCenter.lat !== center.lat && mapCenter.lng !== center.lng) {
        if (this.props.boundingBox !== props.boundingBox && !this.boundingBoxIsDefault(boundingBox)) {
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

          let adjustedBounds = fitBounds(bounds, {width: this.mapContainer.clientWidth, height: this.mapContainer.clientHeight });

          center = adjustedBounds.center;
          zoom = adjustedBounds.zoom;

          if (zoom !== state.zoom && bounds !== state.bounds && center !== state.center) {
            this.setState({
              zoom: zoom,
              bounds: bounds,
              center: center
            });
          }
        }
        else {
          if (center !== state.center) {
            this.setState({
              center: center
            });
          }
        }
      }
    }
  }

  render() {
    let listings = this.props.listings;
    let locationCenter = { lat: 0, lng: 0};
    let center = this.state.center || locationCenter;
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
          onClick={this.onClick}
          bounds={ bounds }
          marginBounds={ bounds }
          draggable={true}
          onChange={this.onPositionChange}
          onDrag={this.mapDragged}
          onZoomAnimationEnd={() => { this.onPositionChange({
            bounds: this.map.props.bounds,
            center: this.map.props.center
          })}}
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
