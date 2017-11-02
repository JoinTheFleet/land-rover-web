import React, {
  Component
} from 'react';

import Constants from '../../miscellaneous/constants';

import UserProfileDetails from './user_profile_details';
import UserProfileSettings from './user_profile_settings';
import UserProfileSupport from './user_profile_support';
import UserProfileTerms from './user_profile_terms';
import UserProfileVerifiedInfo from './user_profile_verified_info';
import UserProfileMenu from './user_profile_menu';
import UserPaymentMethods from './user_payment_methods';

import { Elements } from 'react-stripe-elements';

const userManagementViews = Constants.userManagementViews();

export default class UserManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentViewKey: 'profile_details',
      user: {}
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);
  }



  getViewToRender() {
    let viewToRender;

    switch(this.state.currentViewKey) {
      case userManagementViews.verified_info.key:
        viewToRender = (<UserProfileVerifiedInfo></UserProfileVerifiedInfo>);
        break;
      case userManagementViews.settings.key:
        viewToRender = (<UserProfileSettings></UserProfileSettings>);
        break;
      case userManagementViews.support.key:
        viewToRender = (<UserProfileSupport></UserProfileSupport>);
        break;
      case userManagementViews.payment_methods.key:
        viewToRender = (
          <Elements>
            <UserPaymentMethods />
          </Elements>
        );
        break;
      case userManagementViews.t_and_cs.key:
        viewToRender = (<UserProfileTerms></UserProfileTerms>);
        break;
      default:
        viewToRender = (<UserProfileDetails></UserProfileDetails>);
        break;
    }

    return viewToRender;
  }

  handleMenuClick(viewKey) {
    this.setState({currentViewKey: viewKey});
  }

  render() {
    return (
      <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 no-side-padding'>
        <div className='col-xs-12 col-sm-3'>
          <UserProfileMenu currentViewKey={this.state.currentViewKey} handleMenuClick={this.handleMenuClick}></UserProfileMenu>
        </div>
        <div className='col-xs-12 col-sm-9'>
          { this.getViewToRender() }
        </div>
      </div>
    )
  }
}
