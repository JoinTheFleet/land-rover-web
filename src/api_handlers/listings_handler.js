import axios from 'axios';

const listingsUrl = process.env.REACT_APP_API_HOST + '/api/v1/listings'

class ListingsHandler {
  static listings(accessToken, successCallback, errorCallback) {
    axios.get(listingsUrl, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })
    .then(function(response){
      successCallback(response);
    })
    .catch(function(error){
      errorCallback(error);
    });
  }
}

export default ListingsHandler;
