import client from '../libraries/client';
import Service from './service';

class MediumService extends Service {
  static get baseURL() {
    return '/api/v1/medium/posts/latest_posts';
  }

  static get actions() {
    return {
      show: true
    }
  }
}

export default MediumService;
