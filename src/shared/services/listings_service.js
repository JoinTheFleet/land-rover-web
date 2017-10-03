import client from '../libraries/client';
import bearer_client from '../libraries/client';

const listingsURL = '/api/v1/listings';

class ListingsService {
  static listings() {
    return bearer_client.get(listingsURL);
  }
}

export default ListingsService;
