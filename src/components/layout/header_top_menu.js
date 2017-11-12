import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom'

import Menus from '../../miscellaneous/menus';

export default class HeaderTopMenu extends Component {
  render() {
    let menu = <div></div>;

    if (this.props.loggedIn) {
      let menuItems = Menus.getTopMenuForUserRole(this.props.currentUserRole);
      let menuItemsWithDivider = Menus.getTopMenuDividers();
      let itemHasDivider = false;
      let divider = '';
      let className = '';

      menu = (
        <div id="header_top_menu" className="white tertiary-text-color hidden-xs">
          <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
            {
              menuItems.map((menuItem) => {
                if (this.props.currentUserRole === 'owner') {
                  itemHasDivider = menuItemsWithDivider.indexOf(menuItem) >= 0;
                }

                divider = itemHasDivider ? (<div className="header-top-menu-divider tertiary-color"></div>) : '';

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
