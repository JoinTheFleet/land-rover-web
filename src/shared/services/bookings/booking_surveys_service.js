import client from '../../libraries/client';
import Service from '../service';

class BookingSurveysService extends Service {
  static get baseURL() {
    return '/api/v1/bookings/:booking_id/surveys/';
  }

  static index(booking_id, params) {
    return client.get(this.baseURL.replace(':booking_id', booking_id), {
      params: params
    });
  }
}

export default BookingSurveysService;
