export default class Geolocation {
  static getCoordinatesCenter(coordinatesList) {
    if(!coordinatesList) {
      return [];
    }

    let coordinates, lat, lng;
    let x, y, z;
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;

    for(let i = 0; i < coordinatesList.length; i++){
      coordinates = coordinatesList[i];

      lat = (coordinates.latitude || coordinates[0]) * Math.PI / 180;
      lng = (coordinates.longitude || coordinates[1]) * Math.PI / 180;

      x = Math.cos(lat) * Math.cos(lng);
      y = Math.cos(lat) * Math.sin(lng);
      z = Math.sin(lat);

      sumX += x;
      sumY += y;
      sumZ += z;
    }

    let finalX = sumX / coordinatesList.length;
    let finalY = sumY / coordinatesList.length;
    let finalZ = sumZ / coordinatesList.length;

    let avgLat = (Math.atan2(finalZ, Math.sqrt(Math.pow(finalX,2) + Math.pow(finalY, 2)))) * (180 / Math.PI);
    let avgLng = (Math.atan2(finalY, finalX)) * (180 / Math.PI);

    return { latitude: avgLat, longitude: avgLng };
  }
}
