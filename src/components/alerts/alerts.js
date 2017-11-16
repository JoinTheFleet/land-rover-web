import React, { Component } from 'react';
import Alert from 'react-s-alert';

import Modal from '../miscellaneous/modal';
import Slider from 'react-slick';

import AlertsService from '../../shared/services/alerts_service';
import LocalizationService from '../../shared/libraries/localization_service';

import checkIcon from '../../assets/images/check.png';

export default class Alerts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      alerts: []
    };

    this.fetchAlerts = this.fetchAlerts.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.markAlertAsRead = this.markAlertAsRead.bind(this);
  }

  componentDidMount() {
    this.fetchAlerts();
  }

  toggleModal() {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  fetchAlerts() {
    AlertsService.sent()
                 .then(response => {
                   const alerts = response.data.data.alerts;
                   this.setState({
                     alerts: alerts,
                     open: alerts.length > 0 }, () => {
                      setTimeout(() => {
                        this.markAlertAsRead(this.state.alerts[0].id);
                      }, 2000)
                     });
                 })
                 .catch(error => { Alert.error(error.response.data.message); });
  }

  markAlertAsRead(alertId) {
    AlertsService.update(alertId, { status: 'sent' })
                 .then(response => {
                   let alerts = this.state.alerts;
                   alerts.splice(this.state.alerts.findIndex(alert => alert.id === alertId), 1);

                   this.setState({ alerts: alerts, open: alerts.length > 0 });
                 })
                 .catch(error => { Alert.error(error.response.data.message); });

  }

  render() {
    return (
      <Modal open={ this.state.open }
             title={ LocalizationService.formatMessage('alerts.alerts') }
             modalName="alerts"
             modalClass="alerts-modal"
             closeButtonPosition="right"
             toggleModal={ this.toggleModal } >
        <Slider dots={ true }
                arrows={ true }
                infinite={ false }
                autoplay={ true }
                beforeChange={ (prev, next) => {
                  if (this.state.alerts[prev]) {
                    this.markAlertAsRead(this.state.alerts[prev].id);
                  }
                }}
                autoplaySpeed={ 2000 }
                slidesToShow={ 1 }>
          {
            this.state.alerts.map(alert => {
              return (
                <div key={ alert.id } className="col-xs-12 alert-modal-row">
                  <div style={ { backgroundImage: `url(${alert.image})` } } ></div>
                  <div> { alert.message } </div>
                </div>
              )
            })
          }
        </Slider>
      </Modal>
    );
  }
}
