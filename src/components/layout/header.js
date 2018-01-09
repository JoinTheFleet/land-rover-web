import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HeaderMenu from './header_menu';
import Modal from '../miscellaneous/modal';
import LocationPeriodFilter from '../listings/filters/location_period_filter';

import LocalizationService from '../../shared/libraries/localization_service';

import logo from '../../assets/images/menu_logo.png';
import searchIcon from '../../assets/images/search_icon.png';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state =  {
      menuOpen: false,
      showSearchModal: false
    };

    this.closeMenu = this.closeMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleSearchModal = this.toggleSearchModal.bind(this);
    this.handleMenuItemSelect = this.handleMenuItemSelect.bind(this);
  }

  closeMenu() {
    this.setState({menuOpen: false});
  }

  toggleMenu() {
    this.setState((prevState) => ({ menuOpen: !prevState.menuOpen }));
  }

  toggleModal(item) {
    this.setState({menuOpen: false});
    this.props.toggleModal(item);
  }

  toggleSearchModal() {
    this.setState(prevState => ({ showSearchModal: !prevState.showSearchModal }));
  }

  handleMenuItemSelect(item) {
    this.setState({ menuOpen: false });
  }

  render() {
    let mobileSearchIcon = '';

    if ( !this.props.hideSearchForm ) {
      mobileSearchIcon = (
        <div className="header-search-mobile-icon visible-xs pull-right">
          <img src={searchIcon} alt="search" onClick={ this.toggleSearchModal } />
        </div>
      )
    }

    return (
      <div className="app-header">
        <img src={logo} alt="fleet logo" className="header-logo" onClick={ () => { this.toggleMenu() }} />

        <LocationPeriodFilter {...this.props} hideSearchForm={ this.props.hideSearchForm } closeMenu={ this.closeMenu }/>

        { mobileSearchIcon }

        <div className={'pull-right header-right-options' + (this.props.loggedIn ? ' hide' : '') }>
          <a id="header_list_car_link" className="header-right-option static-link white-text" onClick={ () => { this.toggleModal('registration'); }}> { LocalizationService.formatMessage('header.list_your_car') } </a>
          <a id="header_login_link" className="hidden-xs header-right-option static-link white-text" onClick={ () => { this.toggleModal('login'); }}> { LocalizationService.formatMessage('header.log_in') } </a>
          <a id="header_register_link" className="hidden-xs header-right-option static-link white-text" onClick={ () => { this.toggleModal('registration'); }}> { LocalizationService.formatMessage('header.sign_up') } </a>
        </div>

        <HeaderMenu loggedIn={ this.props.loggedIn }
                    menuOpen={ this.state.menuOpen }
                    handleMenuItemSelect={ this.handleMenuItemSelect }
                    toggleModal={ this.toggleModal } />

        <Modal open={ this.state.showSearchModal }
               title="Search"
               closeButtonPosition="right"
               modalClass="header-search-form-mobile"
               toggleModal={ this.toggleSearchModal }>

          <LocationPeriodFilter {...this.props}
                                handleSearch={ () => { this.toggleSearchModal(); this.props.handleSearch(); } }
                                hideSearchForm={ this.props.hideSearchForm }
                                closeMenu={ this.closeMenu }/>
        </Modal>
      </div>
    );
  }
}

Header.propTypes = {
  loggedIn: PropTypes.bool,
  currentUserRole: PropTypes.string,
  handleMenuItemSelect: PropTypes.func.isRequired
}
