import React, { Component } from 'react';

export default class FormGroup extends Component {
  render() {
    return (
      <div className='col-xs-12 no-side-padding'>
        <div className='row form-row'>
          <div className='col-xs-12 col-sm-2 text-sm-right'>
            <span>{ this.props.placeholder }</span>
          </div>
          <div className='col-xs-12 col-sm-10'>
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}
