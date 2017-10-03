import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import facebookIcon from '../../assets/images/facebook.png';
import twitterIcon from '../../assets/images/twitter.png';
import instagramIcon from '../../assets/images/instagram.png';

class Footer extends Component {
  render() {
    return (
      <footer id="footer" className="col-xs-12 secondary-color white-text text-secondary-font-weight ls-dot-five">
        <div id="footer_top_part">

          <div className="hidden-xs col-sm-6 col-md-3">
            <span className="fs-20">
              <FormattedMessage id="footer.get_started" />
            </span>
            <p className="footer-links-list">
              <a href={this.props.intl.formatMessage({id: 'company_info.ios_app'})} target="_blank" className="white-text">
                <FormattedMessage id="footer.get_iphone_app" />
              </a>
              <br/>
              <a href={this.props.intl.formatMessage({id: 'company_info.android_app'})} target="_blank" className="white-text">
                <FormattedMessage id="footer.get_android_app" />
              </a>
              <br/>
              <a className="white-text">
                <FormattedMessage id="footer.rent_a_car" />
              </a>
              <br/>
              <a className="white-text">
                <FormattedMessage id="footer.make_your_car" />
              </a>
            </p>
          </div>

          <div className="hidden-xs col-sm-6 col-md-3">
            <span className="fs-20">
              <FormattedMessage id="footer.learn_more" />
            </span>
            <p className="footer-links-list">
              <a href={this.props.intl.formatMessage({id: 'company_info.customer_service'})} target="_blank" className="white-text">
                <FormattedMessage id="footer.customer_service" />
              </a>
              <br/>
              <a href={this.props.intl.formatMessage({id: 'company_info.terms_and_conditions'})} target="_blank" className="white-text">
                <FormattedMessage id="footer.terms_and_conditions" />
              </a>
              <br/>
              <a href={this.props.intl.formatMessage({id: 'company_info.faqs'})} target="_blank" className="white-text">
                <FormattedMessage id="footer.faqs" />
              </a>
            </p>
          </div>

          <div className="hidden-xs col-sm-6 col-md-3">
            <span className="fs-20">
              <FormattedMessage id="footer.top_destinations" />
            </span>
            <p className="footer-links-list">
              <a className="white-text">
                <FormattedMessage id="locations.dublin" />
              </a>
              <br/>
              <a className="white-text">
                <FormattedMessage id="locations.galway" />
              </a>
              <br/>
              <a className="white-text">
                <FormattedMessage id="locations.cork" />
              </a>
              <br/>
              <a className="white-text">
                <FormattedMessage id="locations.wicklow" />
              </a>
            </p>
          </div>

          <div className="hidden-xs col-sm-6 col-md-3">
            <span className="fs-20">
              <FormattedMessage id="footer.get_in_touch" />
            </span>
            <div className="footer-links-list">
              <div id="footer_social_links">
                <a href={ this.props.intl.formatMessage({id: 'company_info.facebook'}) } target="_blank">
                  <img src={facebookIcon} alt="fleet_facebook" />
                </a>
                <a href={ this.props.intl.formatMessage({id: 'company_info.twitter'}) } target="_blank">
                  <img src={twitterIcon} alt="fleet_twitter" />
                </a>
                <a href={ this.props.intl.formatMessage({id: 'company_info.instagram'}) } target="_blank">
                  <img src={instagramIcon} alt="fleet_instagram" />
                </a>
              </div>

              <a href={ this.props.intl.formatMessage({id: 'company_info.blog'}) } target="_blank" className="white-text">
                <FormattedMessage id="footer.read_our_blog" />
              </a>
              <br/>
              <a href={'mailto:' + this.props.intl.formatMessage({id: 'company_info.info_email'})} className="white-text">
                <FormattedMessage id="company_info.info_email" />
              </a>
            </div>
          </div>
        </div>

        <div id="footer_bottom_part">
          <span className="white-text">
            <FormattedMessage id="footer.copyrights" values={ { year: new Date().getFullYear() } } />
          </span>
        </div>
      </footer>
    )
  }
}

export default injectIntl(Footer)
