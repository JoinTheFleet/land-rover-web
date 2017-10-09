import React, {
  Component
} from 'react';

import Anime from 'react-anime';
import PropTypes from 'prop-types';

const DEFAULTS = {
  duration: 500
};

export default class Toggable extends Component {
  render() {
    return (
      <Anime easing="easeOutQuart"
            duration={ this.props.duration || DEFAULTS.duration }
            opacity={ this.props.open ? 1 : 0 }
            begin={ (anime) => {
              if (this.props.open) {
                anime.animatables[0].target.style.display = 'block';
              }
            }}
            complete={ (anime) => {
              if (!this.props.open) {
                anime.animatables[0].target.style.display = 'none';
              }
            }}>
        { this.props.children }
      </Anime>
    )
  }
}

Toggable.propTypes = {
  open: PropTypes.bool
};
