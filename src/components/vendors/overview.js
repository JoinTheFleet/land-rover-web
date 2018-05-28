import React, { Component } from 'react';

import Avatar from 'react-avatar';
import LocalizationService from '../../shared/libraries/localization_service';

import { Link } from 'react-router-dom';

export default class Overview extends Component {
  renderMobile() {
    let vendor = this.props.vendor;
    let vendorLocation = this.props.vendorLocation;

    return (
      <div className="listing-view-user-details-mobile visible-xs col-xs-12 no-side-padding">
        <div className="pull-left"> 
          <div> { LocalizationService.formatMessage('application.owner') } </div>

          <div className="col-xs-12 no-side-padding">
            <div>
              <Link to={{
                  pathname: `/vendors/${vendor.id}`,
                  state: {
                    vendor: vendor,
                    vendorLocation: vendorLocation
                  }
                }} >
                <span className="secondary-text-color fs-18">{ vendor.name }</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="listing-view-user-details-mobile-image pull-right">
          <Link to={{
                pathname: `/vendors/${vendor.id}`,
                state: {
                  vendor: vendor,
                  vendorLocation: vendorLocation
                }
              }} >
            <Avatar size={ 50 } src={ vendor.images.original_url } alt="listing_user_avatar" round />
          </Link>
        </div>
      </div>
    );
  }

  renderNormal() {
    let vendor = this.props.vendor;
    let vendorLocation = this.props.vendorLocation;

    return (
      <div className="listing-view-user-details hidden-xs text-center pull-right">
        <Link to={{
          pathname: `/vendors/${vendor.id}`,
          state: {
            vendor: vendor,
            vendorLocation: vendorLocation
          }
        }} >
          <div className='text-center block'>
            <Avatar size={ 50 } src={ vendor.images.original_url } alt="listing_vendor_avatar" round />
            <span className="secondary-text-color fs-18">{ vendor.name }</span>
          </div>
        </Link>
      </div>
    )
  }

  render() {
    if (this.props.mobile) {
      return this.renderMobile();
    }
    else {
      return this.renderNormal();
    }
  }
}
