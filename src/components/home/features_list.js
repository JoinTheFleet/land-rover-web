import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import FeatureTile from './feature_tile';

import availableCars from '../../assets/images/available-cars-large.png';
import bookRental from '../../assets/images/book-for-rental-large.png';
import collectCar from '../../assets/images/collect-the-car-large.png';
import listCar from '../../assets/images/list-car-for-rent-large.png';
import rentalBooking from '../../assets/images/rental-booking-large.png';
import meetRenter from '../../assets/images/meet-the-renter-large.png';

export default class FeaturesList extends Component {
  render() {
    return (
      <div id="how_it_works_div" className="col-xs-12">
        <div id="renting_a_car_div" className="col-xs-12 text-center">
          <p>
            <span className="title-font-size strong-font-weight text-uppercase">
              <FormattedMessage id="homescreen.how_it_works" />
            </span>
            <br/>
            <span className="subtitle-font-size">
              <FormattedMessage id="homescreen.renting_a_car" />
            </span>
          </p>

          <FeatureTile icon={availableCars} titleMessageId="homescreen.pick_a_car" textMessageId="homescreen.pick_a_car_text" />
          <FeatureTile icon={bookRental} titleMessageId="homescreen.book_a_car" textMessageId="homescreen.book_a_car_text" />
          <FeatureTile icon={collectCar} titleMessageId="homescreen.meet_the_owner" textMessageId="homescreen.meet_the_owner_text" />
        </div>
      </div>
    )
  }
}
