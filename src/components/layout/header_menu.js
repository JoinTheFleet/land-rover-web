import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import Anime from 'react-anime';
import Helpers from '../miscellaneous/helpers';

export default class HeaderMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: this.props.menuOpen || false
    }

    this.renderMenu = this.renderMenu.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.menuOpen || false
    })
  }

  renderMenu() {
    let menuItems = [];
    let items = ['home', 'signup', 'login'];
    let itemsWithDivider = ['home'];

    if(this.props.accessToken){
      items = ['home', 'profile', 'bookings', 'messages', 'listings', 'account', 'logout'];
      itemsWithDivider = ['home', 'listings'];
    }

    for(var i = 0; i < items.length; i++){
      let item = items[i];

      menuItems.push(
        <div key={'header_menu_' + item}  className="menu-item">
          <span onClick={() => { this.props.handleMenuItemSelect(item) }} className={this.props.currentMenuItem === item ? 'secondary-text-color' : ''}>
            <FormattedMessage id={'menu.' + item} />
          </span>
        </div>
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
