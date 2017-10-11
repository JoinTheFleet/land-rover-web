import client from '../../libraries/client';
import Service from '../service';

class UsersService extends Service {
  static get baseURL() {
    return '/api/v1/users/';
  }

  static get meURL() {
    return this.baseURL + 'me/';
  }

  static email(email) {
    return client.get(this.baseURL + 'email', {
      params: {
        email: email
      }
    });
  }

  static merge(facebookUID, facebookAccessToken) {
    return client.post(this.baseURL + 'merge', {
      params: {
        facebook_uid: facebookUID,
        facebook_access_token: facebookAccessToken
      }
    });
  }

  static resetPassword(email) {
    return client.post(this.baseURL + 'reset_password', {
      user: {
        email: email
      }
    });
  }

  static sendVerificationEmail() {
    return client.post(this.meURL + 'send_verification_email');
  }

  static password(currentPassword, newPassword) {
    return client.post(this.meURL + 'password', {
      user: {
        current_password: currentPassword,
        new_password: newPassword
      }
    });
  }

  static get actions() {
    return {
      create: true,
      update: true,
      show: true,
      index: false,
      destroy: false
    }
  }
}

export default UsersService;
