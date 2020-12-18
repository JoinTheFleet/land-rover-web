import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Alert from 'react-s-alert';

import PropTypes from 'prop-types';

import ListingStep from './listing_step';

import GeolocationService from '../../../../shared/services/geolocation_service';
import LocalizationService from '../../../../shared/libraries/localization_service';

import Helpers from '../../../../miscellaneous/helpers';

import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_MAPS_API_KEY;

class MapboxMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: undefined,
      marker: undefined,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedPosition !== this.props.selectedPosition) {
      this.state.map.setCenter([this.props.selectedPosition.lng, this.props.selectedPosition.lat]);
      this.state.marker.setLngLat([this.props.selectedPosition.lng, this.props.selectedPosition.lat]);
    }
  }

  componentDidMount() {
    let selectedPosition = this.props.selectedPosition;
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [selectedPosition.lng, selectedPosition.lat],
      zoom: 10
    });

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.addControl(new mapboxgl.FullscreenControl());

    const marker = new mapboxgl.Marker({draggable: true})
      .setLngLat([selectedPosition.lng, selectedPosition.lat])
      .addTo(map);

    this.setState({map: map, marker: marker});  

    let handleMarkerDragEnd = this.props.handleMarkerDragEnd;
    marker.on('dragend', ()=> {
      var lngLat = marker.getLngLat();
      handleMarkerDragEnd(lngLat);
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
    });

    map.addControl(geocoder, 'top-left');

    map.on('load', function() {
      geocoder.on('result', function(e) {
        geocoder.clear();
        marker.setLngLat(e.result.center);
        handleMarkerDragEnd({lng: e.result.center[0], lat: e.result.center[1]});
      });
    });
  }

  render() {
    return (
      <div
        ref={el => this.mapContainer = el}
        style={{ height: '448px' }}
      />
    )
  }
}

export default class ListingLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: { lat: parseFloat(process.env.REACT_APP_LOCATION_1_LAT), lng: parseFloat(process.env.REACT_APP_LOCATION_1_LNG) },
      selectedPosition: {
        latitude: 0,
        longitude: 0
      },
      selectedAddress: ''
    };

    this.setLocation = this.setLocation.bind(this);
    this.fetchLocation = this.fetchLocation.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
    this.handleMarkerDragEnd = this.handleMarkerDragEnd.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  componentWillMount() {
    if (!this.props.listing.location) {
      GeolocationService.getCurrentPosition()
                        .then(position => {
                          this.setState({
                            center: {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                            },
                            selectedPosition: {
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude
                            }
                          }, () => { this.handleMapClick(this.state.center); });
                        });
    }
  }

  componentDidMount() {
    let location = this.props.listing.location;
    let position = {
      lat: parseFloat(process.env.REACT_APP_LOCATION_1_LAT),
      lng: parseFloat(process.env.REACT_APP_LOCATION_1_LNG)
    }

    if (location) {
      position = {
        lat: location.latitude,
        lng: location.longitude
      };
    }

    this.setState({
      center: position,
      selectedPosition: {
        latitude: position.lat,
        longitude: position.lng
      }
    }, () => { this.handleMapClick(this.state.center) })
  }

  validateFields() {
    let properties = this.getListingProperties();

    return Object.keys(properties).length > 0;
  }

  getListingProperties() {
    return { location: this.state.selectedPosition };
  }

  setLocation(latitude, longitude, address) {
    this.setState({
      selectedPosition: {
        latitude: latitude,
        longitude: longitude
      },
      selectedAddress: address
    });
  }

  handleMarkerDragEnd(position){
    this.fetchLocation(position);
  }

  handleMapClick(position) {
    this.fetchLocation(position);
  }

  fetchLocation(position) {
    const latitude = typeof position.lat === 'function' ? position.lat() : position.lat;
    const longitude = typeof position.lng === 'function' ? position.lng() : position.lng;

    this.setState({
      selectedPosition: {
        latitude: latitude,
        longitude: longitude
      },
      selectedAddress: `${latitude}, ${longitude}`
    }, () => {
      GeolocationService.getLocationFromPosition(this.state.selectedPosition)
                        .then(results => {
                          if (results && results.length > 0) {
                            const index = results.findIndex(result => Math.abs(result.geometry.location.lat - latitude) <= 0.01 && Math.abs(result.geometry.location.lng - longitude) <= 0.01);

                            if (index > -1) {
                              this.setLocation(results[index].geometry.location.lat, results[index].geometry.location.lng, results[index].formatted_address);
                            }
                          }
                        })
                        .catch(error => { Alert.error(error.toString()); });
    });
  }

  render() {
    let selectedPosition;

    if (Object.keys(this.state.selectedPosition).length > 0) {
      selectedPosition = {
        lat: this.state.selectedPosition.latitude,
        lng: this.state.selectedPosition.longitude
      };
    }

    return (
      <div className="listing-form-location col-xs-12 no-side-padding">
        <div className="listing-form-location-map col-xs-12 no-side-padding">
          <MapboxMap
            listing={this.props.listing}
            selectedPosition={selectedPosition}
            handleMarkerDragEnd={this.handleMarkerDragEnd}
          />
          <div className="listing-form-location-disclaimer white-text text-center col-xs-12 no-side-padding fs-15 text-secondary-font-weight ls-dot-five">
            <FormattedMessage id="listings.location.for_security_reasons" />
          </div>
        </div>
        <div className="listing-form-location-selected-address smoke-grey col-xs-12 no-side-padding">
          <ListingStep validateFields={ this.validateFields }
                       getListingProperties={ this.getListingProperties }
                       handleProceedToStepAndAddProperties={ this.props.handleProceedToStepAndAddProperties }
                       listing={ Helpers.extendObject(this.props.listing, this.getListingProperties()) } >
            <input type="text"
                   readOnly={ true }
                   id="listing_form_location_selected_address"
                   value={ this.state.selectedAddress }
                   placeholder={ LocalizationService.formatMessage('listings.location.address_location') } />
          </ListingStep>
        </div>
      </div>
    );
  }
}

ListingLocation.propTypes = {
  handleProceedToStepAndAddProperties: PropTypes.func.isRequired,
  listing: PropTypes.object.isRequired
};
