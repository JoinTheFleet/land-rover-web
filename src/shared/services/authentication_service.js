import client from '../libraries/client';
import bearer_client from '../libraries/client';

import Cookies from "universal-cookie";

const cookies = new Cookies();

class AuthenticationService {
  static login(username, password, successCallback, errorCallback) {
    client.post('/oauth/token', {
        grant_type: 'password',
        username: username,
        password: password,
        scopes: 'basic'
      })
      .then(function(response) {
        bearer_client.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.data.token.access_token;
        successCallback(response);
      })
      .catch(function(error) {
        errorCallback(error);
      });
  }

  static loginWithFacebook(facebookResponse, successCallback, errorCallback) {
    let names = facebookResponse.name.split(' ');

    client.post('/oauth/token', {
        grant_type: 'facebook',
        facebook_access_token: facebookResponse.accessToken,
        user: {
          email: facebookResponse.email,
          first_name: names[0],
          last_name: names[names.length - 1],
          image_url: facebookResponse.picture.data.url
        },
        scopes: 'basic'
      })
      .then(function(response) {
        bearer_client.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.data.token.access_token;
        successCallback(response);
      })
      .catch(function(error) {
        errorCallback(error);
      });
  }

  static logout(successCallback, errorCallback) {
    bearer_client.post('/oauth/revoke', {
        token: cookies.get('accessToken')
      })
      .then(function(response) {
        delete bearer_client.defaults.headers.common['Authorization'];
        successCallback(response);
      })
      .catch(function(error) {
        errorCallback(error);
      });
  }
}

export default AuthenticationService;
