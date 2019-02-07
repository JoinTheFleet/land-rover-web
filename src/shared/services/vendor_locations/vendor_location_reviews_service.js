import client from '../../libraries/client';
import Service from '../service';

class VendorLocationReviewsService extends Service {
  static get baseURL() {
    return '/api/v1/vendors/:vendor_id/vendor_locations/:vendor_location_id/reviews';
  }

  static index(vendor_id, vendor_location_id, params) {
    return client.get(this.baseURL.replace(':vendor_id', vendor_id).replace(':vendor_location_id', vendor_location_id), {
      params: params
    });
  }

  static get actions() {
    return {
      index: true,
    }
  }
}

export default VendorLocationReviewsService;
