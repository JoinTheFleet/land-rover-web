import React, { Component } from 'react';

import './App.css';

import Constants from './miscellaneous/constants';
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import Homescreen from './components/home/homescreen';
import Homefeed from './components/homefeed/homefeed';
import Login from './components/authentication/login';
import AuthenticationService from './shared/services/authentication_service';
import client from './shared/libraries/client';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const navigationSections = Constants.navigationSections();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: cookies.get('accessToken'),
      currentSelectedView: navigationSections.home,
      currentSearchParams: {},
      openModals: []
    };

    if (this.state.accessToken && this.state.accessToken.length > 0) {
      client.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.accessToken;
    }

    this.toggleModal = this.toggleModal.bind(this);
    this.addSearchParam = this.addSearchParam.bind(this);
    this.setAccessToken = this.setAccessToken.bind(this);
    this.handleMenuItemSelect = this.handleMenuItemSelect.bind(this);
  }

  setAccessToken(accessToken) {
    cookies.remove('accessToken');

    let openModals = this.state.openModals;
    let newState = { accessToken: accessToken };

    openModals.splice(openModals.indexOf('login'), 1);
    newState[openModals] = openModals;

    this.setState(newState, () => {
      if(accessToken.length > 0){
        cookies.set('accessToken', accessToken);
        client.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
      }
      else {
        delete client.defaults.headers.common['Authorization'];
      }
    });
  }

  addSearchParam(searchParams) {
    let newSearchParams = this.state.currentSearchParams;
    let searchParamsToAdd = searchParams || {};

    for(var key in searchParamsToAdd) {
      newSearchParams[key] = searchParamsToAdd[key];
    }

    this.setState({ currentSearchParams: newSearchParams });
  }

  handleMenuItemSelect(menuItem) {
    if(menuItem === navigationSections.logout){
      AuthenticationService.logout()
                           .then((success) => {
                             this.setAccessToken('');
                           })
                           .catch((error) => {
                             alert(error);
                           });
    }
    else {
      this.setState({ currentSelectedView: menuItem });
    }
  }

  toggleModal(modal) {
    let openModals = this.state.openModals;
    let index = openModals.indexOf(modal);

    if(index > -1){
      openModals.splice(index, 1);
    }
    else {
      openModals.push(modal);
    }

    this.setState({openModals: openModals});
  }

  renderMainContent() {
    let viewToRender;

    switch(this.state.currentSelectedView) {
      case navigationSections.profile:
        break;
      case navigationSections.bookings:
        break;
      case navigationSections.messages:
        break;
      case navigationSections.listings:
        break;
      case navigationSections.account:
        break;
      default:
        if (this.state.accessToken && this.state.accessToken !== '' ) {
          viewToRender = (<Homefeed accessToken={this.state.accessToken} addSearchParamHandler={this.addSearchParam} />);
        }
        else {
          viewToRender = (<Homescreen addSearchParamHandler={this.addSearchParam} />);
        }
    }

    return viewToRender;
  }

  render() {
    return (
      <div className="App">
        <Header loggedIn={this.state.accessToken && this.state.accessToken.length > 0}
                currentMenuItem={this.state.currentSelectedView}
                handleMenuItemSelect={this.handleMenuItemSelect}
                toggleModal={this.toggleModal} />
        <div id="main_container">
          { this.renderMainContent() }
        </div>
        <Login open={this.state.openModals.indexOf('login') > -1} setAccessToken={this.setAccessToken} toggleModal={this.toggleModal}/>
        <Footer />
      </div>
    );
  }
}
