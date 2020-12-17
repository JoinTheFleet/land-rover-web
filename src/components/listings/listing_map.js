import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ListingItem from './listing_item';

import Helpers from '../../miscellaneous/helpers';

import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_MAPS_API_KEY;

class ListingMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: '',
      lng: this.props.location.longitude || parseFloat(process.env.REACT_APP_LOCATION_1_LNG),
      lat: this.props.location.latitude || parseFloat(process.env.REACT_APP_LOCATION_1_LAT),
      zoom: 10,
      boundingBox: {}
    };

    this.onPositionChange = this.onPositionChange.bind(this);
    this.mapDragged = this.mapDragged.bind(this);
  }

  mapDragged() {
    this.setState({mapDragged: true})
  }

  renderMarker(listing) {
    if (!document.getElementById(`listing_${listing.id}_map_pin`)) {
      const markerIcon = document.createElement('div');
      markerIcon.className = 'listing_map_price';
      markerIcon.id = `listing_${listing.id}_map_pin`;
      markerIcon.key = `listing_${listing.id}`;
      markerIcon.innerHTML = `<span>${listing.country_configuration.country.currency_symbol}${Math.round(listing.price / 100)}<\span>`;
  
      const popupNode = document.createElement('div');
      ReactDOM.unstable_renderSubtreeIntoContainer(this, <ListingItem toggleWishListModal={ this.props.toggleWishListModal } additionalClasses='no-side-padding' listing={listing} />, popupNode);
      let coordinates = this.listingLocation(listing);
      new mapboxgl.Marker(markerIcon)
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .setPopup(new mapboxgl.Popup().setDOMContent(popupNode))
        .addTo(this.state.map);
    }
  }

  onPositionChange(options) {
    let center = options.getCenter();

    this.setState({
      lat: center.lat,
      lng: center.lng
    });

    if (this.state.mapDragged) {
      this.props.onDragEnd(options, center);
    }
    else {
      this.props.onPositionChange(options, center);
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
    else if (!listing.location && this.mapContainer) {
      let center = this.mapContainer.getCenter();

      latitude = center.lat;
      longitude = center.lng;
    }

    return {
      latitude: latitude,
      longitude: longitude
    };
  }

  handleOnPositionChange(map) {
    this.setState({mapDragged: true}, () => {
      this.onPositionChange(map.getBounds());
      this.setState({map: map});
    });
  }

  componentDidUpdate(props, state) {
    if (this.mapContainer) {
      let listings = this.props.listings || [];
      document.querySelectorAll('.listing_map_price').forEach(e => e.remove());
      listings.forEach(listing => {
        this.renderMarker(listing);
      });
      if (props.location && (props.location.longitude !== state.lng || props.location.latitude !== state.lat)) {
        this.setState({
          lng: props.location.longitude,
          lat: props.location.latitude
        }, ()=>{
          if (props.boundingBox) {
            state.map.fitBounds([
              [props.boundingBox.left, props.boundingBox.bottom],
              [props.boundingBox.right, props.boundingBox.top]
            ]);
          } else {
            state.map.setCenter(
              [props.location.longitude, props.location.latitude]
            );
          }
        })
      }
    }
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    map.addControl(new mapboxgl.NavigationControl());
    if (this.props.boundingBox) {
      map.fitBounds([
        [this.props.boundingBox.left, this.props.boundingBox.bottom],
        [this.props.boundingBox.right, this.props.boundingBox.top]
      ]);
    }

    this.setState({map: map});

    let that = this;
    map.on('moveend', () => {
      that.handleOnPositionChange(map);
    });

    window.addEventListener('load', (e) => {
      that.handleOnPositionChange(map);
    });

    // clean up on unmount
    return () => map.remove();
  }

  render() {
    return (
      <div
        id={'map'}
        ref={el => this.mapContainer = el} 
        className="mapContainer" 
        style={{ height: (Helpers.windowHeight() - 130) + 'px' }}>
      </div>
    )
  }
}

export default ListingMap;