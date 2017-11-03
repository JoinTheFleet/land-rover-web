import React, { Component } from 'react';

import Modal from '../../miscellaneous/modal';

import VerifyPhoneNumberForm from './verify_phone_number_form';
import VerifyDriversLicenseForm from './verify_drivers_license_form';

export default class VerifiedInfoModal extends Component {
  render() {
    let modalBody = '';

    if (this.props.type === 'phone') {
      modalBody = <VerifyPhoneNumberForm toggleModal={ this.props.toggleModal }/>
    }
    else {
      modalBody = <VerifyDriversLicenseForm toggleModal={ this.props.toggleModal }/>
    }

    return (
      <Modal open={ this.props.open } toggleModal={ this.props.toggleModal }>
        { modalBody }
      </Modal>
    )
  }
}
