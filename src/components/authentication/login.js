import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import FacebookLogin from 'react-facebook-login';
import Anime from 'react-anime';

import AuthenticationService from '../../shared/services/authentication_service';
import emailIcon from '../../assets/images/email.png';

import Modal from '../miscellaneous/modal';
import FormField from '../miscellaneous/forms/form_field';

const facebookAppID = process.env.REACT_APP_FACEBOOK_APP_ID;
class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: this.props.open,
      errors: []
    };

    this.addError = this.addError.bind(this);
    this.handleErrorOnLogin = this.handleErrorOnLogin.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
    this.setUserName = this.setUserName.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  componentDidMount() {
    this.setSelectedLoginMode('login');
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
      if (mode === 'login') {
        this.setState({
          loginTitle: this.props.intl.formatMessage({id: 'authentication.log_in_to_continue'}),
          username: undefined,
          password: undefined
        });
      }
    });
  }

  handleLoginButtonClick() {
    AuthenticationService.login(this.state.username, this.state.password)
                         .then(this.handleSuccessfulLogin)
                         .catch(this.handleErrorOnLogin);

    this.setState({
      username: undefined,
      password: undefined
    });
  }

  handleFacebookLogin(response) {
    AuthenticationService.loginWithFacebook(response)
                          .then(this.handleSuccessfulLogin)
                          .catch(this.handleErrorOnLogin);
  }

  handleSuccessfulLogin(response) {
    let accessToken = response.data.data.token.access_token;

    this.setSelectedLoginMode('login');
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

  setUserName(event) {
    this.setState({
      username: event.target.value
    });
  }

  setPassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  render() {
    return (
      <Modal open={ this.state.modalOpen }
             modalName={ this.state.loginMode }
             title={ this.state.loginTitle }
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
              <FormField id='login_username'
                         value={ this.state.username }
                         handleChange={ this.setUserName }
                         placeholder={ this.props.intl.formatMessage({id: 'authentication.email_address'}) }
                         className='form-control text-secondary-font-weight fs-18'
                         type='text' />
              <FormField id='login_password'
                         value={ this.state.password }
                         handleChange={ this.setPassword }
                         placeholder={ this.props.intl.formatMessage({id: 'authentication.password'}) }
                         className='form-control text-secondary-font-weight fs-18'
                         type='password' />
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
              <span className="secondary-text-color subtitle-font-weight"
                    onClick={ () =>  {this.setSelectedLoginMode('registration') }}>
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
