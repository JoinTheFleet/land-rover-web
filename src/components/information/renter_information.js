import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import LocalizationService from '../../shared/libraries/localization_service';

import FeaturedIn from './featured_in';
import Card from './card';
import FAQ from './faq';

import fleetChoice from '../../assets/images/fleet-choice.png';
import fleetConvenience from '../../assets/images/fleet-convenience.png';
import fleetDoneRight from '../../assets/images/fleet-doneright.png';
import fleetApp from '../../assets/images/fleet-app.png';
import fleetIOS from '../../assets/images/appstore.png';
import fleetAndroid from '../../assets/images/playstore.png';

export default class RenterInformation extends Component {
  render() {
    return (
      <div className='col-xs-12 no-side-padding information renter'>
        <div className='col-xs-12 no-side-padding hero renter'>
          <div className='col-xs-12 col-xs-offset-0 col-sm-6 col-md-4 col-md-offset-2 hero-panel'>
            <div className='cta'>
              <div className='header'>
                { LocalizationService.formatMessage('renter_information.title') }
              </div>
              <div className='text'>
                { LocalizationService.formatMessage('renter_information.subtitle') }
              </div>
            </div>
          </div>
          <div className='col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-6 col-md-5 col-md-offset-6 hero-panel cta-panel'>
            <div className='start-cta-holder'>
              <div className='start-cta'>
                <div className='text-left header'>
                  { LocalizationService.formatMessage('renter_information.prompt_1') }
                </div>
                <div className='text-left subheader'>
                  { LocalizationService.formatMessage('renter_information.prompt_2') }
                </div>
                <div className='text-left text'>
                  <ul>
                    <li>{ LocalizationService.formatMessage('renter_information.point_1') }</li>
                    <li>{ LocalizationService.formatMessage('renter_information.point_2') }</li>
                    <li>{ LocalizationService.formatMessage('renter_information.point_3') }</li>
                    <li>{ LocalizationService.formatMessage('renter_information.point_4') }</li>
                    <li>{ LocalizationService.formatMessage('renter_information.point_5') }</li>
                  </ul>
                </div>
                <div className='btn btn-join' onClick={() => { this.props.toggleModal('registration') }} >
                  { LocalizationService.formatMessage('renter_information.join_free') }
                </div>
              </div>
            </div>
          </div>
          <div className='col-xs-12 no-side-padding card-overlay hidden-xs'>
            <div className='col-xs-12 col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2 cards'>
              <Card className='col-xs-4'
                    alt='Key'
                    title={ LocalizationService.formatMessage('renter_information.card_1_title') }
                    text={ LocalizationService.formatMessage('renter_information.card_1_text') }
                    img={ fleetChoice } />
              <Card className='col-xs-4'
                    alt='Squares'
                    title={ LocalizationService.formatMessage('renter_information.card_2_title') }
                    text={ LocalizationService.formatMessage('renter_information.card_2_text') }
                    img={ fleetConvenience } />
              <Card className='col-xs-4'
                    alt='AXA'
                    title={ LocalizationService.formatMessage('renter_information.card_3_title') }
                    text={ LocalizationService.formatMessage('renter_information.card_3_text') }
                    img={ fleetDoneRight } />
            </div>
          </div>
        </div>
        <div className='col-xs-12 visible-xs cards'>
          <Card className='col-xs-12'
                alt='Key'
                title={ LocalizationService.formatMessage('renter_information.card_1_title') }
                text={ LocalizationService.formatMessage('renter_information.card_1_text') }
                img={ fleetChoice } />
          <Card className='col-xs-12'
                alt='Squares'
                title={ LocalizationService.formatMessage('renter_information.card_2_title') }
                text={ LocalizationService.formatMessage('renter_information.card_2_text') }
                img={ fleetConvenience } />
          <Card className='col-xs-12'
                alt='AXA'
                title={ LocalizationService.formatMessage('renter_information.card_3_title') }
                text={ LocalizationService.formatMessage('renter_information.card_3_text') }
                img={ fleetDoneRight } />
        </div>
        <FeaturedIn />
        <FAQ title={ LocalizationService.formatMessage('renter_information.faq') }
             faqPrefix='renter_information.faq_'
             faqCount={ 5 } />
        <div className='faq-cta col-xs-12 text-center' dangerouslySetInnerHTML={ {__html: LocalizationService.formatMessage('renter_information.faq_cta')} } />
        <div className='col-xs-12 no-side-padding subhero renter'>
          <div className='col-xs-12 know-more text-center'>
            <div className='header'>
              { LocalizationService.formatMessage('renter_information.drive_dream') }
            </div>
            <div className='subheader'>
              { LocalizationService.formatMessage('renter_information.cars_available') }
            </div>
            <Link to='/search' className='btn btn-join'>
              { LocalizationService.formatMessage('renter_information.learn_more') }
            </Link>
          </div>
        </div>
        <div className='col-xs-12 col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2 no-side-padding on-your-phone'>
          <div className='col-xs-12 col-sm-6 visible-xs'>
            <img src={ fleetApp } className='app-preview' alt='App' />
          </div>
          <div className='col-xs-12 col-sm-6 no-side-padding container'>
            <div className='get-fleet'>
              <div className='header'>
                { LocalizationService.formatMessage('renter_information.get_fleet') }
              </div>
              <div className='subheader'>
                { LocalizationService.formatMessage('renter_information.available_on') }
              </div>
              <div className='text'>
                <ul>
                  <li>{ LocalizationService.formatMessage('renter_information.app_point_1') }</li>
                  <li>{ LocalizationService.formatMessage('renter_information.app_point_2') }</li>
                  <li>{ LocalizationService.formatMessage('renter_information.app_point_3') }</li>
                </ul>
              </div>
              <div className='buttons no-side-padding col-xs-12'>
                <div className='ios'>
                  <a href={ process.env.REACT_APP_APP_STORE }><img src={ fleetIOS } alt='iOS App Store' /></a>
                </div>
                <div className='android'>
                <a href={ process.env.REACT_APP_PLAY_STORE }><img src={ fleetAndroid } alt='Android App Store' /></a>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 hidden-xs'>
            <img src={ fleetApp } className='app-preview' alt='App' />
          </div>
        </div>
      </div>
    );
  }
}
