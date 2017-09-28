import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '../miscellaneous/constants';
import HeaderMenu from './header_menu'

import logo from '../../assets/images/menu_logo.png';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state =  {
      menuOpen: false
    }
  }

  toggleMenu() {
    this.setState((prevState) => { return {menuOpen: !prevState.menuOpen} })
  }

  render() {
    let hideSearchForm = this.props.currentMenuItem === Constants.navigationSections().homescreen;

    return (
      <div className="app-header">
        <img src={logo} alt="fleet logo" className="header-logo" />
        <form id="header_search_form" className={ 'global-search-form' + (hideSearchForm ? ' hide' : '') }>
          <input type="text" name="global_search[location]" id="global_search_location" placeholder="Location" />
          <input type="text" name="global_search[dates]" id="global_search_dates" placeholder="Dates" />
        </form>
        <div className="pull-right hidden-xs header-right-options">
          <a id="header_list_car_link" className="header-right-option white-text" onClick={() => { this.props.handleMenuItemSelect('listings') }}>List your car</a>
          <a id="header_login_link" className="header-right-option white-text" onClick={() => { this.props.handleMenuItemSelect('login') }}>Log in</a>
          <a id="header_register_link" className="header-right-option white-text" onClick={() => { this.props.handleMenuItemSelect('register') }}>Sign up</a>
        </div>
        <HeaderMenu menuOpen={this.state.menuOpen} />
      </div>
    );
  }
}

Header.propTypes = {
  currentMenuItem: PropTypes.string.isRequired,
  handleMenuItemSelect: PropTypes.func.isRequired
}
