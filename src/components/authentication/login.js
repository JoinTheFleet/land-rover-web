import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import FacebookLogin from 'react-facebook-login';
import Anime from 'react-anime';
import AuthenticationHandler from '../../api_handlers/authentication_handler';

import emailIcon from '../../assets/images/email.png';

class Login extends Component {

  constructor(props){
    super(props);

    this.state = {
      selectedLoginMode: ''
    }

    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
  }

  componentDidUpdate() {
    document.getElementById('login_modal').style.display = this.props.open ? 'block' : 'none';
  }

  handleLoginButtonClick(event) {
    event.preventDefault();

    let username = document.getElementById('login_username').value;
    let password = document.getElementById('login_password').value;

    AuthenticationHandler.login(username, password, (response) => {
      let accessToken = response.data.data.token.access_token;

      this.props.setAccessToken(accessToken);
    }, (error) => {
      alert(error);
    });
  }

  setSelectedLoginMode(mode) {
    this.setState({selectedLoginMode: mode});
  }

  handleFacebookLogin(){

  }

  render() {
    return (
      <div id="login_modal" className="modal fade in" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <p className="title-font-weight fs-28">
              <FormattedMessage id="authentication.log_in_to_continue" />
            </p>

            <FacebookLogin appId="1088597931155576"
                           autoLoad={true}
                           fields="name,email,picture"
                           icon="fa-facebook"
                           cssClass="login-with-facebook-btn login-btn-with-icon btn facebook-color white-text text-secondary-font-weight fs-18"
                           textButton={this.props.intl.formatMessage({id: 'authentication.log_in_with_facebook'})}
                           callback={this.handleFacebookLogin}
                           onClick={() => {this.setSelectedLoginMode('facebook')}} />

            <div className="divider with-text">
              <div className="divider-line terciary-color"></div>
              <div className="divider-text white terciary-text-color text-secondary-font-weight ls-dot-two text-center">
                <FormattedMessage id="authentication.or_continue_with" />
              </div>
            </div>

            <Anime easing="easeOutQuart"
                   duration={500}
                   height={this.state.selectedLoginMode === 'email' ? (150 + 'px') : 0}>
              <div className="login-with-email-form-div">
                <form>
                  <input type="text" name="login[email]" className="form-control text-secondary-font-weight fs-18" placeholder={this.props.intl.formatMessage({id: 'authentication.email_address'})}></input>
                  <input type="text" name="login[password]" className="form-control text-secondary-font-weight fs-18" placeholder={this.props.intl.formatMessage({id: 'authentication.password'})}></input>
                </form>
              </div>
            </Anime>

            <button className="login-with-email-btn login-btn-with-icon btn secondary-color white-text text-secondary-font-weight fs-18"
                    onClick={() => {this.setSelectedLoginMode('email')}}>
              <i><img src={emailIcon} /></i>
              <FormattedMessage id="authentication.log_in_with_email" />
            </button>

            <div className="divider">
              <div className="divider-line terciary-color"></div>
            </div>

            <div id="dont_have_account_message" className="text-center terciary-text-color text-secondary-font-weight fs-18">
              <FormattedMessage id="authentication.dont_have_account" />
              <FormattedMessage id="menu.signup" >
                {(message) => (
                  <span className="secondary-text-color subtitle-font-weight">
                    {message}
                  </span>
                )}
              </FormattedMessage>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default injectIntl(Login);

Login.propTypes = {
  setAccessToken: PropTypes.func.isRequired
};
