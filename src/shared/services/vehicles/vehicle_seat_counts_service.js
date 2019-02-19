import Service from '../service';

class VehicleSeatCountsService extends Service {
  static get baseURL() {
    return '/api/v1/vehicles/seat_counts/';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default VehicleSeatCountsService;
