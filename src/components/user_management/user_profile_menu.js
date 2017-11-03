import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import Constants from '../../miscellaneous/constants';

const userManagementViews = Constants.userManagementViews();

export default class UserProfileMenu extends Component {
  render() {
    let menuKeys = Object.keys(userManagementViews);

    return (
      <div className="col-xs-12 no-side-padding">
        {
          menuKeys.map((key, index) => {
            let menuItem = userManagementViews[key];

            return (
              <div key={'header_menu_' + menuItem.key} className="menu-item">
                <span className={ this.props.currentViewKey === menuItem.key ? 'secondary-text-color' : ''}
                      onClick={ () => {
                        if (menuItem.url) {
                          window.open(menuItem.url)
                        }
                        else {
                          this.props.handleMenuClick(menuItem.key);
                        }
                      }} >
                  <FormattedMessage id={'user_profile_menu.' + menuItem.key} />
                </span>
              </div>);
          })
        }
      </div>
    )
  }
}
