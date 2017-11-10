import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from '../miscellaneous/button';

import noImagesPlaceholder from '../../assets/images/placeholder-no-images.png';

export default class ListingCard extends Component {
  renderPromoteButton() {
    if (!this.props.showPromoteButton) {
      return '';
    }

    return (
      <Button className="secondary-color white-text"
              onClick={ this.props.handlePromoteButtonClick }>
        <FormattedMessage id="listings.promote_listing" />
      </Button>
    )
  }

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

  renderDeleteButton() {
    if (!this.props.showDeleteButton) {
      return '';
    }

    return (
      <Button className="listing-card-delete-button tomato white-text"
              onClick={ this.props.handleDeleteButtonClick }>
        <FormattedMessage id="listings.delete_listing" />
      </Button>
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
              { <img src={ image } alt={vehicleTitle} ref={img => this.img = img} onError={ () => { this.img.src = noImagesPlaceholder } }></img> }
            </div>

            <div className="listing-card-details">
              <p>
                <span className="subtitle-font-weight fs-18">{ vehicleTitle }</span>
                <span className="listing-item-year fs-18">{ item.variant.year.year }</span>
              </p>
            </div>

        </Link>

        <div className="listing-card-buttons pull-right">
          { this.renderPromoteButton() }
          { this.renderEditButton() }
          { this.renderDeleteButton() }
        </div>
      </div>
    )
  }
}

ListingCard.propTypes = {
  listing: PropTypes.object.isRequired,
  showEditButton: PropTypes.bool,
  showDeleteButton: PropTypes.bool,
  showPromoteButton: PropTypes.bool,
  handlePromoteButtonClick: PropTypes.func,
  handleDeleteButtonClick: PropTypes.func
}
