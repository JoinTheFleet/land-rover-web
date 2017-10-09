import client from '../libraries/client';
import Service from './service';

class SearchService extends Service {
  static get baseURL() {
    return '/api/v1/search/';
  }

  static get actions() {
    return {
      create: true
    }
  }
}

export default SearchService;
