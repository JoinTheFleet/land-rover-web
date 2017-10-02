import axios from 'axios';

const authenticationUrl = process.env.REACT_APP_API_HOST + '/oauth'

class AuthenticationHandler {
  static login(username, password, successCallback, errorCallback) {
    axios.post(authenticationUrl + '/token', {
      grant_type: 'password',
      client_id: process.env.REACT_APP_API_CLIENT_ID,
      client_secret: process.env.REACT_APP_API_CLIENT_SECRET,
      username: username,
      password: password,
      scopes: 'basic'
    })
    .then(function(response){
      successCallback(response);
    })
    .catch(function(error){
      errorCallback(error);
    });
  }

  static loginWithFacebook(facebookResponse, successCallback, errorCallback){
    let names = facebookResponse.name.split(' ');

    axios.post(authenticationUrl + '/token', {
      grant_type: 'facebook',
      client_id: process.env.REACT_APP_API_CLIENT_ID,
      client_secret: process.env.REACT_APP_API_CLIENT_SECRET,
      facebook_access_token: facebookResponse.accessToken,
      user: {
        email: facebookResponse.email,
        first_name: names[0],
        last_name: names[names.length - 1],
        image_url: facebookResponse.picture.data.url
      },
      scopes: 'basic'
    })
    .then(function(response){
      console.log(response);
      successCallback(response);
    })
    .catch(function(error){
      errorCallback(error);
    });
  }
}

export default AuthenticationHandler;
