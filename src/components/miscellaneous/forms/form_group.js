import React, { Component } from 'react';

export default class FormGroup extends Component {
  render() {
    return (
      <div className='col-xs-12'>
        <div className='row form-row'>
          <div className='col-xs-2'>
            <span>{ this.props.placeholder }</span>
          </div>
          <div className='col-xs-10'>
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}
