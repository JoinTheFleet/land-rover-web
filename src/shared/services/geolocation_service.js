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
      })
    });
  }
};

export default GeolocationService;
