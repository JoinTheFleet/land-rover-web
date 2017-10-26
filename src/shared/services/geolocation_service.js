var geolocation = require('geolocation');

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
      if (!window.google) {
        reject();
      }

      let geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: position }, function(results, status) {
        if (status === 'OK') {
          resolve(results);
        }
        else {
          reject();
        }
      });
    });
  }
}

export default GeolocationService;
