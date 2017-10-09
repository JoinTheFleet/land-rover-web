import client from '../libraries/client';
import Service from './service';

class RenterReviewsService extends Service {
  static get baseURL() {
    return '/api/v1/users/:id/renter_reviews/';
  }

  static index(id, params) {
    return client.get(this.baseURL.replace(':id', id), {
      params: params
    });
  }

  static create(id, booking_id, feedback, options) {
    return client.post(this.baseURL.replace(':id', id), {
      review: {
        booking_id: booking_id,
        feedback: feedback,
        options: options
      }
    });
  }
}

export default RenterReviewsService;
