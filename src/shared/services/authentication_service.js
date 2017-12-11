import client from '../libraries/client';
import Cookies from "universal-cookie";

const cookies = new Cookies();

class AuthenticationService {
  static login(username, password) {
    return client.post('/oauth/token', {
      grant_type: 'password',
      username: username,
      password: password,
      scopes: 'basic'
    });
  }

  static loginWithFacebook(facebookResponse) {
    let names = facebookResponse.name.split(' ');

    return client.post('/oauth/token', {
      grant_type: 'facebook',
      facebook_access_token: facebookResponse.accessToken,
      user: {
        email: facebookResponse.email,
        first_name: names[0],
        last_name: names[names.length - 1],
        image_url: facebookResponse.picture.data.url
      },
      scopes: 'basic'
    });
  }

  static logout() {
    return client.post('/oauth/revoke', {
      token: cookies.get('accessToken')
    });
  }
}

export default AuthenticationService;
