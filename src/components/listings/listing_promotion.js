import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Alert from 'react-s-alert';

import ListingFormFieldGroup from './forms/listing_form_field_group';

import Modal from '../miscellaneous/modal';
import Button from '../miscellaneous/button';

import Errors from '../../miscellaneous/errors';
import Helpers from '../../miscellaneous/helpers';
import LocalizationService from '../../shared/libraries/localization_service';

import ListingBumpsService from '../../shared/services/listings/listing_bumps_service';
import ListingSpotlightsService from '../../shared/services/listings/listing_spotlights_service';

const PROMOTED_FIELDS = {
  bump: {
    promoted: 'bumped',
    promoted_at: 'bumped_at',
    promoted_until: 'bumped_until'
  },
  spotlight: {
    promoted: 'spotlighted',
    promoted_at: 'spotlighted_at',
    promoted_until: 'spotlighted_until'
  }
};

class ListingPromotion extends Component {
  constructor(props) {
    super(props);

    let loadings = {};
    const promotions = this.props.listing.promotions;
    Object.keys(promotions).map(promotionType => loadings[promotionType] = false);

    this.state = {
      loadings: loadings
    };

    this.addError = this.addError.bind(this);
    this.handlePromote = this.handlePromote.bind(this);
    this.setLoadingState = this.setLoadingState.bind(this);
    this.renderPromotionTile = this.renderPromotionTile.bind(this);
    this.renderPromotionTiles = this.renderPromotionTiles.bind(this);
  }

  handlePromote(promotionType) {
    let loadings = this.state.loadings;
    loadings[promotionType] = true;

    this.setState({
      loadings: loadings
    }, () => {
      switch(promotionType) {
        case 'bump':
          ListingBumpsService.create(this.props.listing.id)
                             .then(response => {
                               this.setLoadingState(promotionType, false, () => {
                                this.props.handlePromote(response.data.data.listing);
                               });
                             })
                             .catch(error => this.addError(promotionType, Errors.extractErrorMessage(error)));
          break;
        case 'spotlight':
          ListingSpotlightsService.create(this.props.listing.id)
                                  .then(response => {
                                    this.setLoadingState(promotionType, false, () => {
                                     this.props.handlePromote(response.data.data.listing);
                                    });
                                  })
                                  .catch(error => this.addError(promotionType, Errors.extractErrorMessage(error)));
          break;
        default:
      }
    });
  }

  setLoadingState(promotionType, state, callback) {
    let loadings = this.state.loadings;
    loadings[promotionType] = state;

    this.setState({ loadings: loadings }, callback);
  }

  addError(promotionType, error) {
    this.setLoadingState(promotionType, false, () => {
      Alert.error(error);
    });
  }

  renderPromotionTiles() {
    const promotions = this.props.listing.promotions;

    return (
      <div className="listing-promotions-list">
        { Object.keys(promotions).map(promotionType => this.renderPromotionTile(promotionType, promotions[promotionType])) }
      </div>
    )
  }

  renderPromotionTile(promotionType, promotionDetails) {
    let listingPromotionContent = '';
    const listing = this.props.listing;
    const currentPromotion = listing[`current_${promotionType}`];
    const promotedFields = PROMOTED_FIELDS[promotionType];

    if (currentPromotion && currentPromotion[promotedFields.promoted]) {
      listingPromotionContent = (
        <div>
          <span>{ LocalizationService.formatMessage('listings.listing_promoted_until', { promotionType: Helpers.capitalizeString(promotionType) }) }</span>
          <b className="pull-right"> { ` ${moment.utc(moment.unix(currentPromotion[promotedFields.promoted_until])).format('DD/MM/YY')}` } </b>
        </div>
      )
    }
    else {
      let disabled = this.state.loadings[promotionType];

      listingPromotionContent = (
        <div>
          <div className="pull-left">
            <b> { `${listing.country_configuration.country.currency_symbol}${promotionDetails.rate / 100.00}` } </b>
          </div>
          <div className="pull-right">
            <Button className="secondary-color white-text"
                    disabled={ disabled }
                    spinner={ disabled }
                    onClick={() => { this.handlePromote(promotionType) }}>
              { LocalizationService.formatMessage('application.purchase') }
            </Button>
          </div>
        </div>
      )
    }

    return (
      <ListingFormFieldGroup key={ `listing_promotion_${promotionType}` }
                             title={ promotionDetails.title }
                             fieldsDescription={ promotionDetails.description }>
        <div className="listing-promotion-details col-xs-12 no-side-padding">
          { listingPromotionContent }
        </div>
      </ListingFormFieldGroup>
    )
  }

  renderSpotlightTile() {

  }

  render() {
    let listing = this.props.listing;
    let title = (
      <span>
        <b> { `${listing.variant.make.name} ${listing.variant.model.name}` } </b>
        <span className="text-secondary-font-weight"> { ` ${listing.variant.year.year}` } </span>
      </span>
    )

    return (
      <Modal open={ this.props.open }
             title={ title }
             modalName="promoteListing"
             modalClass="listing-promote-modal"
             closeButtonPosition="right"
             toggleModal={ this.props.toggleModal }>
        { this.renderPromotionTiles() }
      </Modal>
    );
  }
}

ListingPromotion.propTypes = {
  open: PropTypes.bool.isRequired,
  listing: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  handlePromote: PropTypes.func
};

export default ListingPromotion;
