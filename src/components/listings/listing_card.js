import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

export default class ListingCard extends Component {
  render() {
    let image;
    let editButton = '';
    let item = this.props.listing;
    let vehicleMake = item.variant.make.name;
    let vehicleModel = item.variant.model.name;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    if (item.gallery.length > 0) {
      image = (
        <img src={item.gallery[0].images.original_url} alt={vehicleTitle}></img>
      );
    }

    if (this.props.enableEdit) {
      editButton = (
        <button className="listing-card-edit-button btn secondary-color white-text"
                onClick={ () => { this.props.handleEditButtonClick(item) } }>
          <FormattedMessage id="application.edit" />
        </button>
      )
    }

    return (
      <div className="listing-card">
        <div className="listing-card-photo">
          { image }
        </div>

        <div className="listing-card-details">
          <p>
            <span className="subtitle-font-weight fs-18">{ vehicleTitle }</span>
            <span className="listing-item-year fs-18">{ item.variant.year.year }</span>
          </p>
        </div>

        { editButton }
      </div>
    )
  }
}

ListingCard.propTypes = {
  listing: PropTypes.object.isRequired,
  editButton: PropTypes.bool,
  handleEditButtonClick: PropTypes.func
}
