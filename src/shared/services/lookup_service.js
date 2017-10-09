import client from '../libraries/client';
import Service from './service';

class LookupService extends Service {
  static get baseURL() {
    return '/api/v1/search/lookup/';
  }

  static create(latitude, longitude) {
    let search = {};

    if (latitude && longitude) {
      search.latitude = latitude;
      search.longitude = longitude
    }

    return client.post(this.baseURL, {
      search: search
    });
  }
}

export default LookupService;
