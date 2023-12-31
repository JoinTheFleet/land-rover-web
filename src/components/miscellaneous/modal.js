import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Toggleable from '../miscellaneous/toggleable';
import CloseOnEscape from 'react-close-on-escape';
import MobileDetect from 'mobile-detect';

export default class Modal extends Component {
  constructor(props) {
    super(props);

    this.handleCloseOnEscape = this.handleCloseOnEscape.bind(this);
  }

  handleCloseOnEscape() {
    if (this.props.open) {
      this.props.toggleModal(this.props.modalName)
    }
  }

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
           onClick={ () => {
             if (this.props.closeAction) {
               this.props.closeAction(this.props.modalName);
             }

             this.props.toggleModal(this.props.modalName);
           }}>
          <i className='fa fa-times' />
        </a>
      );
    }

    let md = new MobileDetect(navigator.userAgent);
    let iOSVersion = md.version('iOS');

    document.body.classList.toggle('fixed-body', iOSVersion && iOSVersion >= 11.0 && this.props.open);

    return (
      <CloseOnEscape onEscape={ this.handleCloseOnEscape }>
        <Toggleable open={ this.props.open }>
          <div className={`${this.props.modalClass || 'custom-modal'} modal`} role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className='col-xs-12 no-side-padding title-row'>
                  { closeBtn }
                  { title }
                </div>
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
