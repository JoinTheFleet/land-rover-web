import Service from '../service';

class VehicleTransmissionsService extends Service {
  static get baseURL() {
    return '/api/v1/vehicles/transmissions/';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default VehicleTransmissionsService;
