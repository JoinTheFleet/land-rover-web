import Service from '../service';

class VehicleEngineFuelsService extends Service {
  static get baseURL() {
    return '/api/v1/vehicles/engine_fuels/';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default VehicleEngineFuelsService;
