import client from '../../libraries/client';
import Service from '../service';

class ListingCalendarService extends Service {
  static get baseURL() {
    return '/api/v1/listings/:listing_id/calendar/';
  }

  static index(id, start_at, end_at) {
    return client.get(this.baseURL.replace(':listing_id', id), {
      params: {
        start_at: start_at,
        end_at: end_at
      }
    });
  }

  static create(id, dates) {
    return client.post(this.baseURL.replace(':listing_id', id), {
      dates: dates
    });
  }
}

export default ListingCalendarService;
