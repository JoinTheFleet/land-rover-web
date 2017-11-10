import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import noImagesPlaceholder from '../../assets/images/placeholder-no-images.png';

export default class ListingCard extends Component {
  renderEditButton() {
    if (!this.props.showEditButton) {
      return '';
    }

    return (
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

  render() {
    let image = noImagesPlaceholder;
    let item = this.props.listing;
    let vehicleMake = item.variant.make.name;
    let vehicleModel = item.variant.model.name;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    if (item.gallery.length > 0) {
      image = item.gallery[0].images.original_url;
    }

    return (
      <div className="listing-card">
        <Link to={{
                pathname: `/listings/${this.props.listing.id}`,
                state: {
                  listing: this.props.listing
                }
              }}
              className='listing-card-link'>
            <div className="listing-card-photo">
              { <img src={ image } alt={vehicleTitle} onError={ (event) => { event.target.setAttribute('src', process.env.REACT_APP_MISSING_LISTING_IMAGE) } } /> }
            </div>

            <div className="listing-card-details">
              <p>
                <span className="subtitle-font-weight fs-18">{ vehicleTitle }</span>
                <span className="listing-item-year fs-18">{ item.variant.year.year }</span>
              </p>
            </div>

        </Link>

        { this.renderEditButton() }
      </div>
    )
  }
}

ListingCard.propTypes = {
  listing: PropTypes.object.isRequired,
  showEditButton: PropTypes.bool,
  handleDeleteButtonClick: PropTypes.func
}
