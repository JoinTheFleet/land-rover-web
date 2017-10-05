import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import Anime from 'react-anime';
import PropTypes from 'prop-types';

export default class ListingsFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open || false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open || false
    });
  }

  render() {
    return (
      <Anime easing="easeOutQuart"
             duration={500}
             opacity={this.state.open ? 1 : 0}
             begin={(anime) => {
               if(this.state.open) {
                 anime.animatables[0].target.style.display = 'block';
               }
             }}
             complete={(anime) => {
               if(!this.state.open) {
                 anime.animatables[0].target.style.display = 'none';
               }
             }}>
        <div className="listings-filters white">
          <FormattedMessage id="listings.vehicle">
            {
              (text) => ( <span className="secondary-text-color">{ text }</span> )
            }
          </FormattedMessage>
        </div>
      </Anime>
    )
  }
}

ListingsFilters.propTypes = {
  addSearchParamHandler: PropTypes.func.isRequired
}
