import React, {
  Component
} from 'react';

import {
  injectIntl
} from 'react-intl';

import moment from 'moment';

import PropTypes from 'prop-types';

import Constants from '../../../miscellaneous/constants';
import Helpers from '../../../miscellaneous/helpers';

import Stepper from '../../miscellaneous/stepper';
import Alert from '../../miscellaneous/alert';
import Loading from '../../miscellaneous/loading';

import ListingRegistration from './steps/listing_registration';
import ListingDetails from './steps/listing_details';
import ListingLocation from './steps/listing_location';
import ListingImages from './steps/listing_images';
import ListingPricing from './steps/listing_pricing';
import ListingRules from './steps/listing_rules';

import ListingsService from '../../../shared/services/listings/listings_service';
import VehicleLookupsService from '../../../shared/services/vehicles/vehicle_lookups_service';

const listingsViews = Constants.listingViews();
const listingSteps = Constants.listingSteps();
const stepDirections = Constants.stepDirections();
const steps = Object.keys(listingSteps);

class ListingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      listing: this.props.listing || {},
      currentStep: listingSteps[Object.keys(listingSteps)[0]],
      previousStep: '',
      errors: []
    };

    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.addListingProperties = this.addListingProperties.bind(this);
    this.handleCompleteListing = this.handleCompleteListing.bind(this);
    this.proceedToStepAndAddProperties = this.proceedToStepAndAddProperties.bind(this);
    this.extractListingParamsForSubmission = this.extractListingParamsForSubmission.bind(this);
  }

  setCurrentStep(step) {
    this.setState((prevState) => ({
      currentStep: step,
      previousStep: prevState.currentStep
    }));
  }

  addListingProperties(propertiesToAdd) {
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

      if (propertiesToAdd.license_plate_number && propertiesToAdd.country) {
        this.setState({
          loading: true,
        }, () => {
          VehicleLookupsService.create(propertiesToAdd.license_plate_number, propertiesToAdd.country)
                               .then(response => {
                                 this.setState(prevState => ({
                                   loading: false,
                                   currentStep: listingSteps[stepKey],
                                   previousStep: prevState.currentStep,
                                   listing: Helpers.extendObject(prevState.listing, {
                                     license_plate_number: propertiesToAdd.license_plate_number,
                                     country: propertiesToAdd.country,
                                     variant: response.data.data.variant
                                   })
                                 }));
                               })
                               .catch(error => {
                                 console.log(error);
                                 this.setState(prevState => ({
                                   loading: false,
                                   errors: prevState.errors.concat([error.message])
                                 }));
                               });
        });
      }
      else {
        this.setState((prevState) => ({
          currentStep: listingSteps[stepKey],
          previousStep: prevState.currentStep,
          listing: Helpers.extendObject(prevState.listing, propertiesToAdd)
        }));
      }
    }
  }

  handleCompleteListing(propertiesToAdd) {
    this.setState((prevState) => ({
      loading: true,
      listing: Helpers.extendObject(prevState.listing, propertiesToAdd)
    }), () => {
      let submissionParams = this.extractListingParamsForSubmission();

      ListingsService.create({ listing: submissionParams})
                     .then(response => {
                       this.props.setCurrentView(listingsViews.index);
                     })
                     .catch(error => {
                       this.setState(prevState => ({ errors: prevState.errors.concat([error.message]) }));
                     });
    });
  }

  extractListingParamsForSubmission() {
    let listing = this.state.listing;
    let submissionParams = JSON.parse(JSON.stringify(listing));

    submissionParams.latitude = submissionParams.location.latitude;
    submissionParams.longitude = submissionParams.location.longitude;
    submissionParams.vehicle_variant_id = submissionParams.variant.id;
    submissionParams.price *= 100;
    submissionParams.cleaning_fee *= 100;
    submissionParams.check_in_time = moment.duration(listing.check_out_time.format('HH:MM:SS')).asSeconds();
    submissionParams.check_out_time = moment.duration(listing.check_in_time.format('HH:MM:SS')).asSeconds();

    delete submissionParams.location;
    delete submissionParams.country;
    delete submissionParams.variant;

    return submissionParams;
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

    if ( this.state.loading ) {
      renderedStep = (<Loading />)
    }
    else {
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
          renderedStep = (<ListingPricing listing={ this.state.listing }
                                          handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties } />)
          break;
        case listingSteps.rules:
          renderedStep = (<ListingRules listing={ this.state.listing }
                                        handleCompleteListing={ this.handleCompleteListing } />)
          break;
        default:
          renderedStep = (<ListingRegistration listing={ this.state.listing }
                                               handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties } />);
      }
    }

    return (
      <div className="listing-form-current-step col-xs-12">
        { renderedStep }
      </div>
    );
  }

  render() {
    let errors = this.state.errors;
    let currentRenderedStep = this.renderStep(this.state.currentStep);

    return (
      <div className="listing-form">
        {
          this.renderStepper()
        }
        {
          currentRenderedStep
        }
        {
          errors.map((error, index) => {
            return (<Alert key={ "error" + index } type="danger" message={ error } />)
          })
        }
      </div>
    )
  }
}

export default injectIntl(ListingForm);

ListingForm.propTypes = {
  listing: PropTypes.object
}
