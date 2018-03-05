import React, { Component } from 'react';
import { DateRangePicker } from 'react-dates';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Alert from 'react-s-alert';

import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

import Loading from '../miscellaneous/loading';
import Button from '../miscellaneous/button';

import UsersService from '../../shared/services/users/users_service';
import ListingQuotationService from '../../shared/services/listings/listing_quotation_service';
import LocalizationService from '../../shared/libraries/localization_service';

import Errors from '../../miscellaneous/errors';
import Helpers from '../../miscellaneous/helpers';

import UserVerificationModal from '../users/user_verification_modal';

class BookNowTile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      pricingQuote: {},
      quotation: {},
      loadingRates: false,
      verificationsNeeded: [],
      numberOfMonthsToShow: Helpers.pageWidth() >= 768 ? 2 : 1,
      daySize: Helpers.pageWidth() < 400 ? Math.round((Helpers.pageWidth() - 90) / 7) : null,
      loading: false,
      showUserVerificationModal: false
    };

    this.addError = this.addError.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.toggleUserVerificationModal = this.toggleUserVerificationModal.bind(this);
    this.afterVerificationAction = this.afterVerificationAction.bind(this);
    this.closeVerificationModal = this.closeVerificationModal.bind(this);

    window.addEventListener('resize', this.handleWindowResize);
  }

  toggleUserVerificationModal() {
    this.setState({ showUserVerificationModal: !this.state.showUserVerificationModal });
  }

  updateUser(callback) {
    if (this.props.loggedIn) {
      this.setState({ loading: true }, () => {
        UsersService.show('me')
                    .then(response => {
                      let meInfo = response.data.data.user;
                      let verificationsNeeded = this.state.verificationsNeeded;

                      verificationsNeeded = verificationsNeeded.concat(Object.keys(meInfo.verifications_required)
                                                               .filter(key => meInfo.verifications_required[key]));

                      verificationsNeeded = verificationsNeeded.concat(Object.keys(meInfo.owner_verifications_required)
                                                               .filter(key => meInfo.verifications_required[key] && verificationsNeeded.indexOf(key) === -1));

                      this.setState({
                        user: meInfo,
                        verificationsNeeded: verificationsNeeded,
                        loading: false
                      }, callback);
                    })
                    .catch(error => { this.addError(Errors.extractErrorMessage(error)); });
      });
    }
  }

  componentDidMount() {
    this.updateUser()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.loggedIn !== prevProps.loggedIn) {
      this.setState({
        pricingQuote: {},
        verificationsNeeded: []
      }, this.updateUser);
    }
  }

  closeVerificationModal() {
    this.setState({ showUserVerificationModal: false });
  }

  afterVerificationAction(callback) {
    this.updateUser(this.closeVerificationModal)
  }

  handleWindowResize() {
    let width = Helpers.pageWidth();

    if (width < 400) {
      this.setState({ daySize: Math.round((Helpers.pageWidth() - 90) / 7) });
    }

    if (width > 400 && this.state.daySize) {
      this.setState({ daySize: null });
    }

    if (width < 768 && this.state.numberOfMonthsToShow === 2) {
      this.setState({ numberOfMonthsToShow: 1 });
    }
    else if(width >= 768 && this.state.numberOfMonthsToShow === 1 ) {
      this.setState({ numberOfMonthsToShow: 2 });
    }
  }

  addError(error) {
    this.setState(prevState => ({ loadingRates: false }), () => { Alert.error(error); });
  }

  handleDatesChange(dates) {
    let quotation = this.state.quotation;
    quotation.start_at = dates.startDate.unix();

    if (dates.endDate) {
      quotation.end_at = dates.endDate.unix();
    }

    let newState = { quotation: quotation };
    let fetchQuotation = dates.startDate && dates.endDate;

    if (fetchQuotation) {
      newState.loadingRates = true;
    }

    this.setState(newState, () => {
      if (fetchQuotation) {
        ListingQuotationService.create(this.props.listing.id, quotation.start_at, quotation.end_at, false, {}, {})
                               .then(response => {
                                 this.setState({
                                   pricingQuote: response.data.data.pricing_quote,
                                   loadingRates: false
                                 });
                               })
                               .catch(error => { this.addError(Errors.extractErrorMessage(error)); });
      }
    });
  }

  renderBookingRates() {
    let pricingQuote = this.state.pricingQuote;
    let bookingRates = (<div></div>);

    if (this.state.loadingRates) {
      bookingRates = (<Loading />);
    }
    else if (Object.keys(pricingQuote).length > 0) {
      let bookingRatesContent = (
        <div className="text-center tertiary-text-color fs-18 text-secondary-font-weight">
          { LocalizationService.formatMessage('bookings.not_available') }
        </div>
      );

      if (pricingQuote.available) {
        bookingRatesContent = (
          <div className="col-xs-12 no-side-padding">
            {
              pricingQuote.price_items.map((priceItem, index) => {
                let className = 'book-now-tile-details-rate col-xs-12 no-side-padding text-capitalize tertiary-text-color fs-16 ls-dot-five';
                className += priceItem.type === 'TOTAL' ? ' subtitle-font-weight' : ' text-secondary-font-weight';

                return (
                  <div key={ 'booking_details_rate_' + index } className={ className }>
                    <div className="pull-left"> { priceItem.title } </div>
                    <div className="pull-right"> { priceItem.total.currency_symbol + priceItem.total.amount.toFixed(2) } </div>
                  </div>
                )
              })
            }
            <div className="col-xs-12 no-side-padding text-center">
              <Link to={{
                    pathname: `/listings/${this.props.listing.id}/bookings/new`,
                    state: {
                      listing: this.props.listing,
                      quotation: this.state.quotation,
                      pricingQuote: this.state.pricingQuote
                    }
                  }}>
                <button className="book-now-button btn secondary-color white-text fs-18">
                  { LocalizationService.formatMessage('bookings.book_now') }
                </button>
              </Link>
            </div>
          </div>
        );
      }

      bookingRates = (
        <div className="book-now-tile-details-rates col-xs-12 no-side-padding">
          { bookingRatesContent }
        </div>
      )
    }

    return bookingRates;
  }

  renderBookNowTileContent() {
    if (this.state.loading) {
      return (
        <div className="book-now-tile-details tertiary-text-color col-xs-12 no-side-padding">
          <Loading />
        </div>
      )
    }

    let bookNowTileContent = (
      <div className="book-now-tile-details tertiary-text-color col-xs-12 no-side-padding">
        { LocalizationService.formatMessage('bookings.log_in_before_booking') }
        <Button className="login-to-book-button secondary-color white-text" onClick={ () => { this.props.toggleModal('login') } }> { LocalizationService.formatMessage('authentication.log_in') } </Button>
      </div>
    );

    if (this.state.verificationsNeeded.length > 0) {
      bookNowTileContent = (
        <div className="book-now-tile-details tertiary-text-color col-xs-12 no-side-padding">
          { LocalizationService.formatMessage('bookings.verify_info_before_booking') }
          <Button className="login-to-book-button secondary-color white-text" onClick={ this.toggleUserVerificationModal }>
            { LocalizationService.formatMessage('bookings.verify_info') }
          </Button>
        </div>
      );
    }
    else if ( this.props.loggedIn ) {
      const startDate = this.state.quotation.start_at ? moment.unix(this.state.quotation.start_at) : null;
      const endDate = this.state.quotation.end_at ? moment.unix(this.state.quotation.end_at) : null;


      bookNowTileContent = (
        <div className="book-now-tile-details col-xs-12 no-side-padding">
          <div className="book-now-tile-datepicker-title col-xs-12 no-side-padding">
            <div className="tertiary-text-color">
              { LocalizationService.formatMessage('bookings.check_in_date') }
            </div>

            <div className="tertiary-text-color">
              { LocalizationService.formatMessage('bookings.check_out_date') }
            </div>
          </div>

          <DateRangePicker startDate={ startDate }
                          endDate={ endDate }
                          minimumNights={ 0 }
                          numberOfMonths={ this.state.numberOfMonthsToShow }
                          focusedInput={this.state.focusedInput}
                          onDatesChange={ this.handleDatesChange }
                          onFocusChange={ focusedInput => this.setState({ focusedInput }) }
                          hideKeyboardShortcutsPanel={ true }
                          isDayBlocked={ (day) => day.utc().isBefore(moment().utc()) } />

          { this.renderBookingRates() }
        </div>
      )
    }

    return bookNowTileContent;
  }

  render() {
    let listing = this.props.listing;
    let pricePerDay = LocalizationService.formatMessage('listings.price_per_day',
                                                        { currency_symbol: listing.country_configuration.country.currency_symbol,
                                                          price: listing.price / 100 }
                                                        );

    return (
      <div className="book-now-tile">
        <div className="book-now-tile-title secondary-color white-text ls-dot-two col-xs-12 no-side-padding">

          { LocalizationService.formatMessage('bookings.book_now_from') }

          <b> { ` ${ pricePerDay }` } </b>
        </div>

        { this.renderBookNowTileContent() }

        <UserVerificationModal finishAction={ this.afterVerificationAction } closeModal={ this.closeVerificationModal } configurations={ this.props.configurations } open={ this.state.showUserVerificationModal } toggleModal={ this.toggleUserVerificationModal } scope={ 'renter' } user={ this.state.user } />
      </div>
    );
  }
}

BookNowTile.propTypes = {
  listing: PropTypes.object.isRequired,
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj,
  handleBookButtonClick: PropTypes.func
};

export default BookNowTile;
