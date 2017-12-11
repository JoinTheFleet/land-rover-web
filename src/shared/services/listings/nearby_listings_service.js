import Service from '../service';

class NearbyListingsService extends Service {
  static get baseURL() {
    return '/api/v1/listings/nearby';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default NearbyListingsService;
