import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import loadingAnimation from '../../assets/images/dual_ring.gif';

export default class Loading extends Component {
  render() {
    return (
      <div className="loading-div text-center">
        <div>
          <img src={ loadingAnimation } alt="loading" />
          <p className="fs-18 text-secondary-font-weight">
            <FormattedMessage id="application.loading" />
          </p>
        </div>
      </div>
    )
  }
}
