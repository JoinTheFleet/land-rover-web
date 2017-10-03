import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import FeatureTile from './feature_tile';

import searchIcon from '../../assets/images/search.png';
import bookIcon from '../../assets/images/book.png';
import chatIcon from '../../assets/images/chat.png';
import accountIcon from '../../assets/images/account.png';
import calendarIcon from '../../assets/images/calendar.png';
import groupIcon from '../../assets/images/group.png';

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

          <FeatureTile icon={searchIcon} titleMessageId="homescreen.pick_a_car" textMessageId="homescreen.pick_a_car_text" />
          <FeatureTile icon={bookIcon} titleMessageId="homescreen.book_a_car" textMessageId="homescreen.book_a_car_text" />
          <FeatureTile icon={chatIcon} titleMessageId="homescreen.meet_the_owner" textMessageId="homescreen.meet_the_owner_text" />
        </div>

        <div id="making_car_work_for_you_div" className="col-xs-12 text-center">
          <p>
            <span className="title-font-size strong-font-weight text-uppercase">
              <FormattedMessage id="homescreen.how_it_works" />
            </span>
            <br/>
            <span className="subtitle-font-size">
              <FormattedMessage id="homescreen.making_car_work_for_you" />
            </span>
          </p>

          <FeatureTile icon={accountIcon} titleMessageId="homescreen.create_profile" textMessageId="homescreen.create_profile_text" />
          <FeatureTile icon={calendarIcon} titleMessageId="homescreen.receive_bookings" textMessageId="homescreen.receive_bookings_text" />
          <FeatureTile icon={groupIcon} titleMessageId="homescreen.meet_the_driver" textMessageId="homescreen.meet_the_driver_text" />
        </div>
      </div>
    )
  }
}
