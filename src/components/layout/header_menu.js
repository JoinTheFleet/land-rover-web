import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import Anime from 'react-anime';
import Helpers from '../miscellaneous/helpers';
import Constants from '../miscellaneous/constants';

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
    let items = [navigationSections.home, navigationSections.signup, navigationSections.login];
    let itemsWithDivider = ['home'];
    let itemsWithModal = ['login'];

    if(this.props.accessToken){
      items = [navigationSections.home, navigationSections.profile,
               navigationSections.bookings,navigationSections.messages,
               navigationSections.listings, navigationSections.account,
               navigationSections.logout];
      itemsWithDivider = [navigationSections.home, navigationSections.listings];
    }

    for(var i = 0; i < items.length; i++) {
      let item = items[i];

      menuItems.push(
        (<div key={'header_menu_' + item} className="menu-item">
          <span className={this.props.currentMenuItem === item ? 'secondary-text-color' : ''}
                onClick={() => {(itemsWithModal.indexOf(item) > -1) ? this.props.toggleModal(item) : this.props.handleMenuItemSelect(item);}} >
            <FormattedMessage id={'menu.' + item} />
          </span>
        </div>)
      );

      if(itemsWithDivider.indexOf(item) > -1) {
        menuItems.push(
          <div key={'header_menu_' + item + '_divider'} className="menu-divider smoke-grey-two"></div>
        );
      }
    }

    return (
      <div id="header_menu" className="col-xs-12 white terciary-text-color" style={{height: (Helpers.pageHeight() - 80) + 'px'}}>
        {menuItems}
      </div>
    )
  }

  render() {
    return (
      <Anime easing="easeOutQuart"
             duration={500}
             opacity={this.state.open ? 1 : 0}>
        {this.renderMenu()}
      </Anime>
    )
  }
}
