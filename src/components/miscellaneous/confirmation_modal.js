import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from './modal';

import LocalizationService from '../../shared/libraries/localization_service';

class ConfirmationModal extends Component {
  constructor(props) {
    super(props);

    this.cancelAction = this.cancelAction.bind(this);
    this.confirmationAction = this.confirmationAction.bind(this);
  }

  confirmationAction() {
    this.props.toggleModal(this.props.modalName);

    if (this.props.confirmationAction) {
      this.props.confirmationAction();
    }
  }

  cancelAction() {
    this.props.toggleModal(this.props.modalName);

    if (this.props.cancelAction) {
      this.props.cancelAction();
    }
  }

  render() {
    let title = '';
    let confirmationText = this.props.confirmationText || LocalizationService.formatMessage('application.yes');
    let cancelText = this.props.cancelText || LocalizationService.formatMessage('application.no');

    if (this.props.title) {
      title = (<p className="fs-18">{ this.props.title }</p>);
    }

    return (
      <Modal open={ this.props.open }
             hideCloseButton={ true }
             modalName={ this.props.modalName }
             modalClass="confirmation-modal"
             toggleModal={ this.props.toggleModal }>
        <div className="modal-header secondary-color white-text text-center">
          { title }
        </div>

        <div className="modal-text text-center">
          <div>
            { this.props.children }
          </div>
        </div>

        <div className="modal-footer">
          <div className="col-xs-12 col-sm-6">
            <button className="confirmation-modal-confirm-btn secondary-color white-text btn col-xs-12" onClick={ this.confirmationAction }> { confirmationText } </button>
          </div>
          <div className="col-xs-12 col-sm-6">
            <button className="confirmation-modal-confirm-btn tomato white-text btn col-xs-12" onClick={ this.cancelAction }> { cancelText } </button>
          </div>
        </div>
      </Modal>
    );
  }
}

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  confirmationAction: PropTypes.func.isRequired,
  cancelAction: PropTypes.func,
  modalName: PropTypes.string,
  title: PropTypes.string,
  confirmationText: PropTypes.string,
  cancelText: PropTypes.string
};

export default ConfirmationModal;
