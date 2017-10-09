import Service from './service';

class IdentificationsService extends Service {
  static get baseURL() {
    return '/api/v1/users/me/identifications';
  }

  static get actions() {
    return {
      create: true,
      destroy: true
    }
  }
}

export default IdentificationsService;
