import React, { Component } from 'react';
import Alert from 'react-s-alert';

import PaymentMethodsService from '../../shared/services/payment_methods_service';
import LocalizationService from '../../shared/libraries/localization_service';
import Loading from '../miscellaneous/loading';
import Button from '../miscellaneous/button';
import Placeholder from '../miscellaneous/placeholder';
import FormPanel from '../miscellaneous/forms/form_panel';
import {injectStripe } from 'react-stripe-elements';
import PaymentMethod from './payment_methods/payment_method';
import PaymentMethodForm from './payment_methods/payment_method_form';

class UserPaymentMethods extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sources: [],
      loading: false,
      cardSaving: false
    };

    this.reloadData = this.reloadData.bind(this);
    this.addPaymentSource = this.addPaymentSource.bind(this);
  }

  componentWillMount() {
    this.reloadData();
  }

  reloadData() {
    this.setState({
      loading: true
    }, () => {
      PaymentMethodsService.index()
                           .then(response => {
                             this.setState({
                               sources: response.data.data.payment_methods,
                               cardLoading: false,
                               loading: false
                             });
                           });
     });
  }

  addPaymentSource(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      cardLoading: true
    }, () => {
      this.props.stripe.createToken({ type: 'card' })
                       .then(({token}) => {
                         if (token.id) {
                           PaymentMethodsService.create({ payment_method: { token: token.id } }).then(() => {
                             this.reloadData();
                             Alert.success(LocalizationService.formatMessage('user_profile_verified_info.payment_information_updated'));
                           });
                         }
                       })
                       .catch(() => {
                         this.setState({ cardLoading: false }, () => {
                           Alert.error(LocalizationService.formatMessage('user_profile_verified_info.payment_method_invalid_card'));
                         });
                       });
    });
  }

  render() {
    let body = '';

    if (this.state.loading) {
      body = <Loading />;
    }
    else {
      let paymentMethods = (<Placeholder />);

      if (this.state.sources.length > 0) {
        paymentMethods = this.state.sources.map((source, index) => {
          return <PaymentMethod key={ source.id } source={ source } reloadData={ this.reloadData } isDefault={ index === 0 }/>;
        })
      }

      body = (
        <div className="col-xs-12 no-side-padding">
          <FormPanel title={ LocalizationService.formatMessage('user_profile_verified_info.payment_methods') } >
            { paymentMethods }
          </FormPanel>

          <FormPanel title={ LocalizationService.formatMessage('user_profile_verified_info.add_card') } >
            <PaymentMethodForm addPaymentSource={ this.addPaymentSource }/>
          </FormPanel>

          <div className='col-xs-12 no-side-padding save-button'>
            <Button className="btn btn-primary text-center col-xs-12 col-sm-3 pull-right"
                    spinner={ this.state.cardLoading }
                    disabled={ this.state.cardLoading }
                    onClick={ this.addPaymentSource } >
              { LocalizationService.formatMessage('application.add_card') }
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className='dashboard-section'>
        <div className='col-xs-12 no-side-padding review-title'>
          <span className='main-text-color title'>
            { LocalizationService.formatMessage('dashboard.payment_methods') }
          </span>
        </div>
        { body }
      </div>
    )
  }
}

export default injectStripe(UserPaymentMethods)
