import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';

import ListingCard from './listing_card';
import ListingPromotion from './listing_promotion';
import Pageable from '../miscellaneous/pageable';
import Placeholder from '../miscellaneous/placeholder';
import ConfirmationModal from '../miscellaneous/confirmation_modal';

import Errors from '../../miscellaneous/errors';
import Helpers from '../../miscellaneous/helpers';

import ListingsService from '../../shared/services/listings/listings_service';
import LocalizationService from '../../shared/libraries/localization_service';

export default class ListingsOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      selectedListing: undefined,
      currentPage: 1,
      totalPages: 1,
      modalsOpen: {
        promoteListing: false,
        deleteListing: false
      },
      loading: false
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.fetchListings = this.fetchListings.bind(this);
    this.handlePromote = this.handlePromote.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleDeleteListing = this.handleDeleteListing.bind(this);
  }

  componentWillMount() {
    this.fetchListings();
  }

  componentDidMount() {
    if (this.props.location && this.props.location.state && this.props.location.state.listingDeleted) {
      Alert.success(LocalizationService.formatMessage('listings.listing_deleted_successfully'));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      this.fetchListings();
    }
  }

  fetchListings(){
    this.setState({
      loading: true
    }, () => {
      ListingsService.index()
      .then((response) => {
        this.setState({ listings: response.data.data.listings, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false }, () => { Alert.error(Errors.extractErrorMessage(error)); });
      });
    });
  }

  toggleModal(modalName, additionalParams = {}) {
    let modalsOpen = this.state.modalsOpen;

    modalsOpen[modalName] = !modalsOpen[modalName];

    if (!modalsOpen[modalName] && modalName !== 'deleteListing') {
      additionalParams = Helpers.extendObject(additionalParams, { selectedListing: undefined });
    }

    this.setState(Helpers.extendObject({ modalsOpen: modalsOpen }, additionalParams));
  }

  handlePromote(updatedListing) {
    let listings = this.state.listings;
    const index = listings.findIndex(listing => listing.id === updatedListing.id);

    listings[index] = updatedListing;

    this.setState({
      selectedListing: updatedListing,
      listings: listings
    });
  }

  handleDeleteListing() {
    if(!this.state.selectedListing) {
      return '';
    }

    this.setState({
      loading: true
    }, () => {
      ListingsService.destroy(this.state.selectedListing.id)
                     .then(response => {
                       this.setState({
                         selectedListing: undefined
                       }, () => {
                         Alert.success(LocalizationService.formatMessage('listings.listing_deleted_successfully'));
                         this.fetchListings();
                       });
                     })
                     .catch((error) => {
                       this.setState({ loading: false }, () => { Alert.error(Errors.extractErrorMessage(error)); });
                     });
    });
  }

  handlePageChange(page) {
    this.setState({
      currentPage: page,
      loaded: false
    });
  }

  renderMainContent() {
    if (this.state.listings.length === 0) {
      return (<Placeholder contentType="vehicles_guest" />)
    }

    return (
      <div className="listings-overview-list col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
        {
          this.state.listings.map((listing) => {
            return (
              <ListingCard key={'listing_' + listing.id}
                           listing={ listing }
                           showEditButton={ true }
                           showDeleteButton={ true }
                           showPromoteButton={ true }
                           handlePromoteButtonClick={ () => { this.toggleModal('promoteListing', { selectedListing: listing }) } }
                           handleDeleteButtonClick={ () => { this.toggleModal('deleteListing', { selectedListing: listing }) } } />
            )
          })
        }
      </div>
    );
  }

  renderListingPromotion() {
    if (!this.state.selectedListing) {
      return '';
    }

    return (
      <ListingPromotion open={ this.state.modalsOpen.promoteListing }
                        listing={ this.state.selectedListing }
                        toggleModal={ this.toggleModal }
                        handlePromote={ this.handlePromote } />
    );
  }

  renderDeleteListingModal() {
    if (!this.state.selectedListing) {
      return '';
    }

    return (
      <ConfirmationModal open={ this.state.modalsOpen.deleteListing }
                         title={ LocalizationService.formatMessage('listings.confirm_delete') }
                         modalName="deleteListing"
                         toggleModal={ this.toggleModal }
                         confirmationAction={ this.handleDeleteListing }>
        <span className="tertiary-text-color text-secondary-font-weight fs-18">
          { LocalizationService.formatMessage('listings.confirm_delete_text') }
        </span>
      </ConfirmationModal>
    )
  }

  render() {
    return (
      <div className="listings-overview-div col-xs-12 no-side-padding">

        <div className="listings-overview-top-bar smoke-grey col-xs-12">
          <div className="pull-right">
            <Link to="/listings/new"
                  className="btn secondary-color white-text">
              <FormattedMessage id="listings.add_new_listing" />
            </Link>
          </div>
        </div>

        <Pageable currentPage={ this.state.currentPage }
                  totalPages={ this.state.totalPages }
                  handlePageChange={ this.handlePageChange }
                  loading={ this.state.loading }>
            { this.renderMainContent() }
        </Pageable>

        { this.renderListingPromotion() }
        { this.renderDeleteListingModal() }
      </div>
    )
  }
}

ListingsOverview.propTypes = {
  handleChangeView: PropTypes.func
}
