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
}

export default AuthenticationHandler;
