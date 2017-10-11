import Service from '../service';

class VehicleMakesService extends Service {
  static get baseURL() {
    return '/api/v1/vehicles/makes/';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default VehicleMakesService;
