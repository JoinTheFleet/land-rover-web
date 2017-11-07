import React, { Component } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import LocalizationService from '../../shared/libraries/localization_service';
import moment from 'moment';

export default class CreditCard extends Component {
  render() {
    let credit = this.props.credit;

    let imageSRC = `${process.env.REACT_APP_PLATFORM_IMAGE_URL}`;

    if (credit.creditor) {
      imageSRC = credit.creditor.images.original_url;
    }

    return (
      <div className='col-xs-12 no-side-padding wishlist-card credit-card'>
        <div className='row'>
          <div className='col-xs-12'>
            <Avatar src={ imageSRC } size={ '80px' } round className='col-xs-12 col-sm-4 platform-avatar no-side-padding' />
            <div className='col-xs-12 credit-container' >
              <span className='strong-font-weight credit-name no-side-padding col-xs-10 text-left'>
                { credit.creditor.name }
              </span>
              <span className='col-xs-2 text-right timestamp'>
                { moment.unix(credit.created_at).fromNow() }
              </span>
              <span className='col-xs-12 no-side-padding'>
                { credit.message }
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
