import React, { Component } from 'react';

import { injectIntl, FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import ListingStep from './listing_step';

import Map from '../../../miscellaneous/map';
import Loading from '../../../miscellaneous/loading';
import GeolocationService from '../../../../shared/services/geolocation_service';


class ListingLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: {
        lat: 0,
        lng: 0
      },
      selectedPosition: {
        latitude: 0,
        longitude: 0
      },
      selectedAddress: ''
    };

    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.setLocation = this.setLocation.bind(this);
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

    if (location) {
      let position = {
        lat: location.latitude,
        lng: location.longitude
      };

      this.setState({
        center: position,
        selectedPosition: {
          latitude: position.lat,
          longitude: position.lng
        }
      }, () => { this.handleMapClick(this.state.center) })
    }
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

  onPlacesChanged(places) {
    if (places.length === 1) {
      this.setLocation(places[0].geometry.location.lat(), places[0].geometry.location.lng(), places[0].formatted_address);
    }
  }

  handleMapClick(position) {
    if (window.google) {
      let geocoder = new window.google.maps.Geocoder();
      let component = this;

      geocoder.geocode({ location: position }, function(results, status) {
        if (status === 'OK' && results[0]) {
          component.setLocation(results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
        }
      });
    }
  }

  render() {
    let googleMapUrl = this.props.intl.formatMessage({
      id: 'google.maps.javascript_api_link',
    }, {
      key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

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
          <Map googleMapURL={ googleMapUrl }
               loadingElement={ <div style={{ height: `100%` }} ><Loading /></div> }
               containerElement={ (<div style={{ height: '448px' }}></div>) }
               mapElement={ <div style={{ height: '100%' }}></div> }
               includeSearchBox={ true }
               onPlacesChanged={ this.onPlacesChanged }
               handleMapClick={ this.handleMapClick }
               center={ this.state.center }
               draggableMarkers={ true }
               markers={ selectedPosition ? [{ position: selectedPosition}] : [] } >
          </Map>
          <div className="listing-form-location-disclaimer white-text text-center col-xs-12 no-side-padding fs-15 text-secondary-font-weight ls-dot-five">
            <FormattedMessage id="listings.location.for_security_reasons" />
          </div>
        </div>
        <div className="listing-form-location-selected-address smoke-grey col-xs-12 no-side-padding">
          <ListingStep validateFields={ this.validateFields }
                       getListingProperties={ this.getListingProperties }
                       handleProceedToStepAndAddProperties={ this.props.handleProceedToStepAndAddProperties }
                       intl={ this.props.intl }>
            <input type="text"
                   readOnly={ true }
                   id="listing_form_location_selected_address"
                   value={ this.state.selectedAddress }
                   placeholder={ this.props.intl.formatMessage({ id: 'listings.location.address_location' }) } />
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

export default injectIntl(ListingLocation);
