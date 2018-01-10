import Service from './service';
import client from '../libraries/client';

class NotificationsService extends Service {
  static get baseURL() {
    return '/api/v1/users/me/notifications/';
  }

  static get unreadCountURL() {
    return this.baseURL + 'unread_count';
  }

  static pending() {
    return this.index({status: 'pending'})
  }

  static sending() {
    return this.index({status: 'sending'})
  }

  static sent() {
    return this.index({status: 'sent'})
  }

  static failed() {
    return this.index({status: 'failed'})
  }

  static delivered() {
    return this.index({status: 'delivered'})
  }

  static unreadCount() {
    return client.get(this.unreadCountURL);
  }

  static get actions() {
    return {
      index: true,
      update: true
    }
  }
}

export default NotificationsService;
