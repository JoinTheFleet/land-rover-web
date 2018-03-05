import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import FacebookLogin from 'react-facebook-login';
import Anime from 'react-anime';
import Alert from 'react-s-alert';

import AuthenticationService from '../../shared/services/authentication_service';
import UsersService from '../../shared/services/users/users_service';
import emailIcon from '../../assets/images/email.png';

import Modal from '../miscellaneous/modal';
import FormField from '../miscellaneous/forms/form_field';
import Button from '../miscellaneous/button';

import LocalizationService from '../../shared/libraries/localization_service';

const facebookAppID = process.env.REACT_APP_FACEBOOK_APP_ID;
export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      loading: false
    };

    this.addError = this.addError.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setLastName = this.setLastName.bind(this);
    this.setFirstName = this.setFirstName.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.handleModalError = this.handleModalError.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
    this.handleForgottenPasswordSubmit = this.handleForgottenPasswordSubmit.bind(this);
  }

  componentDidMount() {
    this.setSelectedLoginMode();
  }

  setSelectedLoginMode() {
    if (this.props.modalName === 'login') {
      this.setState({
        loginTitle: LocalizationService.formatMessage('authentication.log_in_to_continue'),
        user: {}
      });
    }
    else if (this.props.modalName === 'registration') {
      this.setState({
        loginTitle: undefined,
        user: {}
      });
    }
  }

  handleLoginButtonClick(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ loading: true });

    AuthenticationService.login(this.state.user.email, this.state.user.password)
                         .then(this.handleSuccessfulLogin)
                         .catch(this.handleModalError);
  }

  handleFacebookLogin(response) {
    if (response && response.name) {
      AuthenticationService.loginWithFacebook(response)
                            .then(this.handleSuccessfulLogin)
                            .catch(this.handleModalError);
    }
  }

  handleSuccessfulLogin(response) {
    this.setState({ loading: false });
    let accessToken = response.data.data.token.access_token;

    this.props.toggleModal('login');
    this.props.setAccessToken(accessToken);
  }

  addError(error) {
    this.setState({
      loading: false
    }, () => {
      Alert.error(error);
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

  registerUser(event) {
    if (event) {
      event.preventDefault();
    }

    let user = this.state.user;

    if (this.props.referralCode) {
      user.referral_code = this.props.referralCode;
    }

    if (user && user.first_name && user.last_name && user.email && user.password) {
      this.setState({
        loading: true
      }, () => {
        UsersService.create({
          user: user,
          referral_code: this.props.referralCode
        }).then(response => {
          if (response && response.data && response.data.data) {
            let data = response.data.data;
            if (data.user && data.token) {
              this.props.setAccessToken(data.token.access_token)
            }
            user.password = undefined;

            this.setState({
              user: user,
              loading: false,
              userCreated: true
            });
          }
        }).catch(this.handleModalError);
      });
    }
    else {
      this.addError(LocalizationService.formatMessage('authentication.fill_in_all_fields'));
    }
  }

  handleModalError(error) {
    this.setState({
      loading: false
    }, () => {
      if (error && error.response) {
        let response = error.response;

        if (response && response.data && response.data.message) {
          this.addError(response.data.message);
        }
      }
    });
  }

  handleForgottenPasswordSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    let user = this.state.user;

    if (user && user.email) {
      this.setState({
        loading: true
      }, () => {
        UsersService.resetPassword(user.email)
                    .then(response => {
                      this.setState({
                        loading: false
                      }, () => {
                        this.props.toggleModal('email');
                      });
                    }).catch(this.handleModalError);
      });
    }
  }

  renderRegistrationReferralCode() {
    let referralCode = '';

    if (this.props.referralCode) {
      referralCode = (
        <FormField disabled
                   value={ this.props.referralCode }
                   className='form-control text-secondary-font-weight fs-18'
                   type='text' />
      )
    }

    return referralCode;
  }

  renderRegistrationModalBody() {
    let user = this.state.user;

    return (
      <form onSubmit={ this.registerUser }>
        <Anime easing="easeOutQuart"
               duration={3000}
               opacity={1}>
          <div className="modal_form registration_form">

              <FormField id='registration_first_name'
              disabled={ this.state.loading }
                         value={ user.first_name }
                         handleChange={ this.setFirstName }
                         placeholder={ LocalizationService.formatMessage('user_profile.first_name') }
                         className='form-control text-secondary-font-weight fs-18'
                         type='text' />
              <FormField id='registration_last_name'
                         value={ user.last_name }
                         disabled={ this.state.loading }
                         handleChange={ this.setLastName }
                         placeholder={ LocalizationService.formatMessage('user_profile.last_name') }
                         className='form-control text-secondary-font-weight fs-18'
                         type='text' />
              <FormField id='registration_email'
                         value={ user.email }
                         disabled={ this.state.loading }
                         handleChange={ this.setEmail }
                         placeholder={ LocalizationService.formatMessage('user_profile_verified_info.email') }
                         className='form-control text-secondary-font-weight fs-18'
                         type='text' />
              <FormField id='registration_password'
                         value={ user.password }
                         disabled={ this.state.loading }
                         handleChange={ this.setPassword }
                         placeholder={ LocalizationService.formatMessage('authentication.password') }
                         className='form-control text-secondary-font-weight fs-18'
                         type='password' />
              { this.renderRegistrationReferralCode() }
          </div>
          <Button className='white-text secondary-color text-secondary-font-weight fs-18'
                  onClick={ this.registerUser }
                  spinner={ this.state.loading }
                  disabled={ this.state.loading } >
            { LocalizationService.formatMessage('authentication.register') }
          </Button>

          <div className="divider with-text">
            <div className="divider-line tertiary-color"></div>
            <div className="divider-text white tertiary-text-color text-secondary-font-weight ls-dot-two text-center">
              <FormattedMessage id="authentication.or_continue_with" />
            </div>
          </div>

          <FacebookLogin appId={facebookAppID}
                       autoLoad={false}
                       fields="name,email,picture"
                       icon="fa-facebook"
                       cssClass="login-with-facebook-btn btn-icon btn facebook-color white-text text-secondary-font-weight fs-18"
                       textButton={ LocalizationService.formatMessage('authentication.register_facebook') }
                       callback={ this.handleFacebookLogin }
                       onClick={ () => { this.props.toggleModal('registration') } } />

          <div className="divider">
            <div className="divider-line tertiary-color"></div>
          </div>

          <div id="dont_have_account_message" className="text-center tertiary-text-color text-secondary-font-weight fs-18">
            { LocalizationService.formatMessage('authentication.already_have_account') }
            <br className="visible-xs" />
            <a>
              <span className="secondary-text-color subtitle-font-weight"
                    onClick={ () =>  {this.props.toggleModal('login') }}>
                { ` ${LocalizationService.formatMessage('menu.login')}` }
              </span>
            </a>
          </div>
        </Anime>
      </form>
    );
  }

  renderForgottenPasswordBody() {
    return (
      <form onSubmit={ this.handleForgottenPasswordSubmit }>
        <Anime easing="easeOutQuart"
               duration={ 500 }
               opacity={ 1 }>
           <div className="modal_form">
               <FormField id='login_username'
                          value={ this.state.user.email }
                          handleChange={ this.setEmail }
                          placeholder={ LocalizationService.formatMessage('authentication.email_address') }
                          className='form-control text-secondary-font-weight fs-18'
                          disabled={ this.state.loading }
                          type='text' />
           </div>
           <Button className="secondary-color white-text text-secondary-font-weight fs-18"
                   spinner={ this.state.loading }
                   disabled={ this.state.loading }>
             { LocalizationService.formatMessage('authentication.password_reset') }
           </Button>
           <div className="divider">
             <div className="divider-line tertiary-color"></div>
           </div>

           <div id="dont_have_account_message" className="text-center tertiary-text-color text-secondary-font-weight fs-18">
             <FormattedMessage id="authentication.dont_have_account" />
             <br className="visible-xs" />
             <FormattedMessage id="menu.signup" >
               { (message) => (
                 <a>
                  <span className="secondary-text-color subtitle-font-weight"
                        onClick={ () =>  {this.props.toggleModal('registration') }}>
                    {` ${message}`}
                  </span>
                 </a>
               ) }
             </FormattedMessage>
           </div>
        </Anime>
      </form>
    );
  }

  renderLoginModalBody() {
    let loginMessage = this.props.modalName === 'email' ?
                          LocalizationService.formatMessage('authentication.log_in') :
                          LocalizationService.formatMessage('authentication.log_in_with_email');

    let emailAccessory = (
      <i><img src={emailIcon} alt="email icon" /></i>
    );

    let email = (
      <Button className="secondary-color white-text text-secondary-font-weight fs-18"
              onClick={ () => { this.props.toggleModal('email') }}
              accessory={ emailAccessory }>
        { loginMessage }
      </Button>
    );

    if (this.props.modalName === 'email') {
      email = (
        <form onSubmit={ this.handleLoginButtonClick }>
          <Anime easing="easeOutQuart"
                 duration={ 500 }
                 opacity={ 1 }>
             <div className="modal_form">
                 <FormField id='login_username'
                            value={ this.state.user.email }
                            handleChange={ this.setEmail }
                            placeholder={ LocalizationService.formatMessage('authentication.email_address') }
                            className='form-control text-secondary-font-weight fs-18'
                            disabled={ this.state.loading }
                            type='text' />
                 <FormField id='login_password'
                            value={ this.state.user.password }
                            handleChange={ this.setPassword }
                            placeholder={ LocalizationService.formatMessage('authentication.password') }
                            className='form-control text-secondary-font-weight fs-18'
                            disabled={ this.state.loading }
                            type='password' />
             </div>
             <Button className="secondary-color white-text text-secondary-font-weight fs-18"
                     spinner={ this.state.loading }
                     disabled={ this.state.loading }>
               { loginMessage }
             </Button>
             <div className='row'>
               <div className='col-xs-12 modal_link text-center secondary-text-color subtitle-font-weight' onClick={ () => { this.props.toggleModal('forgotten-password'); }}>
                 { LocalizationService.formatMessage('authentication.forgot_password') }
               </div>
             </div>
          </Anime>
        </form>
      );
    }

    return (
      <div>
        <FacebookLogin appId={facebookAppID}
                       autoLoad={false}
                       fields="name,email,picture"
                       icon="fa-facebook"
                       cssClass="login-with-facebook-btn btn-icon btn facebook-color white-text text-secondary-font-weight fs-18"
                       textButton={ LocalizationService.formatMessage('authentication.log_in_with_facebook') }
                       callback={ this.handleFacebookLogin }
                       onClick={ () => { this.props.toggleModal('facebook') } } />

        <div className="divider with-text">
          <div className="divider-line tertiary-color"></div>
          <div className="divider-text white tertiary-text-color text-secondary-font-weight ls-dot-two text-center">
            <FormattedMessage id="authentication.or_continue_with" />
          </div>
        </div>

        { email }

        <div className="divider">
          <div className="divider-line tertiary-color"></div>
        </div>

        <div id="dont_have_account_message" className="text-center tertiary-text-color text-secondary-font-weight fs-18">
          <FormattedMessage id="authentication.dont_have_account" />
          <br className="visible-xs" />
          <FormattedMessage id="menu.signup" >
            { (message) => (
              <a>
                <span className="secondary-text-color subtitle-font-weight"
                      onClick={ () =>  {this.props.toggleModal('registration') }}>
                  {` ${message}`}
                </span>
              </a>
            ) }
          </FormattedMessage>
        </div>
      </div>
    );
  }

  render() {
    let loginModalBody = '';

    if (this.state.userCreated) {
      if (this.props.scope) {
        if (this.props.scope === 'owner') {
          return <Redirect to={{
            pathname: '/listings/new',
            state: {
              onboarding: true
            }
          }} />;
        }
        else {
          return <Redirect to={{
            pathname: '/dashboard',
            state: {
              onboarding: true
            }
          }} />;
        }
      }
      else {
        return <Redirect to={{
          pathname: '/dashboard',
          state: {
            onboarding: true,
            natural: true
          }
        }} />;
      }
    }

    switch (this.props.modalName) {
      case 'registration':
        loginModalBody = this.renderRegistrationModalBody();
        break;
      case 'signup':
        loginModalBody = this.renderRegistrationModalBody();
        break;
      case 'forgotten-password':
        loginModalBody = this.renderForgottenPasswordBody();
        break;
      default:
        loginModalBody = this.renderLoginModalBody();
    }

    return (
      <Modal open={ this.props.modalName && this.props.modalName.length > 0 }
             modalName={ this.props.modalName }
             title={ this.state.loginTitle }
             toggleModal={ this.props.toggleModal } >
        { loginModalBody }
      </Modal>
    )
  }
}

Login.propTypes = {
  setAccessToken: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired
};
