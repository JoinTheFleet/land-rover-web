import React, {
  Component
} from 'react';

import {
  injectIntl
} from 'react-intl';

import PropTypes from 'prop-types';

import ListingFormFieldGroup from '../listing_form_field_group';

class ListingRegistration extends Component {

  render() {
    return (
      <div className="listing-form-registration">
        <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.registration.registration_details'}) }>

        </ListingFormFieldGroup>
      </div>
    )
  }
}

export default injectIntl(ListingRegistration);

ListingRegistration.propTypes = {
  listing: PropTypes.object
}
