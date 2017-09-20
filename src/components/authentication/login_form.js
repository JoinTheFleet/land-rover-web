import React, { Component } from 'react';

class LoginForm extends Component {

  constructor(props){
    super(props);

    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
  }

  handleLoginButtonClick(event) {
    event.preventDefault();

    let username = document.getElementById('login_username').value;
    let password = document.getElementById('login_password').value;

    this.props.handleLogin(username, password);
  }

  render() {
    return (
      <div>
        <form id="login_form">
          <div className="form-group">
            <label htmlFor="login_username">Username: </label>
            <input type="text" id="login_username" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="login_password">Password: </label>
            <input type="password" id="login_password" className="form-control" />
          </div>
          <div className="form-group">
            <button className="btn btn-primary" onClick={(event) => { this.handleLoginButtonClick(event) }}>Login</button>
          </div>
        </form>
      </div>
    )
  }

}

export default LoginForm;
