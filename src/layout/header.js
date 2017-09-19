import React, { Component } from 'react';
import logo from './logo.svg';
import FacebookLogin from 'react-facebook-login';

const responseFacebook = (response) => {
  console.log(response);
}

class Header extends Component {
  render() {
    return (
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
        <FacebookLogin appId="1088597931155576" autoLoad={true} fields="name,email,picture" icon="fa-facebook" callback={responseFacebook} />
      </div>
    );
  }
}

export default Header;
