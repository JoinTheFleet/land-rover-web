import client from '../libraries/client';
import Service from './service';

class ListingBumpsService extends Service {
  static get baseURL() {
    return '/api/v1/listings/:listing_id/bumps/';
  }

  static create(id) {
    return client.post(this.baseURL.replace(':listing_id', id));
  }
}

export default ListingBumpsService;
