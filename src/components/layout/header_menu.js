import React, { Component } from 'react';

import { FormattedMessage } from 'react-intl';

import Toggleable from '../miscellaneous/toggleable';

import Helpers from '../../miscellaneous/helpers';
import Constants from '../../miscellaneous/constants';

import CloseOnEscape from 'react-close-on-escape';

import { NavLink } from 'react-router-dom';

const navigationSections = Constants.navigationSections();

export default class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.menuOpen || false
    };

    this.renderMenu = this.renderMenu.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.menuOpen || false
    });
  }

  renderMenu() {
    let menuItems = [];
    let items = [
      navigationSections.home,
      navigationSections.signup,
      navigationSections.login
    ];
    let itemsWithDivider = ['home'];
    let itemsWithModal = ['login', 'signup', 'logout'];

    if (this.props.loggedIn) {
      items = [
        navigationSections.home,
        navigationSections.profile,
        navigationSections.bookings,
        navigationSections.messages,
        navigationSections.notifications,
        navigationSections.listings,
        navigationSections.calendar,
        navigationSections.account,
        navigationSections.logout
      ];
      itemsWithDivider = [
        navigationSections.home,
        navigationSections.calendar
      ];
    }

    for(var i = 0; i < items.length; i++) {
      let item = items[i];

      menuItems.push(
        (<div key={'header_menu_' + item} className="menu-item">
          <NavLink  to={ `/${item}`}
                    activeClassName={ 'secondary-text-color' }
                    onClick={ (event) => {
                      if (itemsWithModal.indexOf(item) > -1) {
                        event.preventDefault();
                        this.props.toggleModal(item);
                      }
                      else {
                        this.props.handleMenuItemSelect(item);
                      }
                    }} >
            <FormattedMessage id={'menu.' + item} />
          </NavLink>
        </div>)
      );

      if (itemsWithDivider.indexOf(item) > -1) {
        menuItems.push(
          <div key={'header_menu_' + item + '_divider'} className="menu-divider smoke-grey-two"></div>
        );
      }
    }

    return (
      <div id="header_menu" className="col-xs-12 white tertiary-text-color" style={{height: (Helpers.pageHeight() - 80) + 'px'}}>
        {menuItems}
      </div>
    )
  }

  render() {
    return (
      <CloseOnEscape onEscape={ () =>  {this.props.toggleModal(this.props.currentMenuItem)} }>
        <Toggleable open={ this.state.open }>
          { this.renderMenu() }
        </Toggleable>
      </CloseOnEscape>
    )
  }
}
