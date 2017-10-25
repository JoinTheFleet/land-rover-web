import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Toggleable from '../miscellaneous/toggleable';
import closeGreyIcon from '../../assets/images/close-grey.png';
import CloseOnEscape from 'react-close-on-escape';

export default class Modal extends Component {
  render() {
    let title = '';

    if (this.props.title) {
      title = <p className="title-font-weight fs-28">{ this.props.title }</p>;
    }
    return (
      <CloseOnEscape onEscape={ () => { this.props.toggleModal(this.props.modalName) }}>
        <Toggleable open={ this.props.open }>
          <div id="custom_modal" className="modal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <a className="close-login-modal-btn" data-dismiss="modal" onClick={ () => { this.props.toggleModal(this.props.modalName) }}>
                  <img src={closeGreyIcon} alt="close-modal-icon" />
                </a>
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
  title: PropTypes.string.isRequired,
  modalName: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired
};
