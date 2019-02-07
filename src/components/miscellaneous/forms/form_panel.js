import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FormPanel extends Component {
  render() {
    let button = '';

    if (this.props.button) {
      button = (
        <div>
          { this.props.button }
        </div>
      )
    }

    return (
      <div className={ `${this.props.className} col-xs-12 no-side-padding` }>
        <div className='col-xs-12 no-side-padding'>
          <div className="panel-form row">
            <div className='col-xs-12 form-header'>
              { this.props.title }
              { button }
            </div>
            <div className='col-xs-12 form-body'>
              { this.props.children }
            </div>
          </div>
        </div>
      </div>
    );
  }
}


FormPanel.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string
}
