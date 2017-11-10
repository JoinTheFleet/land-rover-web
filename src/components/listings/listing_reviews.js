import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Alert from 'react-s-alert';
import Avatar from 'react-avatar';
import ReactStars from 'react-stars';

import ReviewList from '../reviews/review_list';
import Loading from '../miscellaneous/loading';

import Button from '../miscellaneous/button';

import LocalizationService from '../../shared/libraries/localization_service';
import ListingsService from '../../shared/services/listings/listings_service';
import ListingReviewsService from '../../shared/services/listings/listing_reviews_service';
import Errors from '../../miscellaneous/errors';

import noImagesPlaceholder from '../../assets/images/placeholder-no-images.png';

const LIMIT = 10;

export default class ListingReviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      metadata: undefined,
      loading: false,
      page: 0,
      pages: 1,
      reviews: [],
      listing: {}
    };

    this.addError = this.addError.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.loadListingReviews = this.loadListingReviews.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    let location = this.props.location;

    this.setState({
      loading: true
    }, () => {
      if (location) {
        const state = location.state;
        let newState = this.state;

        if (state && state.metadata) {
          newState.metadata = state.metadata;
        }

        if (state && state.reviews) {
          newState.reviews = state.reviews;
          newState.loading = false;
        }

        if (state && state.listing) {
          newState.listing = state.listing;
        }
        else {
          this.loadListing();
        }

        if (newState !== this.state) {
          this.setState(newState);
        }
        else {
          this.loadListingReviews();
        }
      }
      else {
        this.setState({ loading: false });
      }
    });
  }

  loadListing() {
    ListingsService.show(this.props.match.params.id)
                   .then(response => {
                     this.setState({
                       listing: response.data.data.listing
                     });
                   })
                   .catch(error => { this.addError(Errors.extractErrorMessage(error)); });
  }

  loadListingReviews() {
    ListingReviewsService.index(this.props.match.params.id, {
      offset: this.state.page * LIMIT,
      limit: LIMIT
    })
    .then(response => {
      if (response && response.data.data) {
        let data = response.data.data;

        this.setState({
          reviews: data.reviews,
          metadata: data.metadata,
          initialLoad: false,
          pages: Math.ceil(data.metadata.total_reviews / LIMIT),
          loading: false
        });
      }
    })
    .catch(error => { this.addError(Errors.extractErrorMessage(error)); });
  }

  addError(error) {
    this.setState({ loading: false }, () => { Alert.error(error) })
  }

  handlePageChange(page) {
    this.setState({
      page: page - 1
    }, this.loadData);
  }

  renderReviewsHeader() {
    const location = this.props.location;
    let listingInfo = '';

    if (location.state && location.state.listing) {
      const listing = location.state.listing;
      let image = noImagesPlaceholder;

      if (listing.gallery && listing.gallery.length > 0) {
        image = listing.gallery[0].images.large_url;
      }

      listingInfo = (
        <div className='listing-reviews-header col-xs-12 no-side-padding'>
          <Link to={ `/listings/${this.props.match.params.id}` }>
            <Avatar src={ image } size={ 200 } className='listing-reviews-header-avatar col-xs-12 col-sm-4 no-side-padding' />
          </Link>
          <div className='col-xs-12 col-sm-8 rating-information'>
            <Link to={ `/listings/${this.props.match.params.id}` }>
              <div className="fs-36">
                <b>{ `${listing.variant.make.name} ${listing.variant.model.name}` }</b>
                <span> { ` ${listing.variant.year.year}` } </span>
              </div>
            </Link>

            { this.renderRatings() }
          </div>
        </div>
      )
    }

    return listingInfo;
  }

  renderRatings() {
    if (this.state.metadata) {
      let metadata = this.state.metadata;
      let averageRatings = metadata.average_ratings;

      return (
        <div>
          <div className='text-center visible-xs col-xs-12 no-side-padding'>
            <ReactStars value={ this.state.metadata.rating }
                        color1="#e0e0e0"
                        color2="#f8e81c"
                        half={ true }
                        edit={ false }
                        size={ 20 } />
          </div>
          {
            averageRatings.map((rating) => {
              return (
                <div className='col-xs-12 no-side-padding option-rating hidden-xs'>
                  <ReactStars value={ rating.rating }
                              color1="#e0e0e0"
                              color2="#f8e81c"
                              half={ true }
                              edit={ false }
                              size={ 20 } />
                  <span className='pull-left rating-text'>{ rating.option.description }</span>
                </div>
              )
            })
          }
        </div>
      )
    }
    else {
      return '';
    }
  }

  renderReviews () {
    if (this.state.reviews.length === 0) {
      return '';
    }

    return (
      <div className='col-xs-12 no-side-padding listing-reviews-list'>
        <ReviewList reviews={ this.state.reviews } page={ this.state.page + 1 } pages={ this.state.pages } handlePageChange={ this.handlePageChange } initialLoad={ this.state.initialLoad }/>
      </div>
    )
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    else {
      return (
        <div className='listing-reviews-div col-xs-12 no-side-padding'>
          <div className='col-xs-12'>
            { this.renderReviewsHeader() }

            { this.renderReviews() }
          </div>
        </div>
      );
    }
  }
}
