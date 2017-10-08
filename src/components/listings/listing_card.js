import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

export default class ListingCard extends Component {
  render() {
    let image;
    let item = this.props.listing;
    let vehicleMake = item.variant.make.name;
    let vehicleModel = item.variant.model.name;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    if (item.gallery.length > 0) {
      image = (
        <img src={item.gallery[0].images.original_url} alt={vehicleTitle}></img>
      );
    }

    return (
      <div className="listing-card">
        <div className="listing-card-photo">
          { image }
        </div>

        <div className="listing-card-details">
          <span className="subtitle-font-weight">{ vehicleTitle }</span>
          <span className="listing-item-year">{ item.variant.year.year }</span>
        </div>
      </div>
    )
  }
}

ListingCard.propTypes = {
  listing: PropTypes.object.isRequired
}
