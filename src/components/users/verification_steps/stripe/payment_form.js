import React, { Component } from 'react';

import PaymentMethodForm from '../../../user_management/payment_methods/payment_method_form';

import stripeImage from '../../../../assets/images/stripe.png';
import LocalizationService from '../../../../shared/libraries/localization_service';
import PaymentMethodsService from '../../../../shared/services/payment_methods_service';

import Alert from 'react-s-alert';

import { injectStripe } from 'react-stripe-elements';

class PaymentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.addPaymentSource = this.addPaymentSource.bind(this);
  }

  addPaymentSource(event) {
    if (event) {
      event.preventDefault();
    }

    this.props.stripe.createToken({ type: 'card' })
                     .then(({token}) => {
                       if (token.id) {
                         PaymentMethodsService.create({ payment_method: { token: token.id } })
                                              .then(() => {
                                                this.setState({
                                                  paymentDetailsAdded: true
                                                }, () => {
                                                  this.props.saveUser(true)
                                                });
                         });
                       }
                     })
                     .catch(() => {
                       Alert.error(LocalizationService.formatMessage('user_profile_verified_info.payment_method_invalid_card'));
                     });
  }

  render() {
    return (
      <div className='payment-form'>
        <div className='col-xs-12 no-side-padding form-label'>
          { LocalizationService.formatMessage('user_verification.add_card') }
        </div>
        <div className='col-xs-12 no-side-padding'>
          <PaymentMethodForm addPaymentSource={ this.addPaymentSource } className='stripe no-side-padding' />
        </div>
        <button className='btn button round form-button col-xs-12' hidden={ this.state.paymentDetailsAdded } onClick={ this.addPaymentSource }>
          { LocalizationService.formatMessage('user_verification.verify') }
        </button>
        <button className='btn button round form-button success col-xs-12' disabled={ true } hidden={ this.props.user && this.props.user.verifications_required.payment_method && !this.props.paymentDetailsAdded }>
          { LocalizationService.formatMessage('user_verification.confirmed') }
        </button>

        <div className='stripe-logo'>
          <img src={ stripeImage } alt='stripe' />
        </div>
      </div>
    );
  }
}

export default injectStripe(PaymentForm)