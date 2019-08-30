import axios from 'axios';

import Constants from '../../miscellaneous/constants';

export const client = axios.create({
  baseURL: process.env.REACT_APP_API_HOST
});

if (!client.defaults.params) {
  client.defaults.params = {};
}

client.defaults.headers.common['API_VERSION_UPDATE'] = Constants.apiVersionUpdate();

client.defaults.params.client_id = process.env.REACT_APP_API_CLIENT_ID;
client.defaults.params.client_secret = process.env.REACT_APP_API_CLIENT_SECRET;

export default client;
