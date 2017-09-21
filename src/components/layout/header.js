import React, { Component } from 'react';
import logo from '../../assets/images/logo.png';

class Header extends Component {
  render() {
    return (
      <div className="app-header">
        <img src={logo} alt="fleet logo" className="header-logo" />
      </div>
    );
  }
}

export default Header;
