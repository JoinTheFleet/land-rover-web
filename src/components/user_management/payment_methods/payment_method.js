import React, { Component } from 'react';
import Alert from 'react-s-alert';

import PaymentMethodsService from '../../../shared/services/payment_methods_service';
import LocalizationService from '../../../shared/libraries/localization_service';
import Loading from '../../miscellaneous/loading';

const TWELVE_STARS = "**** **** **** ";

export default class PaymentMethod extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }

    this.makeDefault = this.makeDefault.bind(this);
    this.destroy = this.destroy.bind(this);
    this.formattedCard = this.formattedCard.bind(this);
    this.successfullyUpdated = this.successfullyUpdated.bind(this);
  }

  successfullyUpdated() {
    Alert.success(LocalizationService.formatMessage('user_profile_verified_info.payment_information_updated'));
    this.props.reloadData();
  }

  makeDefault() {
    this.setState({
      loading: true
    }, () => {
      PaymentMethodsService.makeDefault(this.props.source.id)
                           .then(this.successfullyUpdated)
    });
  }

  destroy() {
    this.setState({
      loading: true
    }, () => {
      PaymentMethodsService.destroy(this.props.source.id)
                           .then(this.successfullyUpdated)
                           .catch(error => {
                            let errorMessage = error.response.data.message;
                            Alert.error(errorMessage);

                            this.setState({
                              cardLoading: false,
                              loading: false
                            });
                          })
    });
  }

  formattedCard() {
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
        <div className='col-xs-12 col-sm-4 card-number'>{ this.formattedCard() }</div>
        <div className='col-xs-12 col-sm-2 card-expiry'>{ `${this.props.source.exp_month}/${this.props.source.exp_year}` }</div>
        <div className='col-xs-12 col-sm-6 card-options'>
          { options }
        </div>
      </div>
    )
  }
}
