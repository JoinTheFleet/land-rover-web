import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

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

          <div className="col-xs-12 col-sm-4 text-center">
            <img src={searchIcon} alt="search_icon" />
            <p>
              <span className="subtitle-font-size subtitle-font-weight secondary-text-color text-uppercase">
                <FormattedMessage id="homescreen.pick_a_car" />
              </span>
              <br/>
              <FormattedMessage id="homescreen.pick_a_car_text" />
            </p>
          </div>

          <div className="col-xs-12 col-sm-4 text-center">
            <img src={bookIcon} alt="book_icon" />
            <p>
              <span className="subtitle-font-size subtitle-font-weight secondary-text-color text-uppercase">
                <FormattedMessage id="homescreen.book_a_car" />
              </span>
              <br/>
              <FormattedMessage id="homescreen.book_a_car_text" />
            </p>
          </div>

          <div className="col-xs-12 col-sm-4 text-center">
            <img src={chatIcon} alt="chat_icon" />
            <p>
              <span className="subtitle-font-size subtitle-font-weight secondary-text-color text-uppercase">
                <FormattedMessage id="homescreen.meet_the_owner" />
              </span>
              <br/>
              <FormattedMessage id="homescreen.meet_the_owner_text" />
            </p>
          </div>
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

          <div className="col-xs-12 col-sm-4 text-center">
            <img src={accountIcon} alt="account_icon" />
            <p>
              <span className="subtitle-font-size subtitle-font-weight secondary-text-color text-uppercase">
                <FormattedMessage id="homescreen.create_profile" />
              </span>
              <br/>
              <FormattedMessage id="homescreen.create_profile_text" />
            </p>
          </div>

          <div className="col-xs-12 col-sm-4 text-center">
            <img src={calendarIcon} alt="calendar_icon" />
            <p>
              <span className="subtitle-font-size subtitle-font-weight secondary-text-color text-uppercase">
                <FormattedMessage id="homescreen.receive_bookings" />
              </span>
              <br/>
              <FormattedMessage id="homescreen.receive_bookings_text" />
            </p>
          </div>

          <div className="col-xs-12 col-sm-4 text-center">
            <img src={groupIcon} alt="group_icon" />
            <p>
              <span className="subtitle-font-size subtitle-font-weight secondary-text-color text-uppercase">
                <FormattedMessage id="homescreen.meet_the_driver" />
              </span>
              <br/>
              <FormattedMessage id="homescreen.meet_the_driver_text" />
            </p>
          </div>
        </div>
      </div>
    )
  }
}
