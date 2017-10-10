import client from '../libraries/client';
import Service from './service';

class ListingBookingsService extends Service {
  static get baseURL() {
    return '/api/v1/listings/:listing_id/bookings/';
  }

  static create(id, quotation_id, agreed_to_rules, agreed_to_insurance_terms, host_message) {
    return client.post(this.baseURL.replace(':listing_id', id), {
      booking: {
        quotation: quotation_id,
        agreed_to_rules: agreed_to_rules,
        agreed_to_insurance_terms: agreed_to_insurance_terms,
        host_message: host_message
      }
    });
  }

  static index(id, params) {
    return client.get(this.baseURL.replace(':listing_id', id), params);
  }
}

export default ListingBookingsService;
