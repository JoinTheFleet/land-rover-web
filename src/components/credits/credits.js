import React, { Component } from 'react';
import Avatar from 'react-avatar';
import copy from 'copy-to-clipboard';

import LocalizationService from '../../shared/libraries/localization_service';
import BranchService from '../../shared/external/branch_service';
import Loading from '../miscellaneous/loading';
import Button from '../miscellaneous/button';

import CreditList from './credit_list';

export default class Credits extends Component {
  constructor(props) {
    super(props);

    this.state = {
      referralURL: undefined,
      buttonText: LocalizationService.formatMessage('dashboard.credits.copy_url'),
      buttonTimeout: undefined
    };

    this.copyReferralURL = this.copyReferralURL.bind(this);
  }

  componentWillMount() {
    BranchService.referralLink(this.props.user, this.props.configuration)
                 .then(link => {
                   this.setState({
                     referralURL: link
                   });
                 });
  }

  copyReferralURL() {
    clearTimeout(this.state.buttonTimeout);
    copy(this.state.referralURL);

    this.setState({
      buttonText: LocalizationService.formatMessage('dashboard.credits.copied')
    }, () => {
      let buttonTimeout = setTimeout(() => {
        this.setState({
          buttonText: LocalizationService.formatMessage('dashboard.credits.copy_url')
        });
      }, 1000);
      this.setState({ buttonTimeout: buttonTimeout })
    });
  }

  render() {
    if (!this.props.user) {
      return <Loading />;
    }
    else {
      let copyButton = '';
      let image;

      if (this.state.referralURL) {
        copyButton = (
          <div className='col-xs-12 no-side-padding credit-button'>
            <Button onClick={ this.copyReferralURL } className='btn btn-inverted col-xs-12 col-sm-4'>
              { this.state.buttonText }
            </Button>
          </div>
        )
      }

      if (this.props.user.images && Object.keys(this.props.user.images).length > 0) {
        image = this.props.user.images.large_url;
      }

      return (
        <div className='col-xs-12 user-dashboard'>
          <div className='col-xs-12 no-side-padding user-header'>
            <Avatar src={ image } size={ 200 } className='col-xs-12 col-sm-4 user-avatar no-side-padding' />
            <div className='col-xs-12 col-sm-8 dashboard-information'>
              <div className='dashboard-information-container no-side-padding col-xs-12'>
                <div className='col-xs-12 no-side-padding user-name'>
                  { this.props.user.name }
                </div>
                <div className='col-xs-12 no-side-padding credit-information'>
                  <div className='col-xs-12 credit-amount no-side-padding '>
                    { this.props.user && this.props.user.credit_balance ? this.props.user.credit_balance.message : '' }
                  </div>
                  <div className='col-xs-12 credit-explanation no-side-padding'>
                    { LocalizationService.formatMessage('dashboard.credits.invite') }
                  </div>
                  { copyButton }
                </div>
              </div>
            </div>
          </div>
          <div className='col-xs-12 no-side-padding dashboard-wishlist-summary'>
            <CreditList />
          </div>
        </div>
      );
    }
  }
}
