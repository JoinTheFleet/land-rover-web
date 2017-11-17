var googleMapsClient = require('@google/maps').createClient({
  key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
});

class GeolocationService {
  static getCurrentPosition() {
    return new Promise(function(resolve, reject) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
      else {
        console.log('geolocation not supported on this browser');
        resolve(null);
      }
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
