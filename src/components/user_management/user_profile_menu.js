import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

import Constants from '../../miscellaneous/constants';

const userManagementViews = Constants.userManagementViews();

export default class UserProfileMenu extends Component {
  render() {
    let menuKeys = Object.keys(userManagementViews);

    return (
      <div className="col-xs-12 no-side-padding">
        {
          menuKeys.map((key) => {
            let menuItem = userManagementViews[key];
            let link = '';

            if (menuItem.url) {
              link = (
                <a href={ menuItem.url } target={ '_blank' }>
                  <FormattedMessage id={'user_profile_menu.' + menuItem.key} />
                </a>
              )
            }
            else {
              link = (
                <NavLink exact to={
                  menuItem.path
                } activeClassName='secondary-text-color'>
                  <FormattedMessage id={'user_profile_menu.' + menuItem.key} />
                </NavLink>
              )
            }
            return (
              <div key={'header_menu_' + menuItem.key} className="menu-item">
                { link }
              </div>
            );
          })
        }
      </div>
    )
  }
}
