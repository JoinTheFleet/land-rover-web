import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ListingList from '../listings/listing_list'
import ListingsHandler from '../../api_handlers/listings_handler'
import FeaturesList from './features_list';
import Testimonials from './testimonials';
import BlogList from './blog_list';

// Images
import topBanner from '../../assets/images/beach-cars-bmw.jpg';
import axaLogo from '../../assets/images/axa-logo.png';
import independentLogo from '../../assets/images/independent-grey.png';
import newstalkLogo from '../../assets/images/newstalk-grey.png';
import foraLogo from '../../assets/images/fora-grey.png';
import rteradioLogo from '../../assets/images/rte-radio-1-grey.png';
import irishtimesLogo from '../../assets/images/irish-times-grey.png';

class Homescreen extends Component {

  handleSearchFormSubmit(event) {
    event.preventDefault();

    let location = document.getElementById('global_search_location').value;
    let dates = document.getElementById('global_search_dates').value;

    this.props.addSearchParamHandler({ location: location, dates: dates });
  }

  render(){
    return (
      <div>
        <div id="homescreen_top_banner">
          <img src={topBanner} alt="homescreen_top_banner" id="homescreen_top_banner_bg" />
          <div id="homescreen_top_banner_content" className="white-text">
            <p>
              <span className="title-font-weight title-font-size ls-dot-five text-uppercase">
                <FormattedMessage id="homescreen.top_banner_title" />
              </span>
              <br/>
              <span className="light-font-weight fs-20 ls-dot-five">
                <FormattedMessage id="homescreen.top_banner_slogan" />
              </span>
            </p>
            <form id="homescreen_search_form" className="global-search-form" onSubmit={(event) => { this.handleSearchFormSubmit(event) }}>
              <input type="text" name="global_search[location]" id="global_search_location" placeholder={this.props.intl.formatMessage({id: 'application.location'})} />
              <input type="text" name="global_search[dates]" id="global_search_dates" placeholder={this.props.intl.formatMessage({id: 'application.dates'})} />
              <button className="btn secondary-color white-text">
                <FormattedMessage id="application.search" />
              </button>
            </form>
          </div>
          <div id="homescreen_top_banner_insurance_div" className="twilight-blue fs-20 ls-dot-five white-text text-uppercase">
            <FormattedMessage id="homescreen.insurance_partner" />
          </div>
        </div>

        <div id="homescreen_axa_banner" className="text-center">
          <img src={axaLogo} alt="homescreen_axa_banner" />
        </div>

        <p className="top-seller-title strong-font-weight title-font-size">
          <FormattedMessage id="listings.top_seller" />
        </p>
        <ListingList accessToken={this.props.accessToken} listingsHandler={ListingsHandler} />

        <FeaturesList />

        <Testimonials />

        <BlogList />

        <div id="featured_in_div" className="text-center">
          <span className="terciary-text-color">
            <FormattedMessage id="homescreen.featured_in" />
          </span>
          <img src={independentLogo} alt="Independent logo" />
          <img src={newstalkLogo} alt="Newstalk logo" />
          <img src={foraLogo} alt="Fora logo" />
          <img src={rteradioLogo} alt="RTE Radio logo" />
          <img src={irishtimesLogo} alt="Irish Times logo" />
        </div>
      </div>
    )
  }
}

export default injectIntl(Homescreen)

Homescreen.propTypes = {
  accessToken: PropTypes.string,
  addSearchParamHandler: PropTypes.func
}
