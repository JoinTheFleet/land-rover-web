import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import facebookIcon from '../../assets/images/facebook.png';
import twitterIcon from '../../assets/images/twitter.png';
import instagramIcon from '../../assets/images/instagram.png';

import LocalizationService from '../../shared/libraries/localization_service';

export default class Footer extends Component {

  render() {
    let promotedLocations = [];

    let makeYourCarWorkLink = (
      <a className="white-text" onClick={ () => { this.props.toggleModal('login') }}>
        <FormattedMessage id="footer.make_your_car" />
      </a>
    )

    if (this.props.loggedIn) {
      makeYourCarWorkLink = (
        <Link to="/listings">
          <span className="white-text">
            <FormattedMessage id="footer.make_your_car" />
          </span>
        </Link>
      )
    }

    for (let i = 1; i <= 4; i++) {
      let promotedLocation = (
        <div>
          <Link to="/search"
                onClick={ () => {
                  this.props.search({
                    locationName: process.env[`REACT_APP_LOCATION_${i}_NAME`],
                    latitude: parseFloat(process.env[`REACT_APP_LOCATION_${i}_LAT`]),
                    longitude: parseFloat(process.env[`REACT_APP_LOCATION_${i}_LNG`])
                  });
                }} >
            <span className="white-text">
              { process.env[`REACT_APP_LOCATION_${i}_NAME`] }
            </span>
          </Link>
          <br />
        </div>
      );

      promotedLocations.push(promotedLocation);
    }

    return (
      <footer id="footer" className="col-xs-12 white-text text-secondary-font-weight ls-dot-five" style={{backgroundColor: 'black'}}>
        <div id="footer_top_part" className="col-xs-12">

          <div className="hidden-xs col-sm-3">
            <span className="fs-20">
              <FormattedMessage id="footer.get_started" />
            </span>
            <p className="footer-links-list">
              <a href={ LocalizationService.formatMessage('company_info.ios_app') } target="_blank" className="white-text">
                <FormattedMessage id="footer.get_iphone_app" />
              </a>
              <br/>
              <a href={ LocalizationService.formatMessage('company_info.android_app') } target="_blank" className="white-text">
                <FormattedMessage id="footer.get_android_app" />
              </a>
              <br/>
              <Link to="/search">
                <span className="white-text">
                  <FormattedMessage id="footer.rent_a_car" />
                </span>
              </Link>
              <br/>
              { makeYourCarWorkLink }
            </p>
          </div>

          <div className="hidden-xs col-sm-3">
            <span className="fs-20">
              <FormattedMessage id="footer.learn_more" />
            </span>
            <p className="footer-links-list">
              <a href={ process.env.REACT_APP_FLEET_SUPPORT_URL } target="_blank" className="white-text">
                <FormattedMessage id="footer.customer_service" />
              </a>
              <br/>
              <a href={ process.env.REACT_APP_FLEET_TERMS_URL } target="_blank" className="white-text">
                <FormattedMessage id="footer.terms_and_conditions" />
              </a>
              <br/>
              <a href={ process.env.REACT_APP_FLEET_SUPPORT_URL } target="_blank" className="white-text">
                <FormattedMessage id="footer.faqs" />
              </a>
              <br/>
              <a href={ process.env.REACT_APP_FLEET_PRIVACY_URL } target="_blank" className="white-text">
                <FormattedMessage id="footer.privacy" />
              </a>
            </p>
          </div>

          <div className="hidden-xs col-sm-3">
            <span className="fs-20">
              <FormattedMessage id="footer.top_destinations" />
            </span>
            <p className="footer-links-list">
              { promotedLocations }
            </p>
          </div>

          <div className="hidden-xs col-sm-3">
            <span className="fs-20">
              <FormattedMessage id="footer.get_in_touch" />
            </span>
            <div className="footer-links-list">
              <a href={ process.env.REACT_APP_FLEET_BLOG_URL } target="_blank" className="white-text">
                Contact Us
              </a>
              <br/>
              <a href={'mailto:' + LocalizationService.formatMessage('company_info.info_email') } className="white-text">
                <FormattedMessage id="company_info.info_email" />
              </a>
            </div>
          </div>

          <div className="visible-xs text-center">
            <div id="footer_social_links_mobile">
              <a href={ LocalizationService.formatMessage('company_info.facebook') } target="_blank">
                <img src={facebookIcon} alt="fleet_facebook" />
              </a>
            </div>
          </div>
        </div>

        <div id="footer_bottom_part" className="col-xs-12">
          <div className="col-sm-4">
            <span className="white-text">
              <FormattedMessage id="footer.copyrights" values={ { year: new Date().getFullYear() } } />
            </span>
          </div>
          <div className="col-sm-8">
            <span className="white-text">

            </span>
          </div>
        </div>
      </footer>
    )
  }
}
