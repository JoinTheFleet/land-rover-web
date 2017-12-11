import client from '../libraries/client';
import Service from './service';

class PayoutMethodsService extends Service {
  static get baseURL() {
    return '/api/v1/users/me/payout_methods/';
  }

  static makeDefault(id) {
    return client.put(this.baseURL + id + '/default');
  }

  static get actions() {
    return {
      index: true,
      create: true,
      destroy: true
    }
  }
}

export default PayoutMethodsService;
