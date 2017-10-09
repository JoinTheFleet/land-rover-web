import React, { Component } from 'react';

import './App.css';

import Constants from './miscellaneous/constants';
import Header from './components/layout/header';
import HeaderTopMenu from './components/layout/header_top_menu';
import Footer from './components/layout/footer';
import Homescreen from './components/home/homescreen';
import Homefeed from './components/homefeed/homefeed';
import Login from './components/authentication/login';
import ListingsOverview from './components/listings/listings_overview';

import AuthenticationService from './shared/services/authentication_service';
import client from './shared/libraries/client';
import Cookies from 'universal-cookie';

import Helpers from './miscellaneous/helpers';

const cookies = new Cookies();
const navigationSections = Constants.navigationSections();
const userRoles = Constants.userRoles();
const listingsFiltersTypes = Constants.listingFiltersTypes();
const types = Constants.types();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: cookies.get('accessToken'),
      currentUserRole: userRoles.renter,
      currentSelectedView: navigationSections.home,
      currentSearchParams: {},
      openModals: []
    };

    if (this.state.accessToken && this.state.accessToken.length > 0) {
      client.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.accessToken;
    }

    this.toggleModal = this.toggleModal.bind(this);
    this.setAccessToken = this.setAccessToken.bind(this);
    this.addSearchParams = this.addSearchParams.bind(this);
    this.removeSearchParams = this.removeSearchParams.bind(this);
    this.setCurrentSearchParams = this.setCurrentSearchParams.bind(this);
    this.changeCurrentUserRole = this.changeCurrentUserRole.bind(this);
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

  setCurrentSearchParams(searchParams) {
    let location = this.state.currentSearchParams.location;
    let startDate = this.state.currentSearchParams.startDate;
    let endDate = this.state.currentSearchParams.endDate;

    this.setState({
      currentSearchParams: Helpers.extendObject(searchParams, { location: location, startDate: startDate, endDate: endDate })
    });
  }

  addSearchParams(searchParams) {
    let newSearchParams = this.state.currentSearchParams;
    let searchParamsToAdd = searchParams || {};
    let searchParamValue;

    for(var key in searchParamsToAdd) {
      searchParamValue = searchParamsToAdd[key];

      if (listingsFiltersTypes[key] === types.array) {
        if ( !newSearchParams[key] ) {
          newSearchParams[key] = [];
        }

        if ( newSearchParams[key].indexOf(searchParamValue) < 0 ) {
          newSearchParams[key].push(searchParamValue);
        }
      }
      else {
        newSearchParams[key] = searchParamValue;
      }
    }

    this.setState({ currentSearchParams: newSearchParams });
  }

  removeSearchParams(searchParams) {
    let newSearchParams = this.state.currentSearchParams;
    let searchParamsToRemove = searchParams || {};
    let searchParamValue;

    for(var key in searchParamsToRemove) {
      if(newSearchParams[key]) {
        searchParamValue = searchParamsToRemove[key];

        if (listingsFiltersTypes[key] === types.array) {
          newSearchParams[key].splice(newSearchParams[key].indexOf(searchParamValue), 1);
        }
        else {
          delete newSearchParams[key];
        }
      }
    }

    this.setState({ currentSearchParams: newSearchParams });
  }

  changeCurrentUserRole() {
    this.setState((prevState) => ({
      currentUserRole: (prevState.currentUserRole === userRoles.renter) ? userRoles.owner : userRoles.renter
    }));
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

  renderHeaderTopMenu() {
    let headerTopMenu = '';

    if (this.state.accessToken) {
      headerTopMenu = (<HeaderTopMenu currentMenuItem={ this.state.currentSelectedView }
                                      currentUserRole={ this.state.currentUserRole }
                                      handleMenuItemSelect={ this.handleMenuItemSelect } />)
    }

    return headerTopMenu;
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
        viewToRender = (<ListingsOverview></ListingsOverview>);
        break;
      case navigationSections.account:
        break;
      default:
        if (this.state.accessToken && this.state.accessToken !== '' ) {
          viewToRender = (<Homefeed accessToken={ this.state.accessToken } setCurrentSearchParams={ this.setCurrentSearchParams } />);
        }
        else {
          viewToRender = (<Homescreen addSearchParamHandler={ this.addSearchParams } />);
        }
    }

    return viewToRender;
  }

  render() {
    return (
      <div className="App">
        <Header loggedIn={ this.state.accessToken && this.state.accessToken.length > 0 }
                currentUserRole={ this.state.currentUserRole }
                currentMenuItem={ this.state.currentSelectedView }
                handleMenuItemSelect={ this.handleMenuItemSelect }
                toggleModal={ this.toggleModal }
                handleChangeCurrentUserRole={ this.changeCurrentUserRole } />

        { this.renderHeaderTopMenu() }

        <div id="main_container">
          { this.renderMainContent() }
        </div>

        <Login open={this.state.openModals.indexOf('login') > -1} setAccessToken={this.setAccessToken} toggleModal={this.toggleModal}/>

        <Footer />
      </div>
    );
  }
}
