import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

export default class FeatureTile extends Component {
  render() {
    return (
      <div className="col-xs-12 col-sm-4 text-center">
        <img src={this.props.icon} alt={this.props.messageId + '_icon'} />
        <p>
          <span className="subtitle-font-size subtitle-font-weight secondary-text-color text-uppercase">
            <FormattedMessage id={this.props.titleMessageId} />
          </span>
          <br/>
          <FormattedMessage id={this.props.textMessageId} />
        </p>
      </div>
    )
  }
}
