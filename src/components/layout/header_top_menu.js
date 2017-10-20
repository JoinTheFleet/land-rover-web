import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';

import Menus from '../../miscellaneous/menus';

export default class HeaderTopMenu extends Component {
  render() {
    let menu = <div></div>;

    if (this.props.loggedIn) {
      let menuItems = Menus.getTopMenuForUserRole(this.props.currentUserRole);
      let menuItemsWithDivider = Menus.getTopMenuDividers();
      let itemHasDivider;
      let divider;
      let className;


      menu = (
        <div id="header_top_menu" className="white tertiary-text-color">
          <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
            {
              menuItems.map((menuItem) => {
                itemHasDivider = menuItemsWithDivider.indexOf(menuItem) >= 0;
                divider = itemHasDivider ? (<div className="header-top-menu-divider tertiary-color"></div>) : '';

                className = 'header-top-menu-item';
                className += this.props.currentMenuItem === menuItem ? ' secondary-text-color' : '';
                className += itemHasDivider ? ' with-divider' : '';

                return (
                  <div key={ 'top_bar_menu_item_' + menuItem }
                      className={ className }
                      onClick={ () => { this.props.handleMenuItemSelect(menuItem) } } >
                    <FormattedMessage id={ 'menu.' + menuItem } ></FormattedMessage>
                    { divider }
                  </div>);
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
  currentMenuItem: PropTypes.string,
  currentUserRole: PropTypes.string.isRequired,
  handleMenuItemSelect: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired
}
