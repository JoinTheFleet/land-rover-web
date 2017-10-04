import client from '../libraries/client';

class Service {
  static get baseURL() {
    return '';
  }

  static index(params) {
    return client.get(this.baseURL, params);
  }

  static show(id, params) {
    return client.get(this.baseURL + id, params);
  }

  static create(params) {
    return client.post(this.baseURL, params);
  }

  static update(id, params) {
    return client.put(this.baseURL + id, params);
  }

  static destroy(id, params) {
    return client.delete(this.baseURL + id, params);
  }
}

export default Service;
