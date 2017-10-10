import client from '../libraries/client';
import Service from './service';

class ConversationMessagesStatusService extends Service {
  static get baseURL() {
    return '/api/v1/conversations/:conversation_id/messages/:message_id/statuses/';
  }

  static messageURL(conversation_id, message_id) {
    return this.baseURL.replace(':conversation_id', conversation_id).replace(':message_id', message_id);
  }

  static index(conversation_id, message_id, params) {
    return client.get(this.messageURL(conversation_id, message_id), {
      params: params
    });
  }

  static show(conversation_id, message_id, status_id, params) {
    return client.get(this.messageURL(conversation_id, message_id) + status_id, {
      params: params
    });
  }

  static update(conversation_id, message_id, status_id, status) {
    return client.put(this.messageURL(conversation_id, message_id) + status_id, {
      status: {
        status: status
      }
    });
  }
}

export default ConversationMessagesStatusService;
