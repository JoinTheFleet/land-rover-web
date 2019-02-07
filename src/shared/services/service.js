import client from '../libraries/client';

class Service {
  static get baseURL() {
    return '';
  }

  static get actions() {
    return {
      index: true,
      show: true,
      create: true,
      update: true,
      destroy: true
    }
  }

  static index(params) {
    return this.validatedAction('index', 'validatedIndex', params);
  }

  static validatedIndex(params) {
    return client.get(this.baseURL, {
      params: params
    });
  }

  static show(id, params) {
    return this.validatedAction('show', 'validatedShow', id, params);
  }

  static validatedShow(id, params) {
    return client.get(this.baseURL + (id || ''), {
      params: params
    });
  }

  static create(params) {
    return this.validatedAction('create', 'validatedCreate', params);
  }

  static validatedCreate(params) {
    return client.post(this.baseURL, params);
  }

  static update(id, params) {
    return this.validatedAction('update', 'validatedUpdate', id, params);
  }

  static validatedUpdate(id, params) {
    if (!(typeof(id) === 'string') && isNaN(id)) {
      params = id;
      id = '';
    }

    return client.put(this.baseURL + id, params);
  }

  static destroy(id, params) {
    let queryParams = undefined;

    if (params) {
      queryParams = {
        params: params
      };
    }

    return this.validatedAction('destroy', 'validatedDestroy', id, queryParams);
  }

  static validatedDestroy(id, params) {
    let deleteURL = this.baseURL + (id || '');

    if (params) {
      return client.delete(deleteURL, params);
    }
    else {
      return client.delete(deleteURL);
    }
  }

  static validAction(action) {
    return !this.actions || this.actions[action];
  }

  static validatedAction(action, callback) {
    if (this.validAction(action)) {
      // First 2 arguments are the action name and the callback name
      let applicationArguments = Array.prototype.slice.call(arguments, 2);
      let filteredArguments = applicationArguments.filter(argument => argument);

      return this[callback].apply(this, filteredArguments);
    }
    else {
      return Promise.reject(new Error('Invalid Action'));
    }
  }
}

export default Service;
