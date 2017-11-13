import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Dropdown, MenuItem } from 'react-bootstrap';

import Constants from '../../miscellaneous/constants';

const userManagementViews = Constants.userManagementViews();

export default class UserProfileMenu extends Component {
  renderProfileMenuItems(dropdown = false) {
    let menuKeys = Object.keys(userManagementViews);

    const menuItems = menuKeys.map(key => {
        let menuItem = userManagementViews[key];
        let link = '';

        if (menuItem.url) {
          link = (
            <a key={`user_management_view_${key}`} href={ menuItem.url } target={ '_blank' }>
              <FormattedMessage id={'user_profile_menu.' + menuItem.key} />
            </a>
          )
        }
        else {
          link = (
            <MenuItem key={`user_management_view_${key}`}
                      eventKey={key}
                      active={ false }
                      onClick={ () => { } }>
              <NavLink exact to={ menuItem.path } activeClassName='secondary-text-color'>
                <FormattedMessage id={'user_profile_menu.' + menuItem.key} />
              </NavLink>
            </MenuItem>
          )
        }

        if (dropdown) {
          return link;
        }

        return (
          <div key={'header_menu_' + menuItem.key} className="menu-item">
            { link }
          </div>
        );
      }
    );

    if (dropdown) {
      return (
        <Dropdown.Menu> { menuItems } </Dropdown.Menu>
      )
    }

    return (
      <div className="hidden-xs col-sm-12 no-side-padding">
        { menuItems }
      </div>
    )
  }

  render() {
    const menuKeys = Object.keys(userManagementViews);
    const selectedView = userManagementViews[menuKeys.filter(key => userManagementViews[key].path === window.location.pathname)].key;

    return (
      <div className="col-xs-12 no-side-padding">
        <div className="visible-xs col-xs-12 no-side-padding">
          <div className="user-management-header-menu smoke-grey col-xs-12">
              <Dropdown key='user_management_view_select'
                        id='user_management_view_select'>

              <Dropdown.Toggle className='secondary-color white-text fs-12'>
                <FormattedMessage id={'user_profile_menu.' + selectedView} />
              </Dropdown.Toggle>

              { this.renderProfileMenuItems(true) }
            </Dropdown>
          </div>
        </div>

        { this.renderProfileMenuItems(false) }
      </div>
    )
  }
}
