import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import loadingAnimation from '../../assets/images/dual_ring.gif';

export default class Loading extends Component {
  render() {
    let loadingDiv = (
      <div className="loading-div text-center">
        <div>
          <img src={ loadingAnimation } alt="loading" />
          <p className="fs-18 text-secondary-font-weight">
            <FormattedMessage id="application.loading" />
          </p>
        </div>
      </div>
    );

    if (this.props.fullWidthLoading) {
      loadingDiv = (<div className="full-width-loading"> { loadingDiv } </div>);
    }


    return loadingDiv;
  }
}

Loading.propTypes = {
  fullWidthLoading: PropTypes.bool
}
