import React, { Component } from 'react';
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
import LocalizationService from '../../../shared/libraries/localization_service';

import { Redirect } from 'react-router-dom';

import Constants from '../../../miscellaneous/constants';
import Helpers from '../../../miscellaneous/helpers';
import Errors from '../../../miscellaneous/errors';
import ListingsHelper from '../../../miscellaneous/listings_helper';

import ReactFacebookPixel from 'react-facebook-pixel';

import UserVerificationModal from '../../users/user_verification_modal';

const listingSteps = Constants.listingSteps();
const stepDirections = Constants.stepDirections();
const steps = Object.keys(listingSteps);

export default class ListingForm extends Component {
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
      invalidEdit: false,
      currentStep: currentStep,
      previousStep: previousStep,
      showVerificationModal: false
    };

    this.addError = this.addError.bind(this);
    this.allowForEdit = this.allowForEdit.bind(this);
    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.addListingProperties = this.addListingProperties.bind(this);
    this.handleCompleteListing = this.handleCompleteListing.bind(this);
    this.proceedToStepAndAddProperties = this.proceedToStepAndAddProperties.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
    this.reloadUser = this.reloadUser.bind(this);
    this.closeVerificationModal = this.closeVerificationModal.bind(this);
    this.afterVerificationAction = this.afterVerificationAction.bind(this);
  }

  componentDidMount() {
    this.reloadUser();
  }

  reloadUser(callback) {
    this.setState({ loading: true }, () => {
      UsersService.show('me')
                  .then(response => {
                    let meInfo = response.data.data.user;
                    let showVerificationModal = false;

                    for (var key in meInfo.owner_verifications_required) {
                      showVerificationModal = showVerificationModal || meInfo.owner_verifications_required[key];
                    }

                    this.setState({
                      currentUser: meInfo,
                      loading: false,
                      showVerificationModal: showVerificationModal
                    }, () => {
                      let location = this.props.location;

                      if (location && location.state && location.state.listing) {
                        this.setState({ listing: location.state.listing, loading: false}, () => {
                          if (location && location.state && location.state.listing) {
                            this.setState({ listing: location.state.listing, loading: false }, () => {
                              this.allowForEdit();
                              if (callback) {
                                callback();
                              }
                            });
                          }
                          else if (this.props.match.params.id) {
                            ListingsService.show(this.props.match.params.id)
                                            .then(response => {
                                              this.setState({
                                                listing: response.data.data.listing,
                                                loading: false
                                              }, () => {
                                                if (callback) {
                                                  callback();
                                                }
                                              });
                                            })
                                            .catch(() => {
                                              this.setState({ loading: false });
                                            });
                          }
                          else {
                            this.setState({ loading: false }, () => {
                              if (callback) {
                                callback();
                              }
                            });
                          }
                        });
                      }
                    });
                  })
                  .catch((error) => { 
                    this.addError(Errors.extractErrorMessage(error));
                    this.setState({ loading: false }) 
                  });
    });
  }

  closeVerificationModal() {
    this.setState({ showVerificationModal: false });
  }

  afterVerificationAction(callback) {
    this.reloadUser(callback);
  }

  addError(error) {
    this.setState({ loading: false }, () => { Alert.error(error); } );
  }

  allowForEdit() {
    if (this.props.edit && this.state.listing && this.state.currentUser && this.state.listing.user.id === this.state.currentUser.id) {
      this.proceedToStepAndAddProperties(stepDirections.next, {
        license_plate_number: this.state.listing.license_plate_number,
        country: this.state.listing.country_configuration.country.alpha2
      });
    }
    else if (this.state.listing.id) {
      this.setState({
        invalidEdit: true
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
      let submissionParams = ListingsHelper.extractListingParamsForSubmission(this.state.listing, this.props.edit);

      if (this.props.edit) {
        ListingsService.update(this.state.listing.id, { listing: submissionParams })
                       .then(response => {
                        Alert.success(LocalizationService.formatMessage('listings.successfully_updated'))
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
                         Alert.success(LocalizationService.formatMessage('listings.successfully_created'))
                         ReactFacebookPixel.trackCustom('Listing Created', { listing_id: response.data.data.listing.id });

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
      steps[step]= LocalizationService.formatMessage(`listings.forms.steps.${step}`);
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
                                          disabled={ this.props.showVerificationModal }
                                          handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties } />)
          break;
        case listingSteps.location:
          renderedStep = (<ListingLocation listing={ this.state.listing }
                                           disabled={ this.props.showVerificationModal }
                                           handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties } />)
          break;
        case listingSteps.images:
          renderedStep = (<ListingImages listing={ this.state.listing }
                                         edit={ this.props.edit }
                                         disabled={ this.props.showVerificationModal }
                                         handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties } />)
          break;
        case listingSteps.pricing:
          this.state.listing.owner_account_type = this.state.currentUser.account_type;
          renderedStep = (<ListingPricing listing={ this.state.listing }
                                          disabled={ this.props.showVerificationModal }
                                          handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties } />)
          break;
        case listingSteps.rules:
          renderedStep = (<ListingRules listing={ this.state.listing }
                                        finalStep={ true }
                                        disabled={ this.props.showVerificationModal }
                                        handleCompleteListing={ this.handleCompleteListing } />)
          break;
        default:
          renderedStep = (<ListingRegistration listing={ this.state.listing }
                                               firstStep={ true }
                                               disabled={ this.props.showVerificationModal }
                                               handleProceedToStepAndAddProperties={ this.proceedToStepAndAddProperties }
                                               configurations={ this.props.configurations } />);
      }
    }

    return (
      <div className="listing-form-current-step col-xs-12">
        <UserVerificationModal {...this.props} open={ this.state.showVerificationModal } scope={ 'owner' } finishAction={ this.afterVerificationAction } closeModal={ this.closeVerificationModal } user={ this.state.currentUser } updateUser={ this.reloadUser } configurations={ this.props.configurations } />
        { renderedStep }
      </div>
    );
  }

  render() {
    if (this.state.invalidEdit) {
      Alert.error(LocalizationService.formatMessage('listings.invalid_edit'));

      return <Redirect to={{
        pathname: `/listings/${this.state.listing.id}`
      }} />;
    }
    else if (this.state.currentStep === listingSteps.finished) {
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

ListingForm.propTypes = {
  edit: PropTypes.bool
}
