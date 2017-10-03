import axios from 'axios';

export const client = axios.create({
  baseURL: process.env.REACT_APP_API_HOST
});

export const bearer_client = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
});

if (!client.defaults.params) {
  client.defaults.params = {};
}

client.defaults.params.client_id = process.env.REACT_APP_API_CLIENT_ID;
client.defaults.params.client_secret = process.env.REACT_APP_API_CLIENT_SECRET;

if (!bearer_client.defaults.params) {
  bearer_client.defaults.params = {};
}

bearer_client.defaults.params.client_id = process.env.REACT_APP_API_CLIENT_ID;
bearer_client.defaults.params.client_secret = process.env.REACT_APP_API_CLIENT_SECRET;

export default client;
