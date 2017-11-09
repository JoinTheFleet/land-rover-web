import axios from 'axios';
import Service from './service';

class MediumService extends Service {
  static get baseURL() {
    return '/api/v1/medium/posts/latest_posts';
  }

  static get imagesBaseURL() {
    return process.env.REACT_APP_MEDIUM_IMAGES_URL;
  }

  static getImageUrl(id, width) {
    return `${this.imagesBaseURL}${width && width !== '' ? `/max/${width}` : ''}/${id}`;
  }

  static get actions() {
    return {
      show: true
    }
  }
}

export default MediumService;
