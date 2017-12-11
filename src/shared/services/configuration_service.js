import Service from './service';

class ConfigurationService extends Service {
  static get baseURL() {
    return '/api/v1/configurations/generic';
  }

  static get actions() {
    return {
      show: true
    }
  }
}

export default ConfigurationService;
