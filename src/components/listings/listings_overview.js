import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';

import Constants from '../../miscellaneous/constants';

import ListingCard from './listing_card';
import Loading from '../miscellaneous/loading';
import Pageable from '../miscellaneous/pageable';

import ListingsService from '../../shared/services/listings/listings_service';

const listingsViews = Constants.listingViews();

export default class ListingsOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedListingId: '',
      listings: [],
      loaded: false,
      currentPage: 1,
      totalPages: 1,
      errors: []
    };

    this.fetchListings = this.fetchListings.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleListingCardClick = this.handleListingCardClick.bind(this);
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
    ListingsService.index()
    .then((response) => {
      this.setState({ listings: response.data.data.listings, loaded: true });
    })
    .catch((error) => {
      this.setState((prevState) => ({ errors: prevState.errors.push(error), loaded: true }));
    });
  }

  handlePageChange(page) {
    this.setState({
      currentPage: page,
      loaded: false
    });
  }

  handleListingCardClick(listing) {
    this.props.handleChangeView(listingsViews.view, { currentListing: listing });
  }

  handleEditButtonClick(listing) {
    this.props.handleChangeView(listingsViews.edit, { currentListing: listing });
  }

  renderMainContent() {
    if (!this.state.loaded) {
      return (<Loading></Loading>);
    }
    else {
      return (
        <div>
          {
            this.state.listings.map((listing) => {
              return (
                <ListingCard key={'listing_' + listing.id}
                             listing={ listing }
                             enableEdit={ true }
                             handleCardClick={ this.handleListingCardClick }
                             handleEditButtonClick={ this.handleEditButtonClick } />
              )
            })
          }
        </div>
      )
    }
  }

  render() {
    return (
      <div className="listings-overview-div col-xs-12 no-side-padding">

        <div className="listings-overview-top-bar smoke-grey col-xs-12">
          <div className="pull-right">
            <button className="btn secondary-color white-text" onClick={ () => { this.props.handleChangeView(listingsViews.new) } }>
              <FormattedMessage id="listings.add_new_listing" />
            </button>
          </div>
        </div>

        <Pageable currentPage={ this.state.currentPage }
                  totalPages={ this.state.totalPages }
                  handlePageChange={ this.handlePageChange }>
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
