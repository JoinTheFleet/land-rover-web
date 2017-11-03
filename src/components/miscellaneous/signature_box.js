import React, { Component } from 'react';
import PropTypes from 'prop-types';

import editSignatureIcon from '../../assets/images/edit.png';

class SignatureBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signature: ''
    };

    this.handleSignatureChange = this.handleSignatureChange.bind(this);
  }

  handleSignatureChange(signature) {
    this.setState({
      signature: signature
    }, () => {
      this.props.handleSignatureChange(signature);
    });
  }

  render() {
    let signatureBox = (<input type="text" disabled={ true } placeholder={ this.props.placeholder } />);

    if (this.state.signature) {
      signatureBox = (<img src={ this.state.signature} alt="signature" />);
    }

    return (
      <div className="fleet-signature-box">
        { signatureBox }
        <div className="fleet-signature-box-open-modal-btn">
          <img src={ editSignatureIcon } alt="open_signature_modal_btn" />
        </div>
      </div>
    );
  }
}

SignatureBox.propTypes = {
  handleSignatureChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default SignatureBox;
