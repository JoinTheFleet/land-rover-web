import React, { Component } from 'react';
import logo from '../../assets/images/logo.png';

class Header extends Component {
  render() {
    return (
      <div className="app-header">
        <img src={logo} alt="fleet logo" className="header-logo" />
        <form id="header_search_form">
          <input type="text" name="global_search[location]" id="global_search_location" placeholder="Location" />
          <input type="text" name="global_search[dates]" id="global_search_dates" placeholder="Dates" />
        </form>
      </div>
    );
  }
}

export default Header;
