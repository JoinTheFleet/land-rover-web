import client from '../../libraries/client';
import Service from '../service';

class UserReviewsService extends Service {
  static get baseURL() {
    return '/api/v1/users/:id/reviews/';
  }

  static index(id, params) {
    return client.get(this.baseURL.replace(':id', id), {
      params: params
    });
  }

  static get actions() {
    return {
      index: true,
    }
  }
}

export default UserReviewsService;
