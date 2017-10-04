import client from '../libraries/client';

const listingsURL = '/api/v1/listings/';

class ListingsService {
  static index() {
    return client.get(listingsURL);
  }

  static show(id) {
    return client.get(listingsURL + id);
  }

  static create(params) {
    return client.post(listingsURL, params);
  }

  static update(id, params) {
    return client.put(listingsURL + id, params);
  }

  static destroy(id) {
    return client.delete(listingsURL + id);
  }
}

export default ListingsService;
