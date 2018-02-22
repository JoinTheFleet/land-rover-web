import React, { Component } from 'react';
import LocalizationService from '../../shared/libraries/localization_service';

import independentLogo from '../../assets/images/independent-grey.png';
import newstalkLogo from '../../assets/images/newstalk-grey.png';
import foraLogo from '../../assets/images/fora-grey.png';
import rteradioLogo from '../../assets/images/rte-radio-1-grey.png';
import irishtimesLogo from '../../assets/images/irish-times-grey.png';

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
              </div>
            </div>
          </div>
          <div className='col-xs-12 no-side-padding card-overlay hidden-xs'>
            <div className='col-xs-12 col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2 cards'>
              <div className='col-xs-4 card'>
                <div className='image'>
                  <img src={ fleetKey } alt='Key' />
                </div>
                <div className='header'>
                  { LocalizationService.formatMessage('owner_information.card_1_title') }
                </div>
                <div className='text'>
                  { LocalizationService.formatMessage('owner_information.card_1_text') }
                </div>
              </div>
              <div className='col-xs-4 card'>
                <div className='image'>
                  <img src={ fleetSquares } alt='Squares' />
                </div>
                <div className='header'>
                  { LocalizationService.formatMessage('owner_information.card_2_title') }
                </div>
                <div className='text'>
                    { LocalizationService.formatMessage('owner_information.card_2_text') }
                </div>
              </div>
              <div className='col-xs-4 card'>
                <div className='image'>
                  <img src={ fleetAXA } alt='AXA' />
                </div>
                <div className='header'>
                  { LocalizationService.formatMessage('owner_information.card_3_title') }
                </div>
                <div className='text'>
                  { LocalizationService.formatMessage('owner_information.card_3_text') }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-xs-12 visible-xs cards'>
          <div className='col-xs-12 card'>
            <div className='image'>
              <img src={ fleetKey } alt='Key' />
            </div>
            <div className='header'>
              { LocalizationService.formatMessage('owner_information.card_1_title') }
            </div>
            <div className='text'>
              { LocalizationService.formatMessage('owner_information.card_1_text') }
            </div>
          </div>
          <div className='col-xs-12 card'>
            <div className='image'>
              <img src={ fleetSquares } alt='Squares' />
            </div>
            <div className='header'>
              { LocalizationService.formatMessage('owner_information.card_2_title') }
            </div>
            <div className='text'>
                { LocalizationService.formatMessage('owner_information.card_2_text') }
            </div>
          </div>
          <div className='col-xs-12 card'>
            <div className='image'>
              <img src={ fleetAXA } alt='AXA' />
            </div>
            <div className='header'>
              { LocalizationService.formatMessage('owner_information.card_3_title') }
            </div>
            <div className='text'>
              { LocalizationService.formatMessage('owner_information.card_3_text') }
            </div>
          </div>
        </div>
        <div id='featured_in_div' className='col-xs-12 no-side-padding featured text-center'>
          <span className="tertiary-text-color">
            { LocalizationService.formatMessage('homescreen.featured_in') }
          </span>
          <img src={independentLogo} alt="Independent logo" />
          <img src={newstalkLogo} alt="Newstalk logo" />
          <img src={foraLogo} alt="Fora logo" />
          <img src={rteradioLogo} alt="RTE Radio logo" />
          <img src={irishtimesLogo} alt="Irish Times logo" />
        </div>
        <div className='col-xs-12 no-side-padding faqs'>
        </div>
        <div className='col-xs-12 no-side-padding know-more'>
        </div>
        <div className='col-xs-12 no-side-padding on-your-phone'>
        </div>
      </div>
    );
  }
}
