import Service from '../service';

class VehicleYearsService extends Service {
  static get baseURL() {
    return '/api/v1/vehicles/years/';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default VehicleYearsService;
