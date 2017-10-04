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

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleMenuItemSelect = this.handleMenuItemSelect.bind(this);
  }

  toggleMenu() {
    this.setState((prevState) => { return {menuOpen: !prevState.menuOpen} })
  }

  toggleModal(item) {
    this.setState({menuOpen: false});
    this.props.toggleModal(item);
  }

  handleMenuItemSelect(item) {
    this.props.handleMenuItemSelect(item);
    this.setState({menuOpen: false});
  }

  render() {
    let hideSearchForm = this.props.currentMenuItem === Constants.navigationSections().home;

    return (
      <div className="app-header">
        <img src={logo} alt="fleet logo" className="header-logo" onClick={() => {this.toggleMenu()}} />

        <form id="header_search_form" className={ 'global-search-form' + (hideSearchForm ? ' hide' : '') }>
          <input type="text" name="global_search[location]" id="global_search_location" placeholder="Location" />
          <input type="text" name="global_search[dates]" id="global_search_dates" placeholder="Dates" />
        </form>

        <div className={'pull-right hidden-xs header-right-options' + (this.props.loggedIn ? ' hide' : '')}>
          <a id="header_list_car_link" className="header-right-option static-link white-text" onClick={() => { this.props.handleMenuItemSelect('listings') }}>List your car</a>
          <a id="header_login_link" className="header-right-option static-link white-text" onClick={() => { this.toggleModal('login') }}>Log in</a>
          <a id="header_register_link" className="header-right-option static-link white-text" onClick={() => { this.props.handleMenuItemSelect('register') }}>Sign up</a>
        </div>

        <HeaderMenu loggedIn={this.props.loggedIn}
                    menuOpen={this.state.menuOpen}
                    currentMenuItem={this.props.currentMenuItem}
                    handleMenuItemSelect={this.handleMenuItemSelect}
                    toggleModal={this.toggleModal} />
      </div>
    );
  }
}

Header.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  currentMenuItem: PropTypes.string.isRequired,
  handleMenuItemSelect: PropTypes.func.isRequired
}
