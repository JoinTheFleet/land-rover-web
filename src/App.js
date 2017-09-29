import React, { Component } from 'react';

import './App.css';

import Header from './components/layout/header';
import Footer from './components/layout/footer';
import AuthenticationHandler from './api_handlers/authentication_handler';
import LoginForm from './components/authentication/login_form';
import Cookies from "universal-cookie";
import Homescreen from './components/home/homescreen';

const cookies = new Cookies();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: cookies.get('accessToken'),
      currentSelectedView: 'home',
      currentSearchParams: {}
    }

    this.addSearchParam = this.addSearchParam.bind(this);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleMenuItemSelect = this.handleMenuItemSelect.bind(this);
  }

  handleLogin(username, password) {
    AuthenticationHandler.login(username, password, (response) => {
      let accessToken = response.data.data.token.access_token;

      this.setState({ accessToken: accessToken }, () => {
        cookies.set('accessToken', accessToken);
      });
    }, (error) => {
      alert(error);
    })
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

  renderMainContent() {
    if(this.state.accessToken && this.state.accessToken !== ''){
      return (
        <Homescreen accessToken={this.state.accessToken} addSearchParamHandler={this.addSearchParam} />
      )
    }
    else {
      return (
        <LoginForm handleLogin={this.handleLogin} />
      )
    }
  }

  render() {
    return (
      <div className="App">
        <Header accessToken={this.state.accessToken}
                currentMenuItem={this.state.currentSelectedView}
                handleMenuItemSelect={this.handleMenuItemSelect} />
        <div id="main_container">
          { this.renderMainContent() }
        </div>
        <Footer />
      </div>
    );
  }
}
