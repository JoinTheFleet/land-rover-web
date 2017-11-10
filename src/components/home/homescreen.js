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

import MediumService from '../../shared/services/medium_service';

import Errors from '../../miscellaneous/errors';

class Homescreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blog: {
        posts: [],
        authors: {}
      },
      loadingPosts: false
    };
  }

  componentWillMount() {
    let referralCode = this.props.match.params.referral_code;

    if (referralCode) {
      this.props.handleReferral(referralCode);
    }
  }

  componentDidMount() {
    this.setState({ loadingPosts: true }, () => {
      MediumService.show()
                   .then(response => {
                     this.setState({
                       blog: {
                         posts: response.data.data.posts.payload.posts,
                         authors: response.data.data.posts.payload.references.User
                       },
                       loadingPosts: false
                     });
                   })
                   .catch(error => Errors.extractErrorMessage(error));
    });
  }

  render() {
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

        <BlogList posts={ this.state.blog.posts } authors={ this.state.blog.authors } loading={ this.state.loadingPosts } />

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
