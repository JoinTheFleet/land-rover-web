import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom'

import Menus from '../../miscellaneous/menus';

import UsersService from '../../shared/services/users/users_service';

export default class HeaderTopMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        listing_count: 0
      }
    };

    this.fetchUser = this.fetchUser.bind(this);
  }

  componentWillMount() {
    if (this.props.loggedIn) {
      this.fetchUser();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn && nextProps.loggedIn !== this.props.loggedIn) {
      this.fetchUser();
    }
  }

  fetchUser() {
    UsersService.show('me')
                .then(response => {
                  this.setState({ user: response.data.data.user });
                });
  }

  render() {
    let menu = <div></div>;

    if (this.props.loggedIn) {
      let menuItems = Menus.getTopMenuForUserRole(this.props.currentUserRole, this.state.user);
      let menuItemsWithDivider = Menus.getTopMenuDividers();
      let itemHasDivider = false;
      let divider = '';
      let className = '';

      menu = (
        <div id="header_top_menu" className="white tertiary-text-color">
          <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
            {
              menuItems.map((menuItem) => {
                itemHasDivider = menuItemsWithDivider.indexOf(menuItem) >= 0;

                divider = itemHasDivider ? (<div className="header-top-menu-divider tertiary-color hidden-xs"></div>) : '';

                className = 'header-top-menu-item';
                className += itemHasDivider ? ' with-divider' : '';

                return (
                  <NavLink key={ 'top_bar_menu_item_' + menuItem }
                           className={ className }
                           activeClassName={ 'secondary-text-color' }
                           to={ `/${menuItem}`}>
                    <FormattedMessage id={ 'menu.' + menuItem } />
                    { divider }
                  </NavLink>
                )
              })
            }
          </div>
        </div>
      )
    }

    return menu;
  }
}

HeaderTopMenu.propTypes = {
  currentUserRole: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired
}
