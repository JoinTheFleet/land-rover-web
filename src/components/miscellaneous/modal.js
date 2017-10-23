import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Toggleable from '../miscellaneous/toggleable';
import closeGreyIcon from '../../assets/images/close-grey.png';

export default class Modal extends Component {
  renderErrors() {
    if (this.props.errors.length === 0) {
      return;
    }

    return (
      <div className="alert alert-danger">
        {
          this.props.errors.map((error, index) => {
            return (<div key={ 'login_error_' + (index + 1) }>{ error }</div>)
          })
        }
      </div>
    );
  }

  render() {
    return (
      <Toggleable open={ this.props.open }>
        <div id="custom_modal" className="modal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <a className="close-login-modal-btn" data-dismiss="modal" onClick={ () => { this.props.toggleModal(this.props.modalName) }}>
                <img src={closeGreyIcon} alt="close-modal-icon" />
              </a>

              <p className="title-font-weight fs-28">{ this.props.title }</p>

              { this.props.children }

              { this.renderErrors() }
            </div>
          </div>
        </div>
      </Toggleable>
    )
  }
}

Modal.propTypes = {
  errors: PropTypes.array,
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  modalName: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired
};
