import Service from './service';

class UsersCreditHistoriesService extends Service {
  static get baseURL() {
    return '/api/v1/users/me/credits';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default UsersCreditHistoriesService;
