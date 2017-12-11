import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import loadingAnimation from '../../assets/images/dual_ring.gif';

export default class Loading extends Component {
  render() {
    let loadingText = '';
    let loader = <img src={ loadingAnimation } alt="loading" />;

    if (!this.props.hiddenText) {
      loadingText = (
        <p className="fs-18 text-secondary-font-weight">
          <FormattedMessage id="application.loading" />
        </p>
      )
    }

    if (this.props.fixedSize) {
      let style = {
        height: this.props.fixedSize,
        width: this.props.fixedSize
      }

      loader = <img src={ loadingAnimation }
                     alt='loading'
                     style={ style } />
    }

    let loadingDiv = (
      <div className={ `${this.props.className} loading-div text-center` }>
        <div>
          { loader }
          { loadingText }
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
  fullWidthLoading: PropTypes.bool,
  hiddenText: PropTypes.bool,
  fixedSize: PropTypes.string,
  className: PropTypes.string
}
