import client from '../../libraries/client';
import Service from '../service';

class ConversationService extends Service {
  static get baseURL() {
    return '/api/v1/conversations/';
  }

  static muteURL(id) {
    return this.baseURL + id + '/mute'
  }

  static unmute(id) {
    return client.delete(this.muteURL(id));
  }

  static mute(id) {
    return client.post(this.muteURL(id));
  }

  static get actions() {
    return {
      index: true,
      show: true,
      destroy: true
    }
  }
}

export default ConversationService;
