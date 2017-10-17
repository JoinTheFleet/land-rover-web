import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import FormField from './form_field';

class FormRow extends Component {
  render() {
    return (
      <div className='col-xs-12'>
        <div className='row form-row'>
          <div className='col-xs-2'>
            <span>{ this.props.placeholder }</span>
          </div>
          <div className='col-xs-10'>
            <FormField focused={ this.props.focused } handleFocusChange={ this.props.handleFocusChange } handleChange={ this.props.handleChange } type={ this.props.type } id={ this.props.id } value={ this.props.value } placeholder={ this.props.placeholder } />
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(FormRow)
