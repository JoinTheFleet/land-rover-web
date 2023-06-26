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
import replacement from '../../assets/images/replacement.jpg';
import businessMeeting from '../../assets/images/business-meeting.jpg';
import specialOccasion from '../../assets/images/special-occasion.jpg';

export default class RenterInformation extends Component {
  render() {
    return (
      <div className='col-xs-12 no-side-padding information renter'>
        <div className='col-xs-12 no-side-padding hero renter'>
          <div className='col-xs-12 col-xs-offset-0 col-sm-6 col-md-4 col-md-offset-2 hero-panel'>
            
          </div>
          <div className='col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-6 col-md-5 col-md-offset-6 hero-panel cta-panel'>
            <div className='start-cta-holder'>
              <div className='start-cta'>
                <div className='text-left header'>
                  { LocalizationService.formatMessage('SUBSCRIBE') }
                </div>
                <div className='text-left header'>
                  { LocalizationService.formatMessage('renter_information.prompt_1') }
                </div>
                <div className='text-left subheader'>
                  { LocalizationService.formatMessage('renter_information.prompt_2') }
                </div>

                <div style= {{ display: 'flex', justifyContent: 'center' }}>
                  <Link to="/home">
                    <button style = {{ color: '#f9f4f4', margin: '10px', height: '50px', width: '150px', backgroundColor: 'black', }}>-> Discover Vehicles</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        

        <div style = {{padding: '50px'}}>
          <div id="Subscription-text" className="col-xs-12 text-center" style = {{border: '1px solid black', marginBottom: '15px', marginTop: '15px', paddingLeft: '100px', paddingRight: '100px' }}>
            <div style = {{fontSize: '32px'}}>
              BEING FLEXIBLE HAS NEVER BEEN BETTER
            </div>

            <p>Experience the exclusive driving pleasure with Jaquar and Land Rover in a variety of ways with SUBSCRIBE the car subscription without long term commitment and at a fixed monthly rate taht covers all costs except fuel and electricity costs.</p>
            <br></br>
            <p>You can order your desired model quickly and conveniently online. The delivery takes place within a few weeks free of charge to the address you specified. </p>
            <br></br>
            <p>Discover modern premium mobility, and the new freedom of driving with SUBSCRIBE. </p>
            <br></br>
          </div>

          <div id="Subscription-text" className="col-xs-12 text-center" style = {{border: '1px solid black', marginBottom: '15px', marginTop: '15px', paddingLeft: '100px', paddingRight: '100px', overflow: 'hidden' }}>
            <div style = {{fontSize: '32px'}}>
              YOUR ADVANTAGES AT A GLANCE
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ flex: 1, padding: '0 10px', textAlign: 'center' }}>
                <img style={{ width: '100%', height: 'auto' }} src={replacement} alt='stripe' />
                <div style = {{fontSize: '20px'}}>
                  Maximum
                </div>
                <div style = {{fontSize: '20px'}}>
                  Independence
                </div>
                <div>You decide how long you want todrive your dream vehicle. Choose between 6, 12, 18 or 24 months with a 3-monthnotice period before the end of the term.</div>
              </div>
              
              <div style={{ flex: 1, padding: '0 10px', textAlign: 'center' }}>
                <img style={{ width: '100%', height: 'auto' }} src={businessMeeting} alt='stripe' />
                <div style = {{fontSize: '20px'}}>
                  Full
                </div>
                <div style = {{fontSize: '20px'}}>
                  Cost Control
                </div>
                <div>Your rate includes all costs for insurance, road tax, wear and tear, maintainance and seasonal tires. No deposit, final installment or entry fee.</div>
              </div>
              
              <div style={{ flex: 1, padding: '0 10px', textAlign: 'center' }}>
                <img style={{ width: '100%', height: 'auto' }} src={specialOccasion} alt='stripe' />
                <div style = {{fontSize: '20px'}}>
                  Individual
                </div>
                <div style = {{fontSize: '20px'}}>
                  Enthusiasm
                </div>
                <div>With SUBSCRIBE you get exactly the Jaguar or Land Rover model you have chosen - in perfect condition with tested quality.</div>
              </div>
            </div>
            <Link to="/home">
              <button style = {{ color: '#f9f4f4', margin: '50px',marginTop: '100px', height: '50px', width: '150px', backgroundColor: 'black', }}>-> About Subscribe</button>
            </Link>
            
          </div>


          <div id="Subscription-text" className="col-xs-12 text-center" style = {{border: '1px solid black', marginBottom: '15px', marginTop: '15px', paddingLeft: '100px', paddingRight: '100px' }}>
            <div style = {{fontSize: '32px'}}>
              YOUR FAST WAY TO THE WHEEL
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ flex: 1, padding: '0 10px', textAlign: 'center' }}>
                <img style={{ width: '100%', height: 'auto' }} src={replacement} alt='stripe' />
                <div style = {{fontSize: '20px'}}>
                  DISCOVER
                </div>
                <div>Find out about Jaguar & Land Rover SUBSCRIBE and our premium models available at short notice.</div>
              </div>
              
              
              <div style={{ flex: 1, padding: '0 10px', textAlign: 'center' }}>
                <img style={{ width: '100%', height: 'auto' }} src={specialOccasion} alt='stripe' />
                <div style = {{fontSize: '20px'}}>
                  DECIDE
                </div>
                <div>Select your desired model and complete your car subscription convienintly online with just a few clicks.</div>
              </div>

              <div style={{ flex: 1, padding: '0 10px', textAlign: 'center' }}>
                <img style={{ width: '100%', height: 'auto' }} src={specialOccasion} alt='stripe' />
                <div style = {{fontSize: '20px'}}>
                  GET IN
                </div>
                <div>We will deliver the vehicle you have selected convienintly and free of charge to the address you have specified.</div>
              </div>

              <div style={{ flex: 1, padding: '0 10px', textAlign: 'center' }}>
                <img style={{ width: '100%', height: 'auto' }} src={businessMeeting} alt='stripe' />
                <div style = {{fontSize: '20px'}}>
                  EXPERIENCE
                </div>
                <div>You enjoy the exclusive driving pleasure in your Jaguar or Land Rover We take care of everything else.</div>
              </div>
            </div>

            <Link to="/home">
              <button style = {{ color: '#f9f4f4', margin: '50px',marginTop: '100px', height: '50px', width: '150px', backgroundColor: 'black', }}>-> How It WORKS</button>
            </Link>
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
