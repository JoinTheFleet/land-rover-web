import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import ReactStars from 'react-stars';

import BookingRow from './booking_row';
import FormField from '../miscellaneous/forms/form_field';
import Button from '../miscellaneous/button';
import Loading from '../miscellaneous/loading';

import Constants from '../../miscellaneous/constants';
import Errors from '../../miscellaneous/errors';
import LocalizationService from '../../shared/libraries/localization_service';

import BookingsService from '../../shared/services/bookings/bookings_service';
import RenterReviewsService from '../../shared/services/renter_reviews_service';
import ListingReviewsService from '../../shared/services/listings/listing_reviews_service';

const userRoles = Constants.userRoles();

class BookingReview extends Component {
  constructor(props) {
    super(props);

    let booking = this.props.booking;
    let review = this.initializeReview(this.props.reviewOptions || []);

    if (this.props.location && this.props.location.state) {
      booking = this.props.location.state.booking;
    }

    this.state = {
      booking: booking,
      review: review,
      reviewCompleted: false,
      loading: false,
    };

    this.addError = this.addError.bind(this);
    this.handleSaveReview = this.handleSaveReview.bind(this);
    this.setReviewFeedback = this.setReviewFeedback.bind(this);
    this.setReviewOptionValue = this.setReviewOptionValue.bind(this);
  }

  componentDidMount() {
    if (!this.state.booking) {
      this.setState({
        loading: true
      }, () => {
        BookingsService.show(this.props.match.params.id)
        .then(response => {
          this.setState({
            booking: response.data.data.booking,
            loading: false
          });
        })
        .catch(error => this.addError(Errors.extractErrorMessage(error)));
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let reviewOptions = this.props.reviewOptions;

    if (prevProps.reviewOptions !== reviewOptions) {
      this.setState({ review: this.initializeReview(reviewOptions) });
    }
  }

  initializeReview(reviewOptions) {
    let review = { feedback: '', options: [] };

    for(let i = 0; i < reviewOptions.length; i++) {
      review.options.push({
        slug: reviewOptions[i].slug,
        rating: undefined
      });
    }

    return review;
  }

  setReviewOptionValue(reviewOptionSlug, value) {

    let review = this.state.review;
    let index = review.options.findIndex(option => option.slug === reviewOptionSlug);

    if (index > -1) {
      review.options[index].rating = value;

      this.setState({ review: review });
    }
  }

  setReviewFeedback(value) {
    let review = this.state.review;
    review.feedback = value;

    this.setState({ review: review });
  }

  handleSaveReview() {
    let role = this.props.currentUserRole;

    if (location && location.state && location.state.targetMode) {
      role = location.state.targetMode;
    }

    let booking = this.state.booking;
    let review = this.state.review;

    this.setState({
      loading: true
    }, () => {
      if (role === userRoles.owner) {
        RenterReviewsService.create(booking.renter.id, booking.id, review.feedback, review.options)
                            .then(response => {
                              this.setState({ loading: false, reviewCompleted: true });
                              Alert.success(LocalizationService.formatMessage('reviews.review_submitted_successfully'));
                            })
                            .catch(error => this.addError(Errors.extractErrorMessage(error)));
      }
      else {
        ListingReviewsService.create(booking.listing.id, booking.id, review.feedback, review.options)
                             .then(response => {
                               this.setState({ loading: false, reviewCompleted: true });
                               Alert.success(LocalizationService.formatMessage('reviews.review_submitted_successfully'));
                             })
                             .catch(error => this.addError(Errors.extractErrorMessage(error)));
      }
    });
  }

  addError(error) {
    this.setState({ loading: false }, () => { Alert.error(error); });
  }

  renderListingDetails() {
    return (
      <BookingRow booking={ this.state.booking }
                  currentUserRole={ this.props.currentUserRole }
                  showListingDetails={ true }
                  hideStatus={ true } />);
  }

  renderReviewTile() {
    if (!this.props.reviewOptions) {
      return '';
    }

    if (this.state.reviewCompleted) {
      return (<Redirect to="/bookings" />)
    }

    return (
      <div className="booking-review-tile col-xs-12 no-side-padding">
        <div className="booking-review-header secondary-color white-text fs-16 text-secondary-font-weight col-xs-12">
          { LocalizationService.formatMessage('reviews.write_a_review') }
        </div>

        <div className="booking-review-items text-secondary-font-weight col-xs-12">
          {
            this.props.reviewOptions.map(reviewOption => {
              let options = this.state.review.options;
              let index = options.findIndex(opt => opt.slug === reviewOption.slug);
              let rating = 0;

              if (index > -1) {
                rating = options[index].rating;
              }

              return (
                <div key={ `booking_review_item_row_${reviewOption.slug}` } className="booking-review-item-row col-xs-12 no-side-padding">
                  <div className="pull-left fs-16"> { reviewOption.description } </div>

                  <div className="pull-right">
                    <ReactStars value={ rating }
                                color1="#e0e0e0"
                                color2="#f8e81c"
                                half={ true }
                                size={ 20 }
                                onChange={ (value) => { this.setReviewOptionValue(reviewOption.slug, value) } } />
                  </div>
                </div>
              )
            })
          }
        </div>

        <div className="booking-review-feedback text-secondary-font-weight col-xs-12 fs-16">
          <FormField type="textarea"
                     id="booking_review_feedback"
                     value={ this.state.review.feedback }
                     placeholder={ LocalizationService.formatMessage('reviews.enter_feedback_here') }
                     handleChange={ (event) => { this.setReviewFeedback(event.target.value) } } />
        </div>
      </div>
    )
  }

  renderActionButtons() {
    return (
      <div className="booking-review-action-buttons col-xs-12 no-side-padding">
        <div className="pull-right">
          <Button disabled={ false }
                  className="secondary-color white-text"
                  onClick={ this.handleSaveReview } >
            { LocalizationService.formatMessage('application.save') }
          </Button>
        </div>
      </div>
    )
  }

  renderLoading() {
    let loading = '';

    if (this.state.loading) {
      loading = (<Loading fullWidthLoading={ true } />)
    }

    return loading;
  }

  render() {
    return (
      <div className="booking-review col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
        { this.renderListingDetails() }

        { this.renderReviewTile() }

        { this.renderActionButtons() }

        { this.renderLoading() }
      </div>
    );
  }
}

BookingReview.propTypes = {
  booking: PropTypes.object.isRequired,
  currentUserRole: PropTypes.string.isRequired,
  reviewOptions: PropTypes.array.isRequired
};

export default BookingReview;
