import React, {
  Component
} from 'react';

import {
  injectIntl,
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';

import Map from '../../../miscellaneous/map';
import Loading from '../../../miscellaneous/loading';

class ListingLocation extends Component {
  constructor(props) {
    super(props);

    this.onPlacesChanged = this.onPlacesChanged.bind(this);
  }


  validateFields() {
    return true;
  }

  getListingProperties() {
    return {};
  }

  onPlacesChanged(places) {
    if (places.length > 0) {
      
    }
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
              draggableMarkers={ true } />
          <div className="listing-form-location-disclaimer white-text text-center col-xs-12 no-side-padding fs-15 text-secondary-font-weight ls-dot-five">
            <FormattedMessage id="listings.location.for_security_reasons" />
          </div>
        </div>
        <div className="listing-form-location-selected-address smoke-grey col-xs-12 no-side-padding">
        </div>
      </div>
    );
  }
}

ListingLocation.propTypes = {
  listing: PropTypes.object.isRequired
};

export default injectIntl(ListingLocation);
