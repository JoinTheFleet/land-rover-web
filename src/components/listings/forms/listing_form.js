import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import PropTypes from 'prop-types';

import Constants from '../../../miscellaneous/constants';
import Helpers from '../../../miscellaneous/helpers';

import Stepper from '../../miscellaneous/stepper';
import Loading from '../../miscellaneous/loading';

import ListingRegistration from './steps/listing_registration';
import ListingDetails from './steps/listing_details';
import ListingLocation from './steps/listing_location';
import ListingImages from './steps/listing_images';
import ListingPricing from './steps/listing_pricing';
import ListingRules from './steps/listing_rules';

import ListingsService from '../../../shared/services/listings/listings_service';
import VehicleLookupsService from '../../../shared/services/vehicles/vehicle_lookups_service';
import Alert from 'react-s-alert';

import { Redirect } from 'react-router-dom';

const listingSteps = Constants.listingSteps();
const stepDirections = Constants.stepDirections();
const steps = Object.keys(listingSteps);

class ListingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      listing: {},
      currentStep: listingSteps[Object.keys(listingSteps)[0]],
      previousStep: '',
    };

    this.allowForEdit = this.allowForEdit.bind(this);
    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.addListingProperties = this.addListingProperties.bind(this);
    this.handleCompleteListing = this.handleCompleteListing.bind(this);
    this.proceedToStepAndAddProperties = this.proceedToStepAndAddProperties.bind(this);
    this.extractListingParamsForSubmission = this.extractListingParamsForSubmission.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
  }

  componentWillMount() {
    let location = this.props.location;


    if (location && location.state && location.state.listing) {
      this.setState({ listing: location.state.listing }, this.allowForEdit);
    }
    else if (this.props.match.params.id) {
      this.setState({ loading: true }, () => {
        ListingsService.show(this.props.match.params.id)
                       .then(response => {
                         this.setState({
                           listing: response.data.data.listing,
                           loading: false
                         }, this.allowForEdit);
                       });
      });
    }
  }

  allowForEdit() {
    if (this.props.edit && this.state.listing) {
      this.proceedToStepAndAddProperties(stepDirections.next, {
        license_plate_number: this.state.listing.license_plate_number,
        country: this.state.listing.country_configuration.country.alpha2
      });
    }
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
        if (this.props.edit) {
          this.setState({
            currentStep: listingSteps[stepKey],
            previousStep: this.state.currentStep
          });
        }
        else {
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
                                   this.setState({
                                     loading: false
                                   }, () => { Alert.error(error.response.data.message); });
                                 });
          });
        }
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

  handleStepChange(index) {
    let newStep = listingSteps[Object.keys(listingSteps)[index]];
    let newPreviousStep = undefined;

    if (index > 0) {
      newPreviousStep = listingSteps[Object.keys(listingSteps)[index - 1]];
    }

    this.setState({
      currentStep: newStep,
      previousStep: newPreviousStep
    })
  }

  handleCompleteListing(propertiesToAdd) {
    this.setState((prevState) => ({
      loading: true,
      listing: Helpers.extendObject(prevState.listing, propertiesToAdd)
    }), () => {
      let submissionParams = this.extractListingParamsForSubmission();

      if (this.props.edit) {
        ListingsService.update(this.state.listing.id, { listing: submissionParams })
                       .then(response => {
                         this.setState({ currentStep: 'finished', previousStep: this.state.currentStep })
                       })
                       .catch(error => {
                         Alert.error(error.response.data.message);
                       });
      }
      else {
        ListingsService.create({ listing: submissionParams})
                       .then(response => {
                         this.setState({
                           listing: response.data.data.listing,
                           currentStep: 'finished',
                           previousStep: this.state.currentStep
                         });
                       })
                       .catch(error => {
                         this.setState({
                           loading: false,
                           currentStep: listingSteps.details,
                           previousStep: undefined
                         }, () => {
                           Alert.error(error.response.data.message);
                         });
                       });
      }
    });
  }

  extractListingParamsForSubmission() {
    let listing = this.state.listing;

    return {
      latitude: listing.location.latitude,
      longitude: listing.location.longitude,
      vehicle_variant_id: listing.variant.id,
      images: listing.images,
      on_demand: listing.on_demand,
      on_demand_rates: listing.on_demand_rates,
      amenities: listing.amenities,
      price: listing.price,
      cleaning_fee: listing.cleaning_fee,
      license_plate_number: listing.license_plate_number,
      check_in_time: listing.check_in_time,
      check_out_time: listing.check_out_time,
      rules: listing.rules
    };
  }

  renderStepper(){
    let step;
    let steps = {};
    let listingStepsKeys = Object.keys(listingSteps);

    for(let i = 0; i < listingStepsKeys.length - 1; i++) {
      step = listingStepsKeys[i];
      steps[step]= this.props.intl.formatMessage({ id: 'listings.forms.steps.' + step });
    }

    return (
      <Stepper steps={ steps }
               handleStepChange={ this.handleStepChange }
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
                                        finalStep={ true }
                                        handleCompleteListing={ this.handleCompleteListing } />)
          break;
        default:
          renderedStep = (<ListingRegistration listing={ this.state.listing }
                                               firstStep={ true }
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
    if (this.state.currentStep === listingSteps.finished) {
      return <Redirect push to={ `/listings/${this.state.listing.id}`} />;
    }
    else {
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
}

export default injectIntl(ListingForm);

ListingForm.propTypes = {
  edit: PropTypes.bool
}
