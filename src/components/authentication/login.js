import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import FacebookLogin from 'react-facebook-login';
import Anime from 'react-anime';

import AuthenticationService from '../../shared/services/authentication_service';
import emailIcon from '../../assets/images/email.png';

import Modal from '../miscellaneous/modal';

const facebookAppID = process.env.REACT_APP_FACEBOOK_APP_ID;
class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedLoginMode: '',
      modalOpen: this.props.open,
      errors: []
    };

    this.addError = this.addError.bind(this);
    this.handleErrorOnLogin = this.handleErrorOnLogin.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.open !== this.props.open) {
      this.setState({
        modalOpen: this.props.open
      });
    }
  }

  setSelectedLoginMode(mode) {
    this.setState({
      selectedLoginMode: mode,
      errors: []
    }, () => {
      if (this.state.selectedLoginMode === '') {
        document.getElementById('login_username').value = '';
        document.getElementById('login_password').value = '';
      }
    });
  }

  handleLoginButtonClick() {
    let username = document.getElementById('login_username').value;
    let password = document.getElementById('login_password').value;

    AuthenticationService.login(username, password)
                         .then(this.handleSuccessfulLogin)
                         .catch(this.handleErrorOnLogin);
  }

  handleFacebookLogin(response) {
    AuthenticationService.loginWithFacebook(response)
                          .then(this.handleSuccessfulLogin)
                          .catch(this.handleErrorOnLogin);
  }

  handleSuccessfulLogin(response) {
    let accessToken = response.data.data.token.access_token;

    this.setSelectedLoginMode('');
    this.props.setAccessToken(accessToken);
  }

  handleErrorOnLogin(error) {
    this.addError(this.props.intl.formatMessage({
      id: 'errors.authentication.unable_to_log_in'
    }));
  }

  addError(error) {
    if (error === '') {
      return;
    }

    let errors = this.state.errors;
    errors.push(error);

    this.setState({
      errors: errors
    });
  }

  renderErrors() {
    if (this.state.errors.length === 0) {
      return;
    }

    return (
      <div className="alert alert-danger">
        {
          this.state.errors.map((error, index) => {
            return (<div key={ 'login_error_' + (index + 1) }>{ error }</div>)
          })
        }
      </div>
    )
  }

  render() {
    return (
      <Modal open={ this.state.modalOpen }
             modalName={ 'login' }
             title={ this.props.intl.formatMessage({id: 'authentication.log_in_to_continue'}) }
             toggleModal={ this.props.toggleModal }
             errors={ this.state.errors } >
        <FacebookLogin appId={facebookAppID}
                       autoLoad={false}
                       fields="name,email,picture"
                       icon="fa-facebook"
                       cssClass="login-with-facebook-btn login-btn-with-icon btn facebook-color white-text text-secondary-font-weight fs-18"
                       textButton={ this.props.intl.formatMessage({id: 'authentication.log_in_with_facebook'}) }
                       callback={ this.handleFacebookLogin }
                       onClick={ () => { this.setSelectedLoginMode('facebook') } } />

        <div className="divider with-text">
          <div className="divider-line tertiary-color"></div>
          <div className="divider-text white tertiary-text-color text-secondary-font-weight ls-dot-two text-center">
            <FormattedMessage id="authentication.or_continue_with" />
          </div>
        </div>

        <Anime easing="easeOutQuart"
               duration={500}
               height={ this.state.selectedLoginMode === 'email' ? (150 + 'px') : 0 }>
          <div className="login-with-email-form-div">
            <form>
              <input type="text" required={true} name="login[email]" id="login_username" className="form-control text-secondary-font-weight fs-18" placeholder={ this.props.intl.formatMessage({id: 'authentication.email_address'}) }></input>
              <input type="password" required={true} name="login[password]" id="login_password" className="form-control text-secondary-font-weight fs-18" placeholder={ this.props.intl.formatMessage({id: 'authentication.password'}) }></input>
            </form>
          </div>
        </Anime>

        <button className="login-with-email-btn login-btn-with-icon btn secondary-color white-text text-secondary-font-weight fs-18"
                onClick={ () => {
                  if (this.state.selectedLoginMode !== 'email') {
                    this.setSelectedLoginMode('email');
                  }
                  else {
                    this.handleLoginButtonClick();
                  }
                }}>
          <i><img src={emailIcon} alt="email-icon" /></i>
          <FormattedMessage id="authentication.log_in_with_email" />
        </button>

        <div className="divider">
          <div className="divider-line tertiary-color"></div>
        </div>

        <div id="dont_have_account_message" className="text-center tertiary-text-color text-secondary-font-weight fs-18">
          <FormattedMessage id="authentication.dont_have_account" />
          <FormattedMessage id="menu.signup" >
            { (message) => (
              <span className="secondary-text-color subtitle-font-weight">
                {message}
              </span>
            ) }
          </FormattedMessage>
        </div>
      </Modal>
    )
  }
}

export default injectIntl(Login);

Login.propTypes = {
  setAccessToken: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired
};
