import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HeaderMenu from './header_menu';
import Modal from '../miscellaneous/modal';
import LocationPeriodFilter from '../listings/filters/location_period_filter';

import LocalizationService from '../../shared/libraries/localization_service';

import logo from '../../assets/images/menu_logo.png';
import searchIcon from '../../assets/images/search_icon.png';

import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UsersService from '../../shared/services/users/users_service';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state =  {
      menuOpen: false,
      showSearchModal: false,
      notificationsCount: 0,
      userId: '',
      isCompany: false 
    };

    this.closeMenu = this.closeMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleSearchModal = this.toggleSearchModal.bind(this);
    this.handleMenuItemSelect = this.handleMenuItemSelect.bind(this);
    this.updateNotificationCount = this.updateNotificationCount.bind(this);
  }

  componentDidMount() {
    this.props.eventEmitter.on('UPDATED_NOTIFICATIONS_COUNT', this.updateNotificationCount);
    this.createDashboardUrl();
  }

  updateNotificationCount(count, error) {
    this.setState({ notificationsCount: count });
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

  createDashboardUrl(){
    let accessToken = cookies.get('accessToken');

    if (accessToken) {
      UsersService.show('me').then(response => {
                      if(response.data.data.user.account_type === "company"){
                        this.state.isCompany = true 
                      }else{
                        this.state.isCompany = false
                      }
                      this.state.userId = response.data.data.user.id
                    });
    }

  }

  renderDashboardButton() {
    if (!this.state.isCompany) {
      return '';
    }else {
      let redirection_base_url = process.env.REACT_APP_API_HOST + '/vendors/dealer_dashboard?user_id=' + this.state.userId 
      return(
        <a id='header_list_car_link' className={`hidden-xs header-right-option static-link white-text header_list_dashboard_button ${!this.props.loggedIn ? 'hide' : ''}`} href={ redirection_base_url } target="_blank" rel="noreferrer"> Go To Your Dashboard</a>
      )
    }
  }

  render() {
    let mobileSearchIcon = '';

    if ( !this.props.hideSearchForm ) {
      mobileSearchIcon = (
        <div className="header-search-mobile-icon visible-xs visible-sm pull-right">
          <img src={searchIcon} alt="search" onClick={ this.toggleSearchModal } />
        </div>
      )
    }

    return (
      <div>
        <Modal open={ this.state.showSearchModal }
              modalClass="header-search-form-mobile hidden-md hidden-lg custom-modal"
              toggleModal={ this.toggleSearchModal }>

            <div class='row'>
              <div class='listing-form-field-group col-xs-12 no-side-padding'>
                <LocationPeriodFilter {...this.props}
                                      handleSearch={ () => { this.toggleSearchModal(); this.props.handleSearch(); } }
                                      hideSearchForm={ this.props.hideSearchForm }
                                      closeMenu={ this.closeMenu }/>
              </div>
            </div>
          </Modal>
          <div className="app-header">
            <img src={logo} alt="fleet logo" className="header-logo" onClick={ () => { this.toggleMenu() }} />

            <LocationPeriodFilter {...this.props} hideSearchForm={ this.props.hideSearchForm } closeMenu={ this.closeMenu }/>

            { mobileSearchIcon }

            <div className={'pull-right header-right-options'}>
              <Link id='header_list_car_link' className="header-right-option static-link white-text" to={ this.props.loggedIn ? '/listings/new' : '/owners' }>{ LocalizationService.formatMessage('header.list_your_car') }</Link>
              <DropdownButton id='learn-more' title={ LocalizationService.formatMessage('learn_more.learn_more') } bsStyle='primary' className={ `hidden-xs` } pullRight>
                <MenuItem eventKey="1" className={ this.props.loggedIn ? 'hide' : '' }>
                  <Link to='/owners'>{ LocalizationService.formatMessage('learn_more.earn_money') }</Link>
                </MenuItem>
                <MenuItem eventKey="2" className={ this.props.loggedIn ? 'hide' : '' }>
                  <Link to='/renters'>{ LocalizationService.formatMessage('learn_more.drive_on_fleet') }</Link>
                </MenuItem>
                <MenuItem divider className={ this.props.loggedIn ? 'hide' : '' } />
                <MenuItem eventKey="3" href={ process.env.REACT_APP_FLEET_SUPPORT_URL }>
                  { LocalizationService.formatMessage('learn_more.get_help') }
                </MenuItem>
                <MenuItem eventKey="4" href={ process.env.REACT_APP_MEDIUM_URL }>
                  { LocalizationService.formatMessage('learn_more.blog') }
                </MenuItem>
              </DropdownButton>

              <a id="header_login_link" className={ `hidden-xs header-right-option static-link white-text ${this.props.loggedIn ? 'hide' : ''}` } onClick={ () => { this.toggleModal('login'); }}> { LocalizationService.formatMessage('header.log_in') } </a>
              <a id="header_register_link" className={ `hidden-xs header-right-option static-link white-text ${this.props.loggedIn ? 'hide' : ''}` } onClick={ () => { this.toggleModal('registration'); }}> { LocalizationService.formatMessage('header.sign_up') } </a>
              <Link id='header_notification_link' className={ `header-right-option static-link white-text ${!this.props.loggedIn ? 'hide' : ''}` } to='/notifications'>
                <i className={ `fa fa-bell ${this.state.notificationsCount > 0 ? 'notification-badge' : '' }`} />
              </Link>
            </div>

            <HeaderMenu loggedIn={ this.props.loggedIn }
                        eventEmitter={ this.props.eventEmitter }
                        menuOpen={ this.state.menuOpen }
                        handleMenuItemSelect={ this.handleMenuItemSelect }
                        toggleModal={ this.toggleModal } />
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  loggedIn: PropTypes.bool,
  currentUserRole: PropTypes.string,
  handleMenuItemSelect: PropTypes.func.isRequired
}
