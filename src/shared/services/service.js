import client from '../libraries/client';

class Service {
  static get baseURL() {
    return '';
  }

  static get paramKey() {
    return '';
  }

  static index() {
    return client.get(this.baseURL);
  }

  static show(id) {
    return client.get(this.baseURL + id);
  }

  static create(params) {
    return client.post(this.baseURL, this.ensure_params_has_key(params));
  }

  static update(id, params) {
    return client.put(this.baseURL + id, this.ensure_params_has_key(params));
  }

  static destroy(id) {
    return client.delete(this.baseURL + id);
  }

  static ensure_params_has_key(params) {
    if (!params[this.paramKey] && this.paramKey.length > 0) {
      let newParams = {};
      newParams[this.paramKey] = params;

      return newParams;
    }
    return params;
  }
}

export default Service;
