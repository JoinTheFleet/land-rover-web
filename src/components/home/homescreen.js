import React, {
  Component
} from 'react';

import {
  injectIntl,
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';
import ListingList from '../listings/listing_list';
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

import LocationPeriodFilter from '../listings/filters/location_period_filter';
import momentPropTypes from 'react-moment-proptypes';

class Homescreen extends Component {
  render() {
    console.log(this.props)
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
            <LocationPeriodFilter {...this.props} />
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
        <ListingList />

        <FeaturesList />

        <Testimonials />

        <BlogList />

        <div id="featured_in_div" className="col-xs-12 text-center">
          <span className="tertiary-text-color">
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
  handleLocationChange: PropTypes.func.isRequired,
  handleLocationFocus: PropTypes.func.isRequired,
  handleDatesChange: PropTypes.func.isRequired,
  handleLocationSelect: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj,
  locationName: PropTypes.string,
  searchLocations: PropTypes.array,
  showSearchButton: PropTypes.bool
}
