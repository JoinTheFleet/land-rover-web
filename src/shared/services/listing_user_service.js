import client from '../libraries/client';
import Service from './service';

class ListingUserService extends Service {
  static get baseURL() {
    return '/api/v1/listings/:listing_id/user';
  }

  static show(id, params) {
    return client.get(this.baseURL.replace(':listing_id', id));
  }

  static get actions() {
    return {
      show: true
    }
  }
}

export default ListingUserService;
