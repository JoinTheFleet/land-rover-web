import React, { Component } from 'react';
import './App.css';
import Header from './components/layout/header'
import AuthenticationHandler from './api_handlers/authentication_handler'
import LoginForm from './components/authentication/login_form'
import Cookies from "universal-cookie";
import ListingList from './components/listings/listing_list'
import ListingsHandler from './api_handlers/listings_handler'

const cookies = new Cookies();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: cookies.get('accessToken')
    }

    this.handleLogin = this.handleLogin.bind(this);
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

  renderMainContent() {
    if(this.state.accessToken && this.state.accessToken !== ''){
      return (
        <ListingList accessToken={this.state.accessToken} listingsHandler={ListingsHandler} />
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
        <Header />
        <div id="main_container">
          { this.renderMainContent() }
        </div>
      </div>
    );
  }
}

export default App;
