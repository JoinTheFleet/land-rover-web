import Service from '../service';

class VehicleBodiesService extends Service {
  static get baseURL() {
    return '/api/v1/vehicles/bodies/';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default VehicleBodiesService;
