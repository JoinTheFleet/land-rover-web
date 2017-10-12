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
import ListingDetails from './steps/listing_details';
import ListingLocation from './steps/listing_location';
import ListingImages from './steps/listing_images';

const listingSteps = Constants.listingSteps();
const stepDirections = Constants.stepDirections();
const steps = Object.keys(listingSteps);

class ListingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: this.props.listing || {},
      currentStep: listingSteps[Object.keys(listingSteps)[0]],
      previousStep: ''
    };

    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.setListingProperties = this.setListingProperties.bind(this);
    this.proceedToStepAndAddProperties = this.proceedToStepAndAddProperties.bind(this);
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

  proceedToStepAndAddProperties(direction, propertiesToAdd) {
    let currentStepIndex = steps.indexOf(this.state.currentStep);
    let stepKey;

    if ((direction === stepDirections.next && currentStepIndex < steps.length - 1) ||
        (direction === stepDirections.previous && currentStepIndex > 0)) {
      stepKey = direction === stepDirections.next ? steps[currentStepIndex + 1] : steps[currentStepIndex - 1];

      this.setState((prevState) => ({
        currentStep: listingSteps[stepKey],
        previousStep: prevState.currentStep,
        listing: Helpers.extendObject(prevState.listing, propertiesToAdd)
      }));
    }
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
        renderedStep = (<ListingDetails listing={ this.state.listing }
                                        handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties } />)
        break;
      case listingSteps.location:
        renderedStep = (<ListingLocation listing={ this.state.listing }
                                        handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties } />)
        break;
      case listingSteps.images:
        renderedStep = (<ListingImages listing={ this.state.listing }
                                       handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties } />)
        break;
      case listingSteps.pricing:
        break;
      default:
        renderedStep = (<ListingRegistration listing={ this.state.listing }
                                             handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties } />);
    }

    return (
      <div className="listing-form-current-step col-xs-12">
        { renderedStep }
      </div>
    );
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
