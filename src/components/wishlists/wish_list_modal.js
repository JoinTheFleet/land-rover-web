import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import FacebookLogin from 'react-facebook-login';
import Anime from 'react-anime';
import Alert from 'react-s-alert';

import LocalizationService from '../../shared/libraries/localization_service';
import WishListsService from '../../shared/services/wish_lists_service';

import Modal from '../miscellaneous/modal';
import FormField from '../miscellaneous/forms/form_field';
import Button from '../miscellaneous/button';

export default class WishListModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal open={ this.props.open }
             title={ LocalizationService.formatMessage('wish_lists.save_to_wishlist') }
             toggleModal={ this.props.toggleModal } >
      </Modal>
    )
  }
}

WishListModal.propTypes = {
  open: PropTypes.bool,
  listing: PropTypes.object.isRequired
};
