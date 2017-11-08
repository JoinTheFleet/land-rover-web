import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ListingPromotion extends Component {
  renderBumpTile() {

  }

  renderSpotlightTile() {

  }

  render() {
    return (<div></div>);
  }
}

ListingPromotion.propTypes = {
  listing: PropTypes.object.isRequired,
  handlePromote: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  expanded: PropTypes.bool
};

export default ListingPromotion;
