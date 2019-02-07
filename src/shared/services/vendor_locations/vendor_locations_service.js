import client from '../../libraries/client';
import Service from '../service';

class VendorLocationsService extends Service {
  static get baseURL() {
    return '/api/v1/vendors/vendor/vendor_locations/:id';
  }

  static show(id, params) {
    return client.get(this.baseURL.replace(':id', id), {
      params: params
    });
  }

  static get actions() {
    return {
      show: true,
    }
  }
}

export default VendorLocationsService;
