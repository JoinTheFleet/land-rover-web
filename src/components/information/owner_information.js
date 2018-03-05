import React, { Component } from 'react';
import LocalizationService from '../../shared/libraries/localization_service';

import FeaturedIn from './featured_in';
import Card from './card';
import FAQ from './faq';

import fleetAXA from '../../assets/images/fleet-axa.png';
import fleetKey from '../../assets/images/fleet-key.png';
import fleetSquares from '../../assets/images/fleet-squares.png';
import fleetApp from '../../assets/images/fleet-app.png';
import fleetIOS from '../../assets/images/appstore.png';
import fleetAndroid from '../../assets/images/playstore.png';

export default class OwnerInformation extends Component {
  render() {
    return (
      <div className='col-xs-12 no-side-padding information'>
        <div className='col-xs-12 no-side-padding hero owner'>
          <div className='col-xs-12 col-xs-offset-0 col-sm-6 col-md-4 col-md-offset-2 hero-panel'>
            <div className='cta'>
              <div className='header'>
                { LocalizationService.formatMessage('owner_information.title') }
              </div>
              <div className='text'>
                { LocalizationService.formatMessage('owner_information.subtitle') }
              </div>
            </div>
          </div>
          <div className='col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-6 col-md-5 col-md-offset-6 hero-panel cta-panel'>
            <div className='start-cta-holder'>
              <div className='start-cta'>
                <div className='text-left header'>
                  { LocalizationService.formatMessage('owner_information.prompt_1') }
                </div>
                <div className='text-left subheader'>
                  { LocalizationService.formatMessage('owner_information.prompt_2') }
                </div>
                <div className='text-left text'>
                  <ul>
                    <li>{ LocalizationService.formatMessage('owner_information.point_1') }</li>
                    <li>{ LocalizationService.formatMessage('owner_information.point_2') }</li>
                    <li>{ LocalizationService.formatMessage('owner_information.point_3') }</li>
                    <li>{ LocalizationService.formatMessage('owner_information.point_4') }</li>
                  </ul>
                </div>
                <div className='btn btn-join' onClick={() => { this.props.toggleModal('registration', 'owner') }} >
                  { LocalizationService.formatMessage('owner_information.join_free') }
                </div>
              </div>
            </div>
          </div>
          <div className='col-xs-12 no-side-padding card-overlay hidden-xs'>
            <div className='col-xs-12 col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2 cards'>
              <Card className='col-xs-4'
                    alt='Key'
                    title={ LocalizationService.formatMessage('owner_information.card_1_title') }
                    text={ LocalizationService.formatMessage('owner_information.card_1_text') }
                    img={ fleetKey } />
              <Card className='col-xs-4'
                    alt='Squares'
                    title={ LocalizationService.formatMessage('owner_information.card_2_title') }
                    text={ LocalizationService.formatMessage('owner_information.card_2_text') }
                    img={ fleetSquares } />
              <Card className='col-xs-4'
                    alt='AXA'
                    title={ LocalizationService.formatMessage('owner_information.card_3_title') }
                    text={ LocalizationService.formatMessage('owner_information.card_3_text') }
                    img={ fleetAXA } />
            </div>
          </div>
        </div>
        <div className='col-xs-12 visible-xs cards'>
          <Card className='col-xs-12'
                alt='Key'
                title={ LocalizationService.formatMessage('owner_information.card_1_title') }
                text={ LocalizationService.formatMessage('owner_information.card_1_text') }
                img={ fleetKey } />
          <Card className='col-xs-12'
                alt='Squares'
                title={ LocalizationService.formatMessage('owner_information.card_2_title') }
                text={ LocalizationService.formatMessage('owner_information.card_2_text') }
                img={ fleetSquares } />
          <Card className='col-xs-12'
                alt='AXA'
                title={ LocalizationService.formatMessage('owner_information.card_3_title') }
                text={ LocalizationService.formatMessage('owner_information.card_3_text') }
                img={ fleetAXA } />
        </div>
        <FeaturedIn />
        <FAQ title={ LocalizationService.formatMessage('owner_information.faq') }
             faqPrefix='owner_information.faq_'
             faqCount={ 5 } />
        <div className='col-xs-12 no-side-padding subhero owner'>
          <div className='col-xs-12 know-more text-center'>
            <div className='header'>
              { LocalizationService.formatMessage('owner_information.know_more') }
            </div>
            <div className='subheader'>
              { LocalizationService.formatMessage('owner_information.help_guide') }
            </div>
            <a className='btn btn-join' href={ process.env.REACT_APP_OWNER_HELP }>
              { LocalizationService.formatMessage('owner_information.learn_more') }
            </a>
          </div>
        </div>
        <div className='col-xs-12 col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2 no-side-padding on-your-phone'>
          <div className='col-xs-12 col-sm-6 visible-xs'>
            <img src={ fleetApp } className='app-preview' alt='App' />
          </div>
          <div className='col-xs-12 col-sm-6 no-side-padding container'>
            <div className='get-fleet'>
              <div className='header'>
                { LocalizationService.formatMessage('owner_information.get_fleet') }
              </div>
              <div className='subheader'>
                { LocalizationService.formatMessage('owner_information.available_on') }
              </div>
              <div className='text'>
                <ul>
                  <li>{ LocalizationService.formatMessage('owner_information.app_point_1') }</li>
                  <li>{ LocalizationService.formatMessage('owner_information.app_point_2') }</li>
                  <li>{ LocalizationService.formatMessage('owner_information.app_point_3') }</li>
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
