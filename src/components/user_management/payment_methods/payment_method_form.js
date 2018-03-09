import React, { Component } from 'react';

import { CardElement } from 'react-stripe-elements';

export default class PaymentMethodForm extends Component {
  render() {
    let extraClass = this.props.className ? this.props.className : '';

    return (
      <form onSubmit={ this.props.addPaymentSource } >
        <div className={ `col-xs-12 ${extraClass}` }>
          <CardElement hidePostalCode={ true } />
        </div>
      </form>
    );
  }
}
