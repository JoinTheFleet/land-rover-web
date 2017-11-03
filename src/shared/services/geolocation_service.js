var geolocation = require('geolocation');

var googleMapsClient = require('@google/maps').createClient({
  key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
});

class GeolocationService {
  static getCurrentPosition() {
    return new Promise(function(resolve, reject) {
      geolocation.getCurrentPosition(function(error, position) {
        if (error) {
          reject(error);
        }
        else {
          resolve(position);
        }
      });
    });
  }

  static getLocationFromPosition(position) {
    return new Promise(function(resolve, reject) {
      googleMapsClient.reverseGeocode({ latlng: `${position.latitude},${position.longitude}` }, function(err, response) {
        if (!err) {
          resolve(response.json.results);
        }
        else {
          reject(err);
        }
      });
    });
  }
}

export default GeolocationService;
