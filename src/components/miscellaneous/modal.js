import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Toggleable from '../miscellaneous/toggleable';
import closeGreyIcon from '../../assets/images/close-grey.png';
import CloseOnEscape from 'react-close-on-escape';

export default class Modal extends Component {
  render() {
    let title = '';
    let closeBtn = '';

    if (this.props.title) {
      title = (<p className="title-font-weight fs-28">{ this.props.title }</p>);
    }

    if (!this.props.hideCloseButton) {
      closeBtn = (
        <a className={`close-login-modal-btn ${this.props.closeButtonPosition === 'right' ? 'pull-right' : ''}`}
           data-dismiss="modal"
           onClick={ () => { this.props.toggleModal(this.props.modalName) }}>
          <img src={closeGreyIcon} alt="close-modal-icon" />
        </a>
      );
    }

    return (
      <CloseOnEscape onEscape={ () => { this.props.toggleModal(this.props.modalName) }}>
        <Toggleable open={ this.props.open }>
          <div className={`${this.props.modalClass || 'custom-modal'} modal`} role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                { closeBtn }
                { title }
                { this.props.children }
              </div>
            </div>
          </div>
        </Toggleable>
      </CloseOnEscape>
    )
  }
}

Modal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  modalName: PropTypes.string,
  modalClass: PropTypes.string,
  hideCloseButton: PropTypes.bool,
  closeButtonPosition: PropTypes.string,
  toggleModal: PropTypes.func.isRequired
};
