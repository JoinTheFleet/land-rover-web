import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import FormField from './form_field';

class FormRow extends Component {
  render() {
    return (
      <div className='col-xs-12 no-side-padding'>
        <div className='row form-row'>
          <div className='col-xs-12 col-sm-2 text-sm-right'>
            <span>{ this.props.placeholder }</span>
          </div>
          <div className='col-xs-12 col-sm-10'>
            <FormField {...this.props } />
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(FormRow)
