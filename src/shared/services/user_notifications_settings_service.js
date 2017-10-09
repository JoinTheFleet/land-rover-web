import Service from './service';

class UserNotificationsSettingsService extends Service {
  static get baseURL() {
    return '/api/v1/users/me/notification_settings';
  }

  static get actions() {
    return {
      show: true,
      update: true
    }
  }
}

export default UserNotificationsSettingsService;
