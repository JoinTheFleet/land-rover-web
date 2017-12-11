import Service from './service';

class HomeFeedService extends Service {
  static get baseURL() {
    return '/api/v1/home';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default HomeFeedService;
