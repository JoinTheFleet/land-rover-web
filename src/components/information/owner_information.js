import React, { Component } from 'react';
import LocalizationService from '../../shared/libraries/localization_service';

import FeaturedIn from './featured_in';
import Card from './card';
import FAQ from './faq';

import fleetAXA from '../../assets/images/fleet-axa.png';
import fleetKey from '../../assets/images/fleet-key.png';
import fleetSquares from '../../assets/images/fleet-squares.png';

export default class OwnerInformation extends Component {
  render() {
    return (
      <div className='col-xs-12 no-side-padding information'>
        <div className='col-xs-12 no-side-padding hero owner'>
          <div className='col-xs-12 col-xs-offset-0 col-sm-4 col-sm-offset-2 hero-panel'>
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
                <div className='btn btn-join' onClick={() => { this.props.toggleModal('registration') }} >
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
                    title={ LocalizationService.formatMessage('owner_information.card_2_title') }
                    text={ LocalizationService.formatMessage('owner_information.card_2_text') }
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
                title={ LocalizationService.formatMessage('owner_information.card_2_title') }
                text={ LocalizationService.formatMessage('owner_information.card_2_text') }
                img={ fleetAXA } />
        </div>
        <FeaturedIn />
        <FAQ title={ LocalizationService.formatMessage('owner_information.faq') }
             faqPrefix='owner_information.faq_'
             faqCount={ 5 } />
        <div className='col-xs-12 no-side-padding know-more'>
        </div>
        <div className='col-xs-12 no-side-padding on-your-phone'>
        </div>
      </div>
    );
  }
}
