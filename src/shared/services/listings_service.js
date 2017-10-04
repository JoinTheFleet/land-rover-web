import Service from './service';

class ListingsService extends Service {
  static get baseURL() {
    return '/api/v1/listings/';
  }

  static get paramKey() {
    return 'listing';
  }
}

export default ListingsService;
