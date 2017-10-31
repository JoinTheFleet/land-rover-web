import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Alert from 'react-s-alert';

import PropTypes from 'prop-types';

import Constants from '../../miscellaneous/constants';

import ListingCard from './listing_card';
import Pageable from '../miscellaneous/pageable';

import ListingsService from '../../shared/services/listings/listings_service';
import { Link } from 'react-router-dom';

const listingsViews = Constants.listingsViews();

export default class ListingsOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      currentPage: 1,
      totalPages: 1,
      loading: false
    };

    this.fetchListings = this.fetchListings.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
  }

  componentWillMount() {
    this.fetchListings();
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
        this.setState({ loading: false }, () => { Alert.error(error.response.data.message) });
      });
    });
  }

  handlePageChange(page) {
    this.setState({
      currentPage: page,
      loaded: false
    });
  }

  handleEditButtonClick(listing) {
    this.props.handleChangeView(listingsViews.edit, { currentListing: listing });
  }

  renderMainContent() {
    return (
      <div>
        {
          this.state.listings.map((listing) => {
            return (
              <ListingCard key={'listing_' + listing.id}
                           listing={ listing }
                           enableEdit={ true }
                           handleEditButtonClick={ this.handleEditButtonClick } />
            )
          })
        }
      </div>
    );
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
          <div className="listings-overview-list col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
            { this.renderMainContent() }
          </div>
        </Pageable>
      </div>
    )
  }
}

ListingsOverview.propTypes = {
  handleChangeView: PropTypes.func
}
