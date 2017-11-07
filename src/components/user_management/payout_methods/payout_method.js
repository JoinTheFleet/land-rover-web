import React, { Component } from 'react';
import Alert from 'react-s-alert';

import PayoutMethodsService from '../../../shared/services/payout_methods_service';
import LocalizationService from '../../../shared/libraries/localization_service';

import Loading from '../../miscellaneous/loading';

const TWELVE_STARS = "**** **** **** ";

export default class PayoutMethod extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }

    this.makeDefault = this.makeDefault.bind(this);
    this.destroy = this.destroy.bind(this);
    this.formattedAccount = this.formattedAccount.bind(this);
    this.successfullyUpdated = this.successfullyUpdated.bind(this);
  }

  makeDefault() {
    this.setState({
      loading: true
    }, () => {
      PayoutMethodsService.makeDefault(this.props.source.id)
                          .then(this.successfullyUpdated);
    });
  }

  destroy() {
    this.setState({
      loading: true
    }, () => {
      PayoutMethodsService.destroy(this.props.source.id)
                          .then(this.successfullyUpdated);
    });
  }

  successfullyUpdated() {
    Alert.success(LocalizationService.formatMessage('user_profile_verified_info.payout_information_updated'));
    this.props.reloadData();
  }

  formattedAccount() {
    return TWELVE_STARS + this.props.source.last_four;
  }

  render() {
    let options = '';

    if (this.state.loading) {
      options = (
        <Loading hiddenText={ true } fixedSize={ '20px' } className={ 'pull-right' }/>
      );
    }
    else if (this.props.isDefault) {
      options = (
        <div>
          <div className='pull-right card-destroy' onClick={ this.destroy }> { LocalizationService.formatMessage('application.delete') } </div>
        </div>
      )
    }
    else {
      options = (
        <div>
          <div className='pull-right card-destroy' onClick={ this.destroy }> { LocalizationService.formatMessage('application.delete') } </div>
          <div className='pull-right card-default' onClick={ this.makeDefault }> { LocalizationService.formatMessage('user_profile_verified_info.make_default') } </div>
        </div>
      )
    }

    return (
      <div className="col-xs-12 payment-source">
        <div className='col-xs-12 col-sm-6 card-number'>{ this.formattedAccount() }</div>
        <div className='col-xs-12 col-sm-6 card-options'>
          { options }
        </div>
      </div>
    )
  }
}
