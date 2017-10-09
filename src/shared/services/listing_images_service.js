import client from '../libraries/client';
import Service from './service';

class ListingImagesService extends Service {
  static get baseURL() {
    return '/api/v1/listings/:listing_id/images/';
  }

  static index(id, start_at, end_at) {
    return client.get(this.baseURL.replace(':listing_id', id));
  }

  static create(id, url) {
    return client.post(this.baseURL.replace(':listing_id', id), {
      image_url: url
    });
  }

  static destroy(id, image_id) {
    return client.delete(this.baseURL.replace(':listing_id', id) + image_id)
  }
}

export default ListingImagesService;
