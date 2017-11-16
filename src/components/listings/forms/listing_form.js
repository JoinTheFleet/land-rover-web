import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import Alert from 'react-s-alert';

import PropTypes from 'prop-types';

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
import UsersService from '../../../shared/services/users/users_service';

import { Redirect } from 'react-router-dom';

import Constants from '../../../miscellaneous/constants';
import Helpers from '../../../miscellaneous/helpers';
import Errors from '../../../miscellaneous/errors';
import ListingsHelper from '../../../miscellaneous/listings_helper';

const listingSteps = Constants.listingSteps();
const stepDirections = Constants.stepDirections();
const steps = Object.keys(listingSteps);

class ListingForm extends Component {
  constructor(props) {
    super(props);

    let steps = Object.keys(listingSteps);
    let currentStep = listingSteps[steps[0]];
    let previousStep = '';
    let listing = {};

    if (this.props.location && this.props.location.state) {
      if (this.props.location.state.finalStep) {
        currentStep = previousStep = listingSteps[steps[steps.length - 2]];
      }

      if (this.props.location.state.listing) {
        listing = this.props.location.state.listing;
      }
    }

    this.state = {
      loading: false,
      listing: listing,
      currentStep: currentStep,
      previousStep: previousStep,
      verificationsNeeded: [],
    };

    this.addError = this.addError.bind(this);
    this.allowForEdit = this.allowForEdit.bind(this);
    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.addListingProperties = this.addListingProperties.bind(this);
    this.handleCompleteListing = this.handleCompleteListing.bind(this);
    this.proceedToStepAndAddProperties = this.proceedToStepAndAddProperties.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      UsersService.show('me')
                  .then(response => {
                    let meInfo = response.data.data.user;
                    let verificationsNeeded = this.state.verificationsNeeded;

                    verificationsNeeded = verificationsNeeded.concat(Object.keys(meInfo.verifications_required)
                                                             .filter(key => meInfo.verifications_required[key]));

                    verificationsNeeded = verificationsNeeded.concat(Object.keys(meInfo.owner_verifications_required)
                                                             .filter(key => meInfo.verifications_required[key] && verificationsNeeded.indexOf(key) === -1));

                    this.setState({
                      verificationsNeeded: verificationsNeeded,
                      loading: false
                    }, () => {
                      if (verificationsNeeded.length === 0) {
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
                    });
                  })
                  .catch(error => { this.addError(Errors.extractErrorMessage(error)); });
    });
  }

  addError(error) {
    this.setState({ loading: false }, () => { Alert.error(error); } );
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
                                   }, () => { Alert.error(Errors.extractErrorMessage(error)); });
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
    let newPreviousStep;

    if (index > 0) {
      newPreviousStep = listingSteps[Object.keys(listingSteps)[index - 1]];
    }

    this.setState({
      currentStep: newStep,
      previousStep: newPreviousStep
    });
  }

  handleCompleteListing(propertiesToAdd) {
    this.setState((prevState) => ({
      loading: true,
      listing: Helpers.extendObject(prevState.listing, propertiesToAdd)
    }), () => {
      let submissionParams = ListingsHelper.extractListingParamsForSubmission(this.state.listing);

      if (this.props.edit) {
        ListingsService.update(this.state.listing.id, { listing: submissionParams })
                       .then(response => {
                         this.setState({
                           listing: response.data.data.listing,
                           currentStep: 'finished',
                           previousStep: this.state.currentStep
                         });
                       })
                       .catch(error => { Alert.error(Errors.extractErrorMessage(error)); });
      }
      else {
        ListingsService.create({ listing: submissionParams })
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
                         }, () => { Alert.error(Errors.extractErrorMessage(error)); });
                       });
      }
    });
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

    if ( this.state.verificationsNeeded.length > 0 ) {
      return (<Redirect to={ { pathname: "/account/verified_info", state: { verificationsNeeded: this.state.verificationsNeeded } }} />)
    }

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
                                               handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties }
                                               configurations={ this.props.configurations } />);
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
      return <Redirect to={{
        pathname: `/listings/${this.state.listing.id}`,
        state: {
          listing: this.state.listing
        }
      }} />;
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
