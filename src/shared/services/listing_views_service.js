import client from '../libraries/client';
import Service from './service';

class ListingPreviewService extends Service {
  static get baseURL() {
    return '/api/v1/listings/:listing_id/views/';
  }

  static index(id) {
    return client.post(this.baseURL.replace(':listing_id', id));
  }
}

export default ListingPreviewService;
