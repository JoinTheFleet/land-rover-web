import client from '../libraries/client';
import Service from './service';

class ListingConversationsService extends Service {
  static get baseURL() {
    return '/api/v1/listings/:listing_id/conversations';
  }

  static index(id, params) {
    return client.get(this.baseURL.replace(':listing_id', id), params);
  }
}

export default ListingConversationsService;
