import client from '../libraries/client';
import Service from './service';

class ListingSpotlightsService extends Service {
  static get baseURL() {
    return '/api/v1/listings/:listing_id/spotlights/';
  }

  static create(id) {
    return client.post(this.baseURL.replace(':listing_id', id));
  }
}

export default ListingSpotlightsService;
