import React, { Component } from 'react';
import Avatar from 'react-avatar';

import LocalizationService from '../../shared/libraries/localization_service';
import Loading from '../miscellaneous/loading';
import WishListSummary from '../wishlists/wish_list_summary';
import { Link, Redirect } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';
import { Prompt } from 'react-router';

import UserProfileVerifiedInfo from '../user_management/user_profile_verified_info';
import UserPaymentMethods from '../user_management/user_payment_methods';
import UserPayoutMethods from '../user_management/user_payout_methods';
import UserProfileDetails from '../user_management/user_profile_details';
import UserVerificationModal from '../users/user_verification_modal';
import VerifiedOptionModal from '../users/verified_option_modal';
export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dirty: false,
      showVerificationModal: false,
      showVerificationOptions: false
    };

    this.setDirty = this.setDirty.bind(this);
    this.setClean = this.setClean.bind(this);
    this.closeVerificationModal = this.closeVerificationModal.bind(this);
    this.showRentalVerifications = this.showRentalVerifications.bind(this);
    this.hideVerificationOptions = this.hideVerificationOptions.bind(this);
    this.listCar = this.listCar.bind(this);
  }

  componentWillMount() {
    if (this.props.location && this.props.location.state) {
      let state = this.props.location.state;

      if (state.onboarding) {
        if (!state.natural) {
          this.setState({ showVerificationModal: true });
        }
        else {
          this.setState({ showVerificationOptions: true });
        }
      }
    }
  }

  showRentalVerifications() {
    this.setState({ showVerificationModal: true, showVerificationOptions: false });
  }

  hideVerificationOptions() {
    this.setState({ showVerificationOptions: false });
  }

  listCar() {
    this.setState({ listCar: true });
  }

  setClean() {
    this.setState({ dirty: false })
  }

  setDirty() {
    this.setState({ dirty: true })
  }

  closeVerificationModal() {
    this.setState({ showVerificationModal: false, showVerificationOptions: false })
  }

  renderProfileDetails() {
    if (!this.state.showVerificationModal && !this.state.showVerificationOptions) {
      return (
        <div>
          <Prompt
            when={ this.state.dirty }
            message={ LocalizationService.formatMessage('application.unsaved') }
          />

          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <UserProfileDetails setDirty={ this.setDirty } setClean={ this.setClean } />
          </div>
          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <UserProfileVerifiedInfo {... this.props } setDirty={ this.setDirty } setClean={ this.setClean } />
          </div>
          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <Elements>
              <UserPaymentMethods {... this.props} />
            </Elements>
          </div>
          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <Elements>
              <UserPayoutMethods {... this.props} onboarding={ this.props.showVerificationModal } />
            </Elements>
          </div>
        </div>
      )
    }
    else {
      return <div />;
    }
  }

  render() {
    if (!this.props.user) {
      return <Loading />;
    }
    else if (this.state.listCar) {
      return <Redirect to='/listings/new' />;
    }
    else {
      let image;

      if (this.props.user.images && Object.keys(this.props.user.images).length > 0) {
        image = this.props.user.images.large_url;
      }

      return (
        <div className='col-xs-12 user-dashboard'>
          <UserVerificationModal {...this.props} open={ this.state.showVerificationModal } toggleModal={ this.closeVerificationModal } scope={ 'renter' } closeModal={ this.closeVerificationModal } user={ this.props.user } updateUser={ this.props.reloadUser } configurations={ this.props.configuration } />
          <VerifiedOptionModal {...this.props} open={ this.state.showVerificationOptions } toggleModal={ this.closeVerificationModal } listCar={ this.listCar } showRentalVerifications={ this.showRentalVerifications } hideVerificationOptions={ this.hideVerificationOptions } />

          <div className='col-xs-12 no-side-padding user-header'>
            <Avatar src={ image } size={ 200 } className='col-xs-12 col-sm-4 user-avatar no-side-padding' />
            <div className='col-xs-12 col-sm-8 dashboard-information'>
              <div className='dashboard-information-container no-side-padding col-xs-12'>
                <div className='col-xs-12 no-side-padding user-name'>
                  { this.props.user.name }
                </div>
                <div className='col-xs-12 no-side-padding credit-information'>
                  <div className='col-xs-12 credit-amount no-side-padding '>
                    { this.props.user.credit_balance ? this.props.user.credit_balance.message : '' }
                  </div>
                  <div className='col-xs-12 credit-explanation no-side-padding'>
                    { LocalizationService.formatMessage('dashboard.credits.invite') }
                  </div>
                  <div className='col-xs-12 no-side-padding credit-button'>
                    <Link to={ '/profile/credits' } className='btn btn-inverted col-xs-12 col-sm-2'>
                      { LocalizationService.formatMessage('dashboard.credits.view') }
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          { this.renderProfileDetails() }

          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <WishListSummary />
          </div>
        </div>
      );
    }
  }
}
