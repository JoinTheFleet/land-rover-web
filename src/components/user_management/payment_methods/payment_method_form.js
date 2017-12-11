import React, { Component } from 'react';

import { CardElement } from 'react-stripe-elements';

export default class PaymentMethodForm extends Component {
  render() {
    return (
      <form onSubmit={ this.props.addPaymentSource } >
        <div className='col-xs-12'>
          <CardElement hidePostalCode={ true } />
        </div>
      </form>
    );
  }
}
