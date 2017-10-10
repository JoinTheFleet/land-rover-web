import client from '../../libraries/client';
import Service from '../service';

class VehicleLookupsService extends Service {
  static get baseURL() {
    return '/api/v1/vehicles/lookup';
  }

  static create(license_plate, country_code) {
    return client.post(this.baseURL, {
      vehicle: {
        license_plate: license_plate,
        country_code: country_code
      }
    })
  }
}

export default VehicleLookupsService;
