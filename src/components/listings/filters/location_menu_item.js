import React, { Component } from 'react';
import { MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class LocationMenuItem extends Component {
  render() {
    return (
      <MenuItem eventKey={ this.props.location.id } onClick={ (menuItem) => { this.props.handleLocationSelect(this.props.location) } }>{ this.props.location.name }</MenuItem>
    )
  }
}

LocationMenuItem.propTypes = {
  location: PropTypes.object.isRequired,
}
