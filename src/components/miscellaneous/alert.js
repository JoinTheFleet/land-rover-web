import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import Toggleable from '../miscellaneous/toggleable';

import Helpers from '../../miscellaneous/helpers';

export default class Alert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true
    };
  }

  render() {
    let alerts = document.getElementsByClassName('fleet-alert');
    let bottomPosition = 20;

    if (alerts.length > 1) {
      let alert = alerts[alerts.length - 1];
      bottomPosition = Helpers.windowHeight() - (alert.offsetTop + alert.clientHeight);
    }

    let closeButton = '';

    if (this.props.closeable) {
      closeButton = (<a className="close" data-dismiss="alert" aria-label="close" onClick={ this.props.handleClose }>&times;</a>)
    }

    return (
      <Toggleable open={ this.state.visible }>
        <div className={ 'fleet-alert alert alert-dismissable alert-' + this.props.type }
             style={ { bottom: bottomPosition } }>
          { closeButton }
          { this.props.message }
        </div>
      </Toggleable>
    )
  }
}

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired,
  closeable: PropTypes.bool,
  handleClose: PropTypes.func
};
