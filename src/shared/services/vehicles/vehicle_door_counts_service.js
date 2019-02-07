import Service from '../service';

class VehicleDoorCountsService extends Service {
  static get baseURL() {
    return '/api/v1/vehicles/door_counts/';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default VehicleDoorCountsService;
