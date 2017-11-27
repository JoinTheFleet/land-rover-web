import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SignatureModal from './signature_modal';

import editSignatureIcon from '../../assets/images/edit.png';

class SignatureBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signature: '',
      modalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSignatureChange = this.handleSignatureChange.bind(this);
  }

  handleSignatureChange(signature) {
    if (!signature || signature === '') {
      return;
    }

    this.setState({
      signature: signature,
      modalOpen: false
    }, () => {
      this.props.handleSignatureChange(signature);
    });
  }

  toggleModal() {
    this.setState(prevState => ({ modalOpen: !prevState.modalOpen }));
  }

  render() {
    let signatureBox = (<div className="fleet-signature-box-placeholder"> { this.props.placeholder } </div>);

    if (this.state.signature) {
      signatureBox = (<img src={ this.state.signature} alt="signature" />);
    }

    return (
      <div className="fleet-signature-box fs-18 text-secondary-font-weight">
        <div onClick={ this.toggleModal }>
          { signatureBox }
          <div className="fleet-signature-box-open-modal-btn">
            <img src={ editSignatureIcon } alt="open_signature_modal_btn"  />
          </div>
        </div>

        <SignatureModal open={ this.state.modalOpen } toggleModal= { this.toggleModal } handleSignatureConfirmed={ this.handleSignatureChange } />
      </div>
    );
  }
}

SignatureBox.propTypes = {
  handleSignatureChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default SignatureBox;
