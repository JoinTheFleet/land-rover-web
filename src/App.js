import React, { Component } from 'react';

import './App.css';

import Constants from './components/miscellaneous/constants';
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import Cookies from "universal-cookie";
import Homescreen from './components/home/homescreen';
import Login from './components/authentication/login';

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
    }

    this.toggleModal = this.toggleModal.bind(this);
    this.addSearchParam = this.addSearchParam.bind(this);
    this.setAccessToken = this.setAccessToken.bind(this);
    this.handleMenuItemSelect = this.handleMenuItemSelect.bind(this);
  }

  setAccessToken(accessToken) {
    let openModals = this.state.openModals;
    let newState = {accessToken: accessToken};

    openModals.splice(openModals.indexOf('login'), 1);
    newState[openModals] = openModals;

    this.setState(newState, () => {
      cookies.set('accessToken', accessToken);
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
    this.setState({ currentSelectedView: menuItem });
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
        viewToRender = (<Homescreen accessToken={this.state.accessToken} addSearchParamHandler={this.addSearchParam} />);
    }

    return viewToRender
  }

  render() {
    return (
      <div className="App">
        <Header accessToken={this.state.accessToken}
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
