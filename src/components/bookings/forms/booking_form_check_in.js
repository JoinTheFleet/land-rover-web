import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import LocalizationService from '../../../shared/libraries/localization_service';

class BookingFormCheckIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renterSignature: '',
      ownerSignature: ''
    };
  }

  render() {
    let termsAndConditions = (<a target="_blank" href={process.env.REACT_APP_FLEET_TERMS_URL}> <b>{ LocalizationService.formatMessage('bookings.terms_and_conditions') } </b></a>);

    return (
      <div className="booking-form-action-buttons text-center col-xs-12 no-side-padding">
        <p>
          <FormattedMessage id="bookings.please_sign_in_below" values={ {terms_and_conditions: termsAndConditions } } />
        </p>
      </div>
    );
  }
}

BookingFormCheckIn.propTypes = {
  booking: PropTypes.object,
  handleConfirmCheckIn: PropTypes.func,
  handleCancelBooking: PropTypes.func
};

export default BookingFormCheckIn;
