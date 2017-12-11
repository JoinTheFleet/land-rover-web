import client from '../libraries/client';
import Service from './service';

class LocationsService extends Service {
  static get baseURL() {
    return '/api/v1/search/locations/';
  }

  static create(latitude, longitude, term) {
    let search = {};

    if (term) {
      search.term = term;
    }

    if (latitude && longitude) {
      search.latitude = latitude;
      search.longitude = longitude;
    }

    return client.post(this.baseURL, {
      search: search
    });
  }

  static location(latitude, longitude) {
    let search = {};

    if (latitude && longitude) {
      search.latitude = latitude;
      search.longitude = longitude
    }

    return client.post(this.baseURL, {
      search: search
    });
  }

  static term(term) {
    let search = {};

    if (term) {
      search.term = term;
    }

    return client.post(this.baseURL, {
      search: search
    })
  }
}

export default LocationsService;
