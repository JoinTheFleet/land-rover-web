import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FontAwesome from 'react-fontawesome';

export default class Button extends Component {
  render() {
    let accessory = this.props.accessory;

    if (this.props.spinner) {
      accessory = <FontAwesome name={ this.props.spinnerClass || 'spinner' }
                               tag='i'
                               spin />
    }

    return (
      <button className={ `${this.props.className} btn-icon btn` }
              onClick={ this.props.onClick }
              disabled={ this.props.disabled }>
        { accessory }
        { this.props.children }
      </button>
    );
  }
}

Button.propTypes = {
  disabled: PropTypes.bool,
  spinner: PropTypes.bool,
  spinnerClass: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  accessory: PropTypes.element
};
