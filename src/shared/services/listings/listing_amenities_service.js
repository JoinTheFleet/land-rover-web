import client from '../../libraries/client';
import Service from '../service';

class ListingAmenitiesService extends Service {
  static get baseURL() {
    return '/api/v1/listings/amenities/';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default ListingAmenitiesService;
