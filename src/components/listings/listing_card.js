import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from '../miscellaneous/button';

import noImagesPlaceholder from '../../assets/images/placeholder-no-images.png';
import editIcon from '../../assets/images/edit_icon.png';
import deleteIcon from '../../assets/images/delete_icon.png';
import promoteIcon from '../../assets/images/promote_icon.png';

import LocalizationService from '../../shared/libraries/localization_service';

export default class ListingCard extends Component {
  renderPromoteButton() {
    if (!this.props.showPromoteButton) {
      return '';
    }

    return (
      <Button className="secondary-color white-text"
              onClick={ this.props.handlePromoteButtonClick }>
        <span className="hidden-xs"> { LocalizationService.formatMessage('listings.promote_listing') } </span>
        <img className="visible-xs" src={ promoteIcon } alt="promote_listing_icon" />
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
        <span className="hidden-xs"><FormattedMessage id="application.edit" /></span>
        <img className="visible-xs" src={ editIcon } alt="edit_listing_icon" />
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
        <span className="hidden-xs"> { LocalizationService.formatMessage('listings.delete_listing') } </span>
        <img className="visible-xs" src={ deleteIcon } alt="delete_listing_icon" />
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
      <div className="listing-card col-xs-12 no-side-padding">
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
