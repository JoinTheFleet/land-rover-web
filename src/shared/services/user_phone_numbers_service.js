import client from '../libraries/client';
import Service from './service';

class UserPhoneNumbersService extends Service {
  static get baseURL() {
    return '/api/v1/users/me/phone_numbers/';
  }

  static confirm(id, confirmationCode) {
    return client.put(this.baseURL + id + '/confirm', {
      phone_number: {
        confirmation_code: confirmationCode
      }
    });
  }

  static get actions() {
    return {
      index: true,
      create: true,
      destroy: true
    }
  }
}

export default UserPhoneNumbersService;
