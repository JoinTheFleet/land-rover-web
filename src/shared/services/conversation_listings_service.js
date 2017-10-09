import Service from './service';

class ConversationListingsService extends Service {
  static get baseURL() {
    return '/api/v1/conversations/listings';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default ConversationListingsService;
