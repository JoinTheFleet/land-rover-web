import React, {
  Component
} from 'react';

import {
  injectIntl
} from 'react-intl';

import PropTypes from 'prop-types';

import Constants from '../../../miscellaneous/constants';
import Helpers from '../../../miscellaneous/helpers';

import Stepper from '../../miscellaneous/stepper';

import ListingRegistration from './steps/listing_registration';

const listingSteps = Constants.listingSteps();

class ListingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: this.props.listing || {},
      currentStep: listingSteps.registration,
      previousStep: ''
    };

    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.setListingProperties = this.setListingProperties.bind(this);
  }

  setCurrentStep(step) {
    this.setState((prevState) => ({
      currentStep: step,
      previousStep: prevState.currentStep
    }));
  }

  setListingProperties(propertiesToAdd) {
    this.setState((prevState) => ({
      listing: Helpers.extendObject(prevState.listing, propertiesToAdd)
    }));
  }

  renderStepper(){
    let step;
    let steps = {};
    let listingStepsKeys = Object.keys(listingSteps);

    for(let i = 0; i < listingStepsKeys.length; i++) {
      step = listingStepsKeys[i];
      steps[step]= this.props.intl.formatMessage({ id: 'listings.forms.steps.' + step });
    }

    return (
      <Stepper steps={ steps }
               currentStep={ this.state.currentStep }
               previousStep={ this.state.previousStep }>
      </Stepper>
    );
  }

  renderStep(step) {
    let renderedStep;

    switch(step) {
      case listingSteps.details:
        break;
      case listingSteps.location:
        break;
      case listingSteps.images:
        break;
      case listingSteps.pricing:
        break;
      default:
        renderedStep = (
          <ListingRegistration listing={ this.state.listing }
                               handleChangeStep={ this.setCurrentStep }
                               handleSetListingProperties={ this.setListingProperties } />);
    }

    return renderedStep;
  }

  render() {
    let currentRenderedStep = this.renderStep(this.state.currentStep);

    return (
      <div className="listing-form">
        {
          this.renderStepper()
        }
        {
          currentRenderedStep
        }
      </div>
    )
  }
}

export default injectIntl(ListingForm);

ListingForm.propTypes = {
  listing: PropTypes.object
}
