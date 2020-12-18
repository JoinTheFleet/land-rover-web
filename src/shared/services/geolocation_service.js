import MapboxGeocoder from '@mapbox/mapbox-sdk/services/geocoding';
const geocoder = MapboxGeocoder({ accessToken: process.env.REACT_APP_MAPBOX_MAPS_API_KEY });
// var googleMapsClient = require('@google/maps').createClient({
//   key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
// });

class GeolocationService {
  static getCurrentPosition() {
    return new Promise( (resolve, reject) => {
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
    return new Promise((resolve, reject) => {
      geocoder.reverseGeocode({ query: [position.longitude, position.latitude] })
      .send()
      .then((response) => {
        if (
          response &&
          response.body &&
          response.body.features &&
          response.body.features.length
        ) {
          var feature = response.body.features[0];
          resolve(feature);
        }
      });
      // googleMapsClient.reverseGeocode({ latlng: `${position.latitude},${position.longitude}` }, function(err, response) {
      //   if (!err) {
      //     resolve(response.json.results);
      //   }
      //   else {
      //     reject(err);
      //   }
      // });
    });
  }
}

export default GeolocationService;
