import React, {
  Component
} from 'react';

import {
  injectIntl,
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';

import ListingStep from './listing_step';

import Map from '../../../miscellaneous/map';
import Loading from '../../../miscellaneous/loading';

class ListingLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPosition: {},
      selectedAddress: ''
    };

    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.setLocation = this.setLocation.bind(this);
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
    let geocoder = new window.google.maps.Geocoder();
    let component = this;

    geocoder.geocode({ location: position}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          component.setLocation(results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  render() {
    let googleMapUrl = this.props.intl.formatMessage({
      id: 'google.maps.javascript_api_link',
    }, {
      key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

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
               draggableMarkers={ true } />
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
