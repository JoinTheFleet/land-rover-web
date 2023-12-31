import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle
} from 'react-google-maps';

import SearchBox from 'react-google-maps/lib/components/places/SearchBox';

import GeolocationService from '../../shared/services/geolocation_service';
import LocalizationService from '../../shared/libraries/localization_service';

const DEFAULT_CIRCLE_RADIUS = 750;

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: this.props.center || { lat: 0, lng: 0 },
      markers: this.props.markers || []
    };

    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  componentDidMount() {
    if (!this.props.center) {
      GeolocationService.getCurrentPosition()
                        .then(position => {
                          this.setState({
                            center: {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                            }
                          });
                        });
    }
  }

  componentWillReceiveProps(props) {
    if (props.center) {
      this.setState({ center: props.center });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.markers !== this.props.markers) {
      this.setState({
        markers: this.props.markers
      });
    }
  }

  onPlacesChanged() {
    const places = this.searchBox.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();

    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    const nextMarkers = places.map(place => ({
      position: place.geometry.location,
    }));

    this.setState({
      markers: nextMarkers,
    }, () => {
      this.props.onPlacesChanged(places);
    });

    this.map.fitBounds(bounds);
  }

  handleMapClick(location) {
    if (this.props.disableClick) {
      return;
    }

    let marker = {
      position: {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      }
    };

    this.setState({
      markers: [marker]
    }, () => {
      this.props.handleMapClick(location.latLng);
    });
  }

  render() {
    let markers = this.state.markers;
    let circles = this.props.circles || [];
    let searchBox = '';

    if (this.props.includeSearchBox) {
      searchBox = (
        <SearchBox
          bounds={this.props.bounds}
          controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
          onPlacesChanged={this.onPlacesChanged}
          ref={ (searchBox) => { this.searchBox = searchBox } }>
          <input type="text"
                 placeholder={ LocalizationService.formatMessage('listings.location.location_search') }
                 style={{
                   boxSizing: `border-box`,
                   border: `1px solid transparent`,
                   width: `160px`,
                   height: `32px`,
                   marginTop: `10px`,
                   marginLeft: `20px`,
                   padding: `0 10px`,
                   borderRadius: `3px`,
                   boxShadow: ` 0 0 2px 0 rgba(0, 0, 0, 0.5)`,
                   textOverflow: `ellipsis`,
                 }} />
        </SearchBox>
      );
    }

    return (
      <GoogleMap className="fleet-map"
                 defaultZoom={ this.props.zoom || 10 }
                 center={ this.state.center }
                 options={ this.props.options }
                 onClick={ this.handleMapClick }
                 ref={ (map) => { this.map = map } }>
        { searchBox }

        {
          markers.map((marker, index) => {
            return (
              <Marker key={ 'map_marker_' + (index + 1) }
                      position={ marker.position }
                      draggable={ this.props.draggableMarkers }
                      onDragEnd={ this.props.handleMarkerDragEnd } />
            )
          })
        }

        {
          circles.map((circle, index) => {
            return (
              <Circle key={ 'map_circle_' + index }
                      defaultCenter={ circle.position }
                      defaultRadius={ circle.radius || DEFAULT_CIRCLE_RADIUS }
                      options={ circle.options } />
            )
          })
        }
      </GoogleMap>
    )
  }
}

export default withScriptjs(withGoogleMap(Map))

Map.propTypes = {
  includeSearchBox: PropTypes.bool,
  draggableMarkers: PropTypes.bool,
  onPlacesChanged: PropTypes.func,
  handleMapClick: PropTypes.func,
  handleMarkerDragEnd: PropTypes.func,
  bounds: PropTypes.object,
  markers: PropTypes.array,
  circles: PropTypes.array
}
