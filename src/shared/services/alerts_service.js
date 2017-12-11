import Service from './service';

class AlertsService extends Service {
  static get baseURL() {
    return '/api/v1/users/me/alerts/';
  }

  static pending() {
    return this.index({status: 'pending'});
  }

  static sending() {
    return this.index({status: 'sending'});
  }

  static sent() {
    return this.index({status: 'sent'});
  }

  static failed() {
    return this.index({status: 'failed'});
  }

  static delivered() {
    return this.index({status: 'delivered'});
  }

  static get actions() {
    return {
      index: true,
      update: true
    }
  }
}

export default AlertsService;
