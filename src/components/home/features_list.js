import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import FeatureTile from './feature_tile';

import replacement from '../../assets/images/replacement.jpg';
import businessMeeting from '../../assets/images/business-meeting.jpg';
import specialOccasion from '../../assets/images/special-occasion.jpg';
import weekendGetaways from '../../assets/images/weekend-getaways.jpg';
import rentCar from '../../assets/images/rent-car.jpg';
import selectRental from '../../assets/images/select-rental.png';
import chooseCar from '../../assets/images/choose-car.jpg';
import jeepImage from '../../assets/images/JeepImage.jpg';
import { Link } from 'react-router-dom';

export default class FeaturesList extends Component {
  render() {
    return (
      <div id="how_it_works_div" className="col-xs-12">
        <div id="renting_a_car_div" className="col-xs-12 text-center" style = {{ marginBottom: '15px'}}>
          <p>
            <span className="title-font-size strong-font-weight text-uppercase">
              <FormattedMessage id="homescreen.steps_heading" />
            </span>
            <br/>
            <span className="subtitle-font-size">
              <FormattedMessage id="homescreen.steps_description" />
            </span>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ flex: 1, padding: '0 10px', textAlign: 'center' }}>
              <img style={{ width: '100%', height: 'auto' }} src={selectRental} alt='stripe' />
              <div>ENTER PICK-UP LOCATION AND RENTAL PERIOD</div>
            </div>
            
            <div style={{ flex: 1, padding: '0 10px', textAlign: 'center' }}>
              <img style={{ width: '100%', height: 'auto' }} src={chooseCar} alt='stripe' />
              <div>CHOOSE RENTAL VEHICLE</div>
            </div>
            
            <div style={{ flex: 1, padding: '0 10px', textAlign: 'center' }}>
              <img style={{ width: '100%', height: 'auto' }} src={rentCar} alt='stripe' />
              <div>BOOK RENTAL VEHICLE AND ENJOY YOUR JOURNEY</div>
            </div>
          </div>
          
          <Link to="/home">
              <button style={{ color: '#f9f4f4', margin: '50px', height: '50px', width: '150px', backgroundColor: 'black' }}>-> Explore More</button>
          </Link>
          
        </div>

        <div id="renting_a_car_div" className="col-xs-12 text-center" style = {{ marginBottom: '15px'}}>
          <img style={{ width: '100%', height: '100%' }} src={jeepImage} alt='stripe' />
        </div>


        <div id="renting_a_car_div" className="col-xs-12 text-center" style = {{ marginTop: '15px'}}>
          <p>
            <span className="title-font-size strong-font-weight text-uppercase">
              <FormattedMessage id="homescreen.product_heading" />
            </span>
            <br/>
            <span className="subtitle-font-size">
              <FormattedMessage id="homescreen.product_description" />
            </span>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', overflow: 'auto' }}>
          
            <div style={{ flex: '1 0 250px', padding: '0 10px', textAlign: 'center' }}>
              <img style={{ width: '100%', height: 'auto'  }} src={weekendGetaways} alt='stripe' />
              <div style= {{fontSize: 'large'}}> WEKKEND GETAWAYS
              </div>
              <div>
                Packed with versatility and performance, rental cars from Land Rover transform every journey into a pleasure trip.
              </div>
            </div>

            <div style={{ flex: '1 0 250px', padding: '0 10px', textAlign: 'center' }}>
              <img style={{ width: '100%', height: 'auto'  }} src={specialOccasion} alt='stripe' />
              <div style= {{fontSize: 'large'}}>SPECIAL OCCASIONS</div>
              <div>
                From weddings to birthdays: extraordinary moments desrve extraordinary vehicles.
              </div>
            </div>

            <div style={{ flex: '1 0 250px', padding: '0 10px', textAlign: 'center' }}>
              <img style={{ width: '100%', height: 'auto'  }} src={businessMeeting} alt='stripe' />
              <div style= {{fontSize: 'large'}}>BUSINESS MEETINGS</div>
              <div>
                Enterpreneurial flair: Land Rover vehicles are just what you need to make a positive first impression.
              </div>

            </div>
            
            <div style={{ flex: '1 0 250px', padding: '0 10px', textAlign: 'center' }}>
              <img style={{ width: '100%', height: 'auto'  }} src={replacement} alt='stripe' />
              <div style= {{fontSize: 'large'}}>REPLACEMENT</div>
              <div>
                Transitional solutions do not have to be bland compromise. Our models offer you carefree driving pleasure.
              </div>
            </div>

          </div>
          
          <Link to="/home">
            <button style = {{ color: '#f9f4f4', margin: '50px',marginTop: '150px', height: '50px', width: '150px', backgroundColor: 'black', }}>-> Explore More</button>
          </Link>
        </div>
      </div>
    )
  }
}
