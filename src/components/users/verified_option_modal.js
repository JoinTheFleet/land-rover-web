import React, { Component } from 'react';

import Modal from '../miscellaneous/modal';
import Button from '../miscellaneous/button';

import LocalizationService from '../../shared/libraries/localization_service';

export default class UserVerificationModal extends Component {
  render() {
    return (
      <Modal {...this.props} modalClass='user-verification' title={ LocalizationService.formatMessage('user_verification.account_created') }>
        <div className='row'>
          <div className='col-xs-12 verification'>
            <div className='col-xs-12 no-side-padding verification-prompt text-center'>
              { LocalizationService.formatMessage('user_verification.next_prompt') }
            </div>
            <div className='col-xs-12 no-side-padding verification-buttons'>
              <div className='col-xs-12'>
                <Button onClick={ this.props.showRentalVerifications } className='button col-xs-12'>
                  { LocalizationService.formatMessage('user_verification.approved_to_rent') }
                </Button>
              </div>
            </div>
            <div className='col-xs-12 no-side-padding verification-continue'>
              <div className='col-xs-12'>
                <Button className='col-xs-12' onClick={ this.props.hideVerificationOptions }>
                  { LocalizationService.formatMessage('user_verification.continue_browsing') }
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
