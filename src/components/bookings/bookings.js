import React, { Component } from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

import BookingForm from './forms/booking_form';

import Constants from '../../miscellaneous/constants';
import Helpers from '../../miscellaneous/helpers';

const bookingsViews = Constants.bookingsViews();

class Bookings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: this.props.currentView || bookingsViews.index,
      listing: this.props.listing || {}
    };
  }

  setCurrentView(view, params) {
    let newState = { currentView: view };
    let additionalParams = params || {};

    this.setState(Helpers.extendObject(newState, additionalParams));
  }

  getViewToRender() {
    let viewToRender;

    switch(this.state.currentView) {
      case bookingsViews.new:
        viewToRender = (<BookingForm listing={ this.state.listing } pricingQuote={ this.props.pricingQuote } />);
        break;
      case bookingsViews.edit:
        break;
      case bookingsViews.view:
        break;
      default:
        viewToRender = (<div></div>);
    }

    return viewToRender;
  }

  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        { this.getViewToRender() }
      </div>
    );
  }
}

Bookings.propTypes = {
  listing: PropTypes.object,
  currentPricingQuote: PropTypes.object,
  currentView: PropTypes.oneOf(Constants.bookingsViews())
};

export default Bookings;
