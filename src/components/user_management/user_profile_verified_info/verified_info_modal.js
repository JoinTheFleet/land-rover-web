import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import FormRow from '../../miscellaneous/forms/form_row';
import FormGroup from '../../miscellaneous/forms/form_group';
import FormField from '../../miscellaneous/forms/form_field';
import Modal from '../../miscellaneous/modal';
import Button from '../../miscellaneous/button';
import VerifyPhoneNumberForm from './verify_phone_number_form';


class VerifiedInfoModal extends Component {
  constructor(props) {
    super(props);

    this.renderDriverLicenseForm = this.renderDriverLicenseForm.bind(this);
  }

  renderDriverLicenseForm() {

  }


  render() {
    let modalBody = '';

    if (this.props.type === 'phone') {
      modalBody = <VerifyPhoneNumberForm toggleModal={ this.props.toggleModal }/>
    }
    else {
      modalBody =  this.renderDriverLicenseForm();
    }

    return (
      <Modal open={ this.props.open } toggleModal={ this.props.toggleModal }>
        { modalBody }
      </Modal>
    )
  }
}

export default injectIntl(VerifiedInfoModal)
