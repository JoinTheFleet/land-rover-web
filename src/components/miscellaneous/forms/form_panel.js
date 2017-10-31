import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FormPanel extends Component {
  render() {
    return (
      <div className={ `${this.props.className} col-xs-12` }>
        <div className='col-xs-12'>
          <div className="panel-form row">
            <div className='col-xs-12 form-header'>
              { this.props.title }
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
