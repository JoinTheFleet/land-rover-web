import React, { Component } from 'react';
import LocalizationService from '../../shared/libraries/localization_service';

import independentLogo from '../../assets/images/independent-grey.png';
import newstalkLogo from '../../assets/images/newstalk-grey.png';
import foraLogo from '../../assets/images/fora-grey.png';
import rteradioLogo from '../../assets/images/rte-radio-1-grey.png';
import irishtimesLogo from '../../assets/images/irish-times-grey.png';

export default class FeaturedIn extends Component {
  render() {
    return (
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
    );
  }
}
