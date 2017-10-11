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
  render() {
    let markers = this.props.markers || [];
    let searchBox = '';

    if (this.props.includeSearchBox) {
      searchBox = (
        <SearchBox
          bounds={this.props.bounds}
          controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
          onPlacesChanged={this.props.onPlacesChanged}>
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
      <GoogleMap defaultZoom={10}
                 defaultCenter={ this.props.defaultCenter }
                 className="fleet-map">
        { searchBox }

        {
          markers.map((marker, index) => {
            return (
              <Marker key={ 'listing_map_item_' + (index + 1) }
                      position={ marker.position } />
            )
          })
        }
      </GoogleMap>
    )
  }
}

export default withScriptjs(withGoogleMap(injectIntl(Map)))

Map.propTypes = {
  defaultCenter: PropTypes.object.isRequired,
  markers: PropTypes.array,
  includeSearchBox: PropTypes.bool,
  onPlacesChanged: PropTypes.func,
  bounds: PropTypes.object
}
