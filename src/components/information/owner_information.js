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
                List on fleet
              </div>
              <div className='text'>
                Earn money as a Fleet owner
              </div>
            </div>
          </div>
          <div className='col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-6 col-md-5 col-md-offset-6 hero-panel cta-panel'>
            <div className='start-cta-holder'>
              <div className='start-cta'>
                <div className='text-left header'>
                  PUT YOUR CAR TO WORK
                </div>
                <div className='text-left subheader'>
                  Earn upto €1000 per month
                </div>
                <div className='text-left text'>
                  <ul>
                    <li>Free to list</li>
                    <li>Keep 95% of the fee you set</li>
                    <li>Comprehensive insurace from AXA</li>
                    <li>Add your car in less than 20 minutes</li>
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
                  Why join Fleet?
                </div>
                <div className='text'>
                  Fleet is the easy and safe way to earn money with your car as and when you want. For every car - whether it's fun, affordable, or exotic - we'll help you find a driver! 
                </div>
              </div>
              <div className='col-xs-4 card'>
                <div className='image'>
                  <img src={ fleetSquares } alt='Squares' />
                </div>
                <div className='header'>
                  You call the shots
                </div>
                <div className='text'>
                  Owners get final say on any request. Set your own rules and price, mark availability on the calendar, and meet the driver face-to-face.
                </div>
              </div>
              <div className='col-xs-4 card'>
                <div className='image'>
                  <img src={ fleetAXA } alt='AXA' />
                </div>
                <div className='header'>
                  Guaranteed protection
                </div>
                <div className='text'>
                  You’re covered: every rental is fully insured by AXA with 24-hour breakdown assistance. Peer-review and driver vetting ensure a quality community and peace of mind for your car.
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
              Why join Fleet?
            </div>
            <div className='text'>
              Fleet is the easy and safe way to earn money with your car as and when you want. For every car - whether it's fun, affordable, or exotic - we'll help you find a driver! 
            </div>
          </div>
          <div className='col-xs-12 card'>
            <div className='image'>
              <img src={ fleetSquares } alt='Squares' />
            </div>
            <div className='header'>
              You call the shots
            </div>
            <div className='text'>
              Owners get final say on any request. Set your own rules and price, mark availability on the calendar, and meet the driver face-to-face.
            </div>
          </div>
          <div className='col-xs-12 card'>
            <div className='image'>
              <img src={ fleetAXA } alt='AXA' />
            </div>
            <div className='header'>
              Guaranteed protection
            </div>
            <div className='text'>
              You’re covered: every rental is fully insured by AXA with 24-hour breakdown assistance. Peer-review and driver vetting ensure a quality community and peace of mind for your car.
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
