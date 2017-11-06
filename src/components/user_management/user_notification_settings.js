import React, { Component } from 'react';
import Alert from 'react-s-alert';

import FormPanel from '../miscellaneous/forms/form_panel';
import FormGroup from '../miscellaneous/forms/form_group';
import FormField from '../miscellaneous/forms/form_field';
import Button from '../miscellaneous/button';

import Loading from '../miscellaneous/loading';

import UserNotificationsSettingsService from '../../shared/services/users/user_notifications_settings_service';
import LocalizationService from '../../shared/libraries/localization_service';

export default class UserNotificationSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      initialLoad: true,
      notification_settings: {
        push_notifications: {
        },
        sms_notifications: {
        }
      }
    };

    this.toggle = this.toggle.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  toggle(type, key) {
    let notification_settings = this.state.notification_settings;

    notification_settings[type][key] = !notification_settings[type][key];

    this.setState({ notification_settings: notification_settings });
  }

  updateSettings() {
    this.setState({
      loading: true
    }, () => {
      UserNotificationsSettingsService.update({
        notification_settings: {
          push_notifications: {
            messages: this.state.notification_settings.push_notifications.messages,
            rental_updates: this.state.notification_settings.push_notifications.rental_updates,
            other: this.state.notification_settings.push_notifications.other
          },
          sms_messages: {
            messages: this.state.notification_settings.sms_messages.messages,
            rental_updates: this.state.notification_settings.sms_messages.rental_updates,
            other: this.state.notification_settings.sms_messages.other
          }
        }
      })
      .then(response => {
        Alert.success(LocalizationService.formatMessage('notification_settings.updated'));
        this.setState({ loading: false });
      })
    })
  }

  componentWillMount() {
    UserNotificationsSettingsService.show()
                                    .then(response => {
                                      this.setState({
                                        initialLoad: false,
                                        notification_settings: response.data.data.notification_settings
                                      });
                                    });
  }

  render() {
    if (this.state.initialLoad) {
      return <Loading />;
    }
    else {
      return (
        <div className="col-xs-12 no-side-padding">
          <FormPanel title={ LocalizationService.formatMessage('notification_settings.notifications.title') } >
            <FormGroup placeholder={ LocalizationService.formatMessage('notification_settings.push_notifications.notification_title') }>
              {
                ['messages', 'rental_updates', 'other'].map((key) => {
                  return (
                    <FormField type='checkbox'
                               id={ `push-notifications-messages-${key}` }
                               key={ `push-notifications-messages-${key}` }
                               handleChange={ () => { this.toggle('push_notifications', `${key}`) } }
                               value={ this.state.notification_settings.push_notifications[key] }
                               placeholder={ LocalizationService.formatMessage(`notification_settings.${key}.title`) }
                               label={ LocalizationService.formatMessage(`notification_settings.${key}.label`) }/>
                  )
                })
              }

            </FormGroup>

            <FormGroup placeholder={ LocalizationService.formatMessage('notification_settings.sms_notifications.notification_title') }>
              {
                ['messages', 'rental_updates', 'other'].map((key) => {
                  return (
                    <FormField type='checkbox'
                               id={ `sms-notifications-messages-${key}` }
                               key={ `sms-notifications-messages-${key}` }
                               handleChange={ () => { this.toggle('sms_messages', `${key}`) } }
                               value={ this.state.notification_settings.sms_messages[key] }
                               placeholder={ LocalizationService.formatMessage(`notification_settings.${key}.title`) }
                               label={ LocalizationService.formatMessage(`notification_settings.${key}.label`) }/>
                  )
                })
              }

            </FormGroup>
          </FormPanel>


          <div className='col-xs-12 no-side-padding'>
            <Button className="btn btn-primary text-center col-xs-12 col-sm-3 pull-right"
                    spinner={ this.state.loading }
                    disabled={ this.state.loading }
                    onClick={ this.updateSettings } >
              { LocalizationService.formatMessage('application.save') }
            </Button>
          </div>
        </div>
      )
    }
  }
}
