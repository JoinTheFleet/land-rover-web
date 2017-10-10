import client from '../../libraries/client';
import Service from '../service';

class BookingsService extends Service {
  static get baseURL() {
    return '/api/v1/bookings/';
  }

  static get bookingURL() {
    return this.baseURL + ':booking_id/';
  }

  static index(scope) {
    if (!scope) {
      scope = 'current';
    }

    return client.get(this.baseURL, {
      params: {
        scope: scope
      }
    });
  }

  static confirm(id) {
    return client.post(this.bookingURL.replace(':booking_id', id) + 'confirm');
  }

  static reject(id) {
    return client.post(this.bookingURL.replace(':booking_id', id) + 'reject');
  }

  static check_in(id, params) {
    return client.post(this.bookingURL.replace(':booking_id', id) + 'check_in', {
      check_in: params
    });
  }

  static check_out(id, params) {
    return client.post(this.bookingURL.replace(':booking_id', id) + 'check_out', {
      check_out: params
    });
  }

  static cancel(id) {
    return client.post(this.bookingURL.replace(':booking_id', id) + 'cancel');
  }

  static confirm_survey(id) {
    return client.put(this.bookingURL.replace(':booking_id', id) + 'confirm_survey');
  }

  static get actions() {
    return {
      show: true
    }
  }
}

export default BookingsService;
