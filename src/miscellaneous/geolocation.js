export default class Geolocation {

  /* Returns a pair of values for latitude and longitude, representing the center point of a given list of pairs of latitude/longitude */
  static getCoordinatesCenter(coordinatesList) {
    if (!coordinatesList) {
      return [];
    }

    let coordinates, lat, lng;
    let x, y, z;
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;

    // Run through all pairs of coordinates, as they will need to be processed one by one
    for(let i = 0; i < coordinatesList.length; i++) {
      coordinates = coordinatesList[i];

      // Convert latitude/longitude from degrees to radians
      lat = (coordinates.latitude || coordinates[0]) * Math.PI / 180;
      lng = (coordinates.longitude || coordinates[1]) * Math.PI / 180;

      // Convert latitude/longitude to Cartesian coordinates
      x = Math.cos(lat) * Math.cos(lng);
      y = Math.cos(lat) * Math.sin(lng);
      z = Math.sin(lat);

      // Sum up the coordinates found (x, y, z)
      sumX += x;
      sumY += y;
      sumZ += z;
    }

    // Find the average coordinates (x, y, z)
    let finalX = sumX / coordinatesList.length;
    let finalY = sumY / coordinatesList.length;
    let finalZ = sumZ / coordinatesList.length;

    // Convert average coordinates to latitude and longitude (converting from radians to degress as well)
    let avgLat = (Math.atan2(finalZ, Math.sqrt(Math.pow(finalX,2) + Math.pow(finalY, 2)))) * (180 / Math.PI);
    let avgLng = (Math.atan2(finalY, finalX)) * (180 / Math.PI);

    return { latitude: avgLat, longitude: avgLng };
  }

  static getLocationFromListing(listing) {
    let latitude = 0;
    let longitude = 0;

    if (listing.location) {
      latitude = listing.location.latitude;
      longitude = listing.location.longitude;
    }
    else if (listing.geometry && listing.geometry.bounds) {
      let northeast = listing.geometry.bounds.northeast;
      let southwest = listing.geometry.bounds.southwest;

      latitude = (northeast.latitude + southwest.latitude) / 2;
      longitude = (northeast.longitude + southwest.longitude) / 2;
    }

    return {
      latitude: latitude,
      longitude: longitude
    };
  }
}
