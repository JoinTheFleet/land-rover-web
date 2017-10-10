import client from '../../libraries/client';
import Service from '../service';

class ConversationMessagesService extends Service {
  static get baseURL() {
    return '/api/v1/conversations/:conversation_id/messages/';
  }

  static conversationURL(conversation_id, id) {
    let url = this.baseURL.replace(':conversation_id', conversation_id);

    if (id) {
      url += id;
    }

    return url;
  }

  static index(conversation_id, params) {
    return client.get(this.conversationURL(conversation_id), {
      params: params
    });
  }

  static show(conversation_id, id, params) {
    return client.get(this.conversationURL(conversation_id, id), {
      params: params
    });
  }

  static create(conversation_id, text, attachments) {
    let params = {
      text: text
    };

    if (attachments && attachments.length > 0) {
      params.attachments = attachments;
    }

    return client.post(this.conversationURL(conversation_id), {
      message: params
    });
  }

  static delete(conversation_id, id) {
    return client.delete(this.conversationURL(conversation_id, id));
  }

  static imageAttachment(image, is_image_data) {
    let params = {
      type: 'image',
      image: {}
    };

    if (!is_image_data) {
      params.image.image_url = image;
    }
    else {
      params.image.image_data = image;
    }

    return params;
  }

  static locationAttachment(latitude, longitude) {
    return {
      type: 'location',
      location: {
        latitude: latitude,
        longitude: longitude
      }
    }
  }

  static destroy(conversation_id, id) {
    return client.delete(this.conversationURL(conversation_id, id));
  }
}

export default ConversationMessagesService;
