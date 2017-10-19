import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import GoogleMapReact from 'google-map-react';

import ListingItem from '../listings/listing_item';
import GeolocationService from '../../shared/services/geolocation_service';

import Helpers from '../../miscellaneous/helpers';

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

    this.selectMarker = this.selectMarker.bind(this);
    this.onPositionChange = this.onPositionChange.bind(this);
    this.mapDragged = this.mapDragged.bind(this);
    this.onClick = this.onClick.bind(this);
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

  selectMarker(id) {
    this.setState({markerSelected: `listing_${id}`});
  }

  mapDragged() {
    this.setState({mapDragged: true})
  }

  renderMarker(listing, index) {
    let markerKey = `listing_${listing.id}`;
    let coordinates = this.listingLocation(listing);
    let infoWindow = '';
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

      if (selected) {
        selectedClassName = 'blue'
      }

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

      return marker;
    }
  }

  onClick() {
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

  render() {
    let listings = this.props.listings;
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;

    return (
      <div style={{ height: (Helpers.windowHeight() - 130) + 'px' }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            language: 'EN'
          }}
          onClick={this.onClick}
          draggable={true}
          onChange={this.onPositionChange}
          onDrag={this.mapDragged}
          center={{ lat: latitude, lng: longitude }}
          zoom={ 10 }
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
