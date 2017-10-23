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
      errors: [],
      user: {}
    };

    this.addError = this.addError.bind(this);
    this.handleErrorOnLogin = this.handleErrorOnLogin.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setFirstName = this.setFirstName.bind(this);
    this.setLastName = this.setLastName.bind(this);
  }

  componentDidMount() {
    this.setSelectedLoginMode();
  }

  setSelectedLoginMode() {
    this.setState({
      errors: [],
    }, () => {
      if (this.props.modalName === 'login') {
        this.setState({
          loginTitle: this.props.intl.formatMessage({id: 'authentication.log_in_to_continue'}),
          user: {}
        });
      }
      else if (this.props.modalName === 'registration') {
        this.setState({
          loginTitle: undefined,
          user: {}
        });
      }
    });
  }

  handleLoginButtonClick() {
    AuthenticationService.login(this.state.user.email, this.state.user.password)
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

    this.props.toggleModal('login');
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

  setEmail(event) {
    let user = this.state.user;
    user.email = event.target.value;

    this.setState({ user: user });
  }

  setPassword(event) {
    let user = this.state.user;
    user.password = event.target.value;

    this.setState({ user: user });
  }

  setFirstName(event) {
    let user = this.state.user;
    user.first_name = event.target.value;

    this.setState({ user: user });
  }

  setLastName(event) {
    let user = this.state.user;
    user.last_name = event.target.value;

    this.setState({ user: user });
  }

  renderRegistrationModalBody() {
    let user = this.state.user;

    return (
      <Anime easing="easeOutQuart"
             duration={3000}
             opacity={1}>
        <div className="modal_form registration_form">
          <form>
            <FormField id='registration_first_name'
                       value={ user.first_name }
                       handleChange={ this.setFirstName }
                       placeholder={ this.props.intl.formatMessage({id: 'user_profile.first_name'}) }
                       className='form-control text-secondary-font-weight fs-18'
                       type='text' />
            <FormField id='registration_last_name'
                       value={ user.last_name }
                       handleChange={ this.setLastName }
                       placeholder={ this.props.intl.formatMessage({id: 'user_profile.last_name'}) }
                       className='form-control text-secondary-font-weight fs-18'
                       type='text' />
            <FormField id='registration_email'
                       value={ user.email }
                       handleChange={ this.setEmail }
                       placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.email'}) }
                       className='form-control text-secondary-font-weight fs-18'
                       type='text' />
            <FormField id='registration_password'
                       value={ user.password }
                       handleChange={ this.setPassword }
                       placeholder={ this.props.intl.formatMessage({id: 'authentication.password'}) }
                       className='form-control text-secondary-font-weight fs-18'
                       type='password' />
          </form>
        </div>
      </Anime>
    );
  }

  renderLoginModalBody() {
    let email = '';

    if (this.props.modalName === 'email') {
      email = (
        <Anime easing="easeOutQuart"
               duration={500}
               height={ this.props.modalName === 'email' ? (150 + 'px') : 0 }>
           <div className="modal_form">
             <form>
               <FormField id='login_username'
                          value={ this.state.user.email }
                          handleChange={ this.setEmail }
                          placeholder={ this.props.intl.formatMessage({id: 'authentication.email_address'}) }
                          className='form-control text-secondary-font-weight fs-18'
                          type='text' />
               <FormField id='login_password'
                          value={ this.state.user.password }
                          handleChange={ this.setPassword }
                          placeholder={ this.props.intl.formatMessage({id: 'authentication.password'}) }
                          className='form-control text-secondary-font-weight fs-18'
                          type='password' />
             </form>
           </div>
        </Anime>
      );
    }
    return (
      <div>
        <FacebookLogin appId={facebookAppID}
                       autoLoad={false}
                       fields="name,email,picture"
                       icon="fa-facebook"
                       cssClass="login-with-facebook-btn login-btn-with-icon btn facebook-color white-text text-secondary-font-weight fs-18"
                       textButton={ this.props.intl.formatMessage({id: 'authentication.log_in_with_facebook'}) }
                       callback={ this.handleFacebookLogin }
                       onClick={ () => { this.props.toggleModal('facebook') } } />

        <div className="divider with-text">
          <div className="divider-line tertiary-color"></div>
          <div className="divider-text white tertiary-text-color text-secondary-font-weight ls-dot-two text-center">
            <FormattedMessage id="authentication.or_continue_with" />
          </div>
        </div>

        { email }

        <button className="login-with-email-btn login-btn-with-icon btn secondary-color white-text text-secondary-font-weight fs-18"
                onClick={ () => {
                  if (this.props.modalName !== 'email') {
                    this.props.toggleModal('email');
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
                    onClick={ () =>  {this.props.toggleModal('registration') }}>
                {message}
              </span>
            ) }
          </FormattedMessage>
        </div>
      </div>
    );
  }

  render() {
    let loginModalBody = '';

    switch (this.props.modalName) {
      case 'registration':
        loginModalBody = this.renderRegistrationModalBody();
        break;
      default:
        loginModalBody = this.renderLoginModalBody();
    }

    return (
      <Modal open={ this.props.modalName && this.props.modalName.length > 0 }
             modalName={ this.props.modalName }
             title={ this.state.loginTitle }
             toggleModal={ this.props.toggleModal }
             errors={ this.state.errors } >
        { loginModalBody }
      </Modal>
    )
  }
}

export default injectIntl(Login);

Login.propTypes = {
  setAccessToken: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired
};
