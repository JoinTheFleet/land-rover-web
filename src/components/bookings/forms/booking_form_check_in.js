import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import Anime from 'react-anime';

import { FormattedMessage } from 'react-intl';

import SignatureBox from '../../miscellaneous/signature_box';
import Button from '../../miscellaneous/button';

import LocalizationService from '../../../shared/libraries/localization_service';

class BookingFormCheckIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signatures: {
        renter: '',
        owner: ''
      },
      expandCheckIn: false
    };

    this.handleSignatureChange = this.handleSignatureChange.bind(this);
    this.handleCheckInButtonClick = this.handleCheckInButtonClick.bind(this);
  }

  handleCheckInButtonClick() {
    let expandCheckIn = this.state.expandCheckIn;

    if (!expandCheckIn) {
      this.setState({ expandCheckIn: true });
    }
    else {
      let signatures = this.state.signatures;

      if (signatures.renter === '' || signatures.owner === '') {
        Alert.error(LocalizationService.formatMessage('bookings.please_provide_both_signatures'));
      }
      else {
        this.props.handleConfirmCheckIn(signatures.renter, signatures.owner);
      }
    }
  }

  handleSignatureChange(signatureEntity, signature) {
    if (!signature || signature === '') {
      return ;
    }

    let signatures = this.state.signatures;
    signatures[signatureEntity] = signature;

    this.setState({ signatures: signatures });
  }

  render() {
    let termsAndConditions = (<a target="_blank" href={process.env.REACT_APP_FLEET_TERMS_URL}> <b>{ LocalizationService.formatMessage('application.terms_and_conditions') } </b></a>);

    return (
      <div className="booking-form-action-buttons booking-form-check-in-buttons text-center col-xs-12 no-side-padding">
        <p>
          <FormattedMessage id="bookings.please_sign_in_below" values={ { terms_and_conditions: termsAndConditions } } />
        </p>

        <div className="booking-form-check-in col-xs-12 no-side-padding">
          <Anime easing="easeOutQuart"
                 height={ this.state.expandCheckIn ? '215px' : 0 }>
            <div className="booking-form-check-in-signatures col-xs-12 no-side-padding">
              <SignatureBox placeholder={ LocalizationService.formatMessage('bookings.renter_signature') }
                            handleSignatureChange={ (signature) => { this.handleSignatureChange('renter', signature) } } />
              <SignatureBox placeholder={ LocalizationService.formatMessage('bookings.owner_signature') }
                            handleSignatureChange={ (signature) => { this.handleSignatureChange('owner', signature) } } />
            </div>
          </Anime>

          <Button className="secondary-color white-text fs-18 col-xs-12"
                  onClick={ this.handleCheckInButtonClick }> { LocalizationService.formatMessage('bookings.check_in_renter') } </Button>
        </div>

        <Button className="tomato white-text fs-18 col-xs-12"
                onClick={ this.props.handleCancelBooking }> { LocalizationService.formatMessage('bookings.cancel_booking') } </Button>
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
