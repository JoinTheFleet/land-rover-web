import axios from 'axios';
import bearer_client from '../libraries/client';

const listingsURL = '/api/v1/listings';

class ListingsService {
  static listings(successCallback, errorCallback) {
    bearer_client.get(listingsURL)
      .then(function(response) {
        successCallback(response);
      })
      .catch(function(error) {
        errorCallback(error);
      });
  }
}

export default ListingsService;
