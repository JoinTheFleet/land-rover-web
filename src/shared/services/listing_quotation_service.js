import client from '../libraries/client';
import Service from './service';

class ListingQuotationService extends Service {
  static get baseURL() {
    return '/api/v1/listings/:listing_id/quotations/';
  }

  static create(id, start_at, end_at, on_demand, on_demand_location, insurance_criteria) {
    return client.post(this.baseURL.replace(':listing_id', id), {
      start_at: start_at,
      end_at: end_at,
      on_demand: on_demand,
      on_demand_location: on_demand_location,
      insurance_criteria: insurance_criteria
    });
  }
}

export default ListingQuotationService;
