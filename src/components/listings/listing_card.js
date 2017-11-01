import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

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
        <Link to={{
                pathname: `/listings/${this.props.listing.id}/edit`,
                state: {
                  listing: this.props.listing
                }
              }}
              className="listing-card-edit-button btn secondary-color white-text">
          <FormattedMessage id="application.edit" />
        </Link>
      )
    }

    return (
      <Link to={{
              pathname: `/listings/${this.props.listing.id}`,
              state: {
                listing: this.props.listing
              }
            }}
            className='listing-card-link'>
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
      </Link>
    )
  }
}

ListingCard.propTypes = {
  listing: PropTypes.object.isRequired,
  editButton: PropTypes.bool,
  handleEditButtonClick: PropTypes.func
}
