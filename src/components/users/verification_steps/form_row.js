import React, { Component } from 'react';
import FormField from '../../miscellaneous/forms/form_field';

export default class FormRow extends Component {
  render() {
    return (
      <div className='col-xs-12 no-side-padding form-element'>
        <div className='row form-row'>
          <div className='col-xs-12 text-left form-label'>
            <span>{ this.props.placeholder }</span>
          </div>
          <div className='col-xs-12 form-field'>
            <FormField {...this.props } />
          </div>
        </div>
      </div>
    )
  }
}
