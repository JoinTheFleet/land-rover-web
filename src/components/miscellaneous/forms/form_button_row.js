import React, { Component } from 'react';

export default class FormButtonRow extends Component {
  render() {
    return (
      <div className='col-xs-12 no-side-padding button-row'>
        { this.props.children }
      </div>
    )
  }
}
