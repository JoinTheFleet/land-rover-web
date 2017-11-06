import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import SignaturePad from 'react-signature-pad';

import Modal from './modal';

import LocalizationService from '../../shared/libraries/localization_service';

class SignatureModal extends Component {

  constructor(props) {
    super(props);

    this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
    this.handleSignatureConfirmed = this.handleSignatureConfirmed.bind(this);
  }

  componentDidMount() {
    let canvas = this.refs.fleetSignature._canvas;
    canvas.setAttribute('width', 576);
    canvas.setAttribute('height', 324);
  }

  handleClearButtonClick() {
    this.refs.fleetSignature.clear();
  }

  handleSignatureConfirmed() {
    let signature = this.refs.fleetSignature.toDataURL();
    this.props.handleSignatureConfirmed(signature);
  }

  render() {
    let termsAndConditions = (<a target="_blank" href={process.env.REACT_APP_FLEET_TERMS_URL}> <b>{ LocalizationService.formatMessage('application.terms_and_conditions') } </b></a>);

    return (
      <div className="signature-modal">
        <Modal open={ this.props.open }
               hideCloseButton={ true }
               toggleModal= { this.props.toggleModal } >
          <div className="signature-modal-header secondary-color white-text text-center">
            <div className="pull-left" onClick={ this.props.toggleModal }>
              { LocalizationService.formatMessage('application.cancel') }
            </div>

            { LocalizationService.formatMessage('signatures.draw_signature') }

            <div className="pull-right" onClick={ this.handleSignatureConfirmed }>
              { LocalizationService.formatMessage('application.done') }
            </div>


          </div>

          <div className="signature-modal-content">

            <div className="signature-modal-canvas-container">
              <SignaturePad ref="fleetSignature" />

              <span className="signature-modal-clear-btn tomato-text" onClick={ this.handleClearButtonClick }>
                { LocalizationService.formatMessage('application.clear') }
              </span>
            </div>

            <div className="signature-modal-footer text-center tertiary-text-color fs-12">
              <FormattedMessage id="signatures.please_sign_above" values={ { terms_and_conditions: termsAndConditions } } />
            </div>
          </div>

        </Modal>
      </div>
    );
  }
}

SignatureModal.propTypes = {
  open: PropTypes.bool,
  toggleModal: PropTypes.func,
  handleSignatureConfirmed: PropTypes.func
};

export default SignatureModal;
