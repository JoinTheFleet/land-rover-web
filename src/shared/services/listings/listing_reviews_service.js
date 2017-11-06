import client from '../../libraries/client';
import Service from '../service';

class ListingReviewsService extends Service {
  static get baseURL() {
    return '/api/v1/listings/:listing_id/reviews/';
  }

  static index(id, params) {
    return client.get(this.baseURL.replace(':listing_id', id), params);
  }

  static create(id, booking_id, feedback, options) {
    return client.post(this.baseURL.replace(':listing_id', id), {
      review: {
        booking_id: booking_id,
        feedback: feedback,
        options: options
      }
    });
  }
}

export default ListingReviewsService;
