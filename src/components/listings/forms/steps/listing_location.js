import React, {
  Component
} from 'react';

import {
  injectIntl
} from 'react-intl';

import PropTypes from 'prop-types';

import Map from '../../../miscellaneous/map';

class ListingLocation extends Component {
  validateFields() {
    return true;
  }

  getListingProperties() {
    return {};
  }

  render() {
    let googleMapUrl = this.props.intl.formatMessage({
      id: 'google.maps.javascript_api_link',
    }, {
      key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    return (
      <div className="listing-form-location col-xs-12 no-side-padding">
        <Map googleMapURL={ googleMapUrl }
             loadingElement={ <div style={{ height: `100%` }} /> }
             containerElement={ (<div style={{ height: '448px' }}></div>) }
             mapElement={ <div style={{ height: '100%' }}></div> }
             defaultCenter={ { lat: 52.9893, lng: -6.0751581 } } />
      </div>
    );
  }
}

ListingLocation.propTypes = {

};

export default injectIntl(ListingLocation);
