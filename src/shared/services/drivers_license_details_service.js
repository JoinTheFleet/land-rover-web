import client from '../libraries/client';
import Service from './service';

class DriversLicenseDetailsService extends Service {
  static get baseURL() {
    return '/api/v1/drivers_licenses/drivers_license_details';
  }

  static show(country) {
    return client.get(this.baseURL, {
      params: {
        country: country
      }
    });
  }
}

export default DriversLicenseDetailsService;
