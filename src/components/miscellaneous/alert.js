import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import Toggleable from '../miscellaneous/toggleable';

export default class Alert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true
    };
  }

  render() {
    return (
      <Toggleable open={ this.state.visible }>
        <div className={ 'fleet-alert alert alert-dismissable alert-' + this.props.type }>
          { this.props.message }
        </div>
      </Toggleable>
    )
  }
}

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired
};
