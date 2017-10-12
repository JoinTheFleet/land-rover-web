import client from '../../libraries/client';
import Service from '../service';

class UserListingsService extends Service {
  static get baseURL() {
    return '/api/v1/users/:id/listings';
  }

  static index(id, params) {
    return client.get(this.baseURL.replace(':id', id), {
      params: params
    });
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default UserListingsService;
