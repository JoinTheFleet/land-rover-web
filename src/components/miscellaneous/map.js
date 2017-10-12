import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import {
  injectIntl
} from 'react-intl';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';

import SearchBox from 'react-google-maps/lib/components/places/SearchBox';

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: { lat: 52.9893, lng: -6.0751581 },
      markers: []
    };

    this.onPlacesChanged = this.onPlacesChanged.bind(this);
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

  render() {
    let markers = this.state.markers || [];
    let searchBox = '';

    if (this.props.includeSearchBox) {
      searchBox = (
        <SearchBox
          bounds={this.props.bounds}
          controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
          onPlacesChanged={this.onPlacesChanged}
          ref={ (searchBox) => { this.searchBox = searchBox } }>
          <input type="text"
                 placeholder={ this.props.intl.formatMessage({ id: 'listings.location.location_search' }) }
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
      <GoogleMap defaultZoom={ 10 }
                 center={ this.state.center }
                 className="fleet-map"
                 ref={ (map) => { this.map = map } }>
        { searchBox }

        {
          markers.map((marker, index) => {
            return (
              <Marker key={ 'listing_map_item_' + (index + 1) }
                      position={ marker.position }
                      draggable={ this.props.draggableMarkers } />
            )
          })
        }
      </GoogleMap>
    )
  }
}

export default withScriptjs(withGoogleMap(injectIntl(Map)))

Map.propTypes = {
  includeSearchBox: PropTypes.bool,
  onPlacesChanged: PropTypes.func,
  bounds: PropTypes.object,
  draggableMarkers: PropTypes.bool
}
