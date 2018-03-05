import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Modal from '../miscellaneous/modal';

import { Elements } from 'react-stripe-elements';

import ProfileInformationVerification from './verification_steps/profile_information_verification';
import VerifiedInformationVerification from './verification_steps/verified_information_verification';
import ContactDetailsVerification from './verification_steps/contact_details_verification';
import DriversLicenseVerification from './verification_steps/drivers_license_verification';
import PaymentMethodVerification from './verification_steps/payment_methods_verification';
import PayoutMethodVerification from './verification_steps/payout_methods_verification';

import UsersService from '../../shared/services/users/users_service';

import Button from '../miscellaneous/button';

export default class UserVerificationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      originalUser: {},
      currentStepNumber: 1,
      verificationSteps: [],
      componentUpdated: undefined,
      loading: false
    }
    
    this.showRenterVerifications = this.showRenterVerifications.bind(this);
    this.buildVerifications = this.buildVerifications.bind(this);
    this.setVerificationComponent = this.setVerificationComponent.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.progressToNextStep = this.progressToNextStep.bind(this);
    this.updateUserField = this.updateUserField.bind(this);
    this.setUser = this.setUser.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.extractUserParams = this.extractUserParams.bind(this);
    this.loading = this.loading.bind(this);
  }

  updateUserField(field, value) {
    let user = this.state.user;

    if (!user) {
      user = {}
    }

    user[field] = value;

    this.setState({ user: user })
  }

  showRenterVerifications() {
    return this.props.scope === 'renter';
  }

  setVerificationComponent(verificationComponent) {
    this.verificationComponent = verificationComponent;
    this.setState({ verificationComponentUpdated: Date.now() });
  }

  componentWillMount() {
    this.setState({
      loading: true
    }, () => {
      UsersService.show('me')
                  .then(response => {
                    this.setUser(response.data.data.user, false, false);
                  });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open && !prevProps.open) {
      this.setState({ user: Object.assign({}, this.state.originalUser) }, this.buildVerifications)
    }
  }

  setUser(user, skipBuildVerifications, progressToNextStep) {
    if (user) {
      if (!user.address) {
        user.address = {};
      }

      this.setState({
        loading: false,
        user: user,
        originalUser: Object.assign({}, user)
      }, () => {
        if (!skipBuildVerifications) {
          this.buildVerifications();
        }
        else if (progressToNextStep) {
          if (this.verificationComponent && this.verificationComponent.beforeTransition) {
            this.verificationComponent.beforeTransition(this.progressToNextStep);
          }
          else {
            this.progressToNextStep();
          }
        }
      });
    }
  }

  saveUser(preventProgressToNextStep) {
    let userParams = this.extractUserParams();

    if (!userParams) {
      return;
    }

    this.setState({ loading: true }, () => {
      UsersService.update('me', { user: userParams })
                  .then(response => {
                    this.setState({
                      loading: false
                    }, () => {
                      this.setUser(response.data.data.user, true, !preventProgressToNextStep);
                    })
                  });
    });    
  }

  extractUserParams() {
    let user = this.state.user;

    if (!user) {
      return;
    }

    let userParams = {
      first_name: user.first_name,
      last_name: user.last_name,
      gender: user.gender,
      description: user.description,
      account_type: user.account_type,
      country_code: user.country_code,
      date_of_birth: user.date_of_birth,
    };

    if (user.emailUpdated) {
      userParams.email = user.email
    }

    if (user.imageURL) {
      userParams.image_url = user.imageURL;
    }

    if (user.account_type === 'company' && user.business_details) {
      let business_details = user.business_details;

      if (business_details.address && (business_details.address.country_code || business_details.address.country.alpha2)) {
        userParams.business = {
          name: business_details.name,
          tax_id: business_details.tax_id,
          line1: business_details.address.line1,
          line2: business_details.address.line2,
          city: business_details.address.city,
          state: business_details.address.state,
          postal_code: business_details.address.postal_code,
          country_code: business_details.address.country_code || business_details.address.country.alpha2
        };
      }
    }

    if (user.address && user.address.country_code) {
      userParams.address = {
        line1: user.address.line1,
        line2: user.address.line2,
        state: user.address.state,
        city: user.address.city,
        postal_code: user.address.postal_code,
        country_code: user.address.country_code
      };
    }

    return userParams;
  }

  buildVerifications() {
    let verificationSteps = [];

    if (this.profileInformationMissing()) {
      verificationSteps.push(ProfileInformationVerification);
    }

    if (this.verifiedInformationMissing()) {
      verificationSteps.push(VerifiedInformationVerification);
    }

    if (this.contactDetailsMissing()) {
      verificationSteps.push(ContactDetailsVerification);
    }

    if (this.identificationDetailsMissing()) {
      verificationSteps.push(DriversLicenseVerification);
    }

    if (this.showRenterVerifications() && this.paymentDetailsMissing()) {
      verificationSteps.push(PaymentMethodVerification);
    }

    if (!this.showRenterVerifications() && this.payoutDetailsMissing()) {
      verificationSteps.push(PayoutMethodVerification);
    }

    this.setState({ verificationSteps: verificationSteps });
  }

  nextStep() {
    if (this.verificationComponent && this.verificationComponent.verified()) {
      this.saveUser();
    }
  }

  progressToNextStep() {
    if (this.state.currentStepNumber < this.state.verificationSteps.length) {
      this.setState({ currentStepNumber: this.state.currentStepNumber + 1 })
    }
  }

  profileInformationMissing() {
    let user = this.state.user;

    return !user || !user.first_name || !user.last_name || !user.gender || !user.date_of_birth || (user.verifications_required.profile_image && !user.imageURL);
  }

  verifiedInformationMissing() {
    let user = this.props.user;

    let addressInformationMissing = true;
    let companyInformationMissing = true;
    let companyAddressInformationMissing = true;

    if (!user) {
      return true;
    }

    if (user.account_type === 'company') { 
      let business = user.business_details;

      if (business) {
        companyInformationMissing = !business || !business.name || !business.tax_id;        

        if (business.address) {
          let businessAddress = business.address;

          companyAddressInformationMissing = !businessAddress ||
                                             !businessAddress.line1 ||
                                             !businessAddress.line2 ||
                                             !businessAddress.city ||
                                             !businessAddress.state ||
                                             !businessAddress.postal_code ||
                                             !(businessAddress.country_code || businessAddress.country);
        }
      }
    }
    else {
      companyInformationMissing = false;
      companyAddressInformationMissing = false;
    }

    if (user.address) {
      let address = user.address;

      addressInformationMissing = !address ||
                                  !address.line1 ||
                                  !address.line2 ||
                                  !address.city ||
                                  !address.state ||
                                  !address.postal_code ||
                                  !(address.country_code || address.country)
    }

    return addressInformationMissing || companyInformationMissing || companyAddressInformationMissing;
  }

  contactDetailsMissing() {
    let user = this.props.user;

    return !user ||
           user.owner_verifications_required.phone_number || user.verifications_required.phone_number ||
           user.owner_verifications_required.email || user.verifications_required.email;
  }

  identificationDetailsMissing() {
    let user = this.props.user;

    return !user || user.owner_verifications_required.identification || user.verifications_required.identification;
  }

  paymentDetailsMissing() {
    let user = this.props.user;

    return !user || user.owner_verifications_required.payment_method || user.verifications_required.payment_method;
  }

  payoutDetailsMissing() {
    let user = this.props.user;

    return !user || user.owner_verifications_required.bank_account || user.verifications_required.bank_account;
  }

  loading(loading, callback) {
    this.setState({ loading: loading }, callback)
  }

  render() {
    if (this.state.currentStepNumber <= this.state.verificationSteps.length) {
      let CurrentVerificationStep = this.state.verificationSteps[this.state.currentStepNumber - 1];
      let currentVerificationStep = <CurrentVerificationStep loading={ this.loading }configurations={ this.props.configurations } saveUser={ this.saveUser } user={ this.state.user } ref={ this.setVerificationComponent } updateUserField={ this.updateUserField } />;

      let disabledNext = !this.verificationComponent || !this.verificationComponent.verified();
      let stepWidth = 100.0 / ((this.state.verificationSteps.length - 1) || 1);
      let ulClass = this.state.verificationSteps.length <= 1 ? 'single' : '';
      let modalTitle = !this.verificationComponent ? '' : this.verificationComponent.title();

      return (
        <Modal {...this.props} modalClass='user-verification' title={ modalTitle }>
          <div className='row'>
            <div className='col-xs-12 verification'>
              <Elements>
                { currentVerificationStep }
              </Elements>
            </div>
            <div className='col-xs-12 footer'>
              <div className='col-xs-2 step-number'>
                { `Step ${this.state.currentStepNumber}` }
              </div>
              <div className='col-xs-8 steps'>
                <ul className={ ulClass }>
                  {
                    this.state.verificationSteps.map((verificationStep, index) => {
                      if (this.state.verificationSteps.length > 1) {
                        let className = 'step';
                        let leftMargin = `calc(${index * stepWidth}% - 6px)`;

                        if (index === (this.state.verificationSteps.length - 1)) {
                          leftMargin = `calc(100% - 12px)`;
                        }

                        if (this.state.verificationSteps.length === 1) {
                          leftMargin = `calc(50% - 12px)`;
                        }

                        if (index === 0) {
                          leftMargin = '0%';
                        }

                        if (index <= (this.state.currentStepNumber - 1)) {
                          className += ' filled';
                        }

                        return <li className={ className } style={{ marginLeft: leftMargin }} />
                      }
                      else {
                        return <div />;
                      }
                    })
                  }
                </ul>
              </div>
              <Button type='button' className='col-xs-2 button text-center' onClick={ this.nextStep } disabled={ disabledNext || this.state.loading } spinner={ this.state.loading}>
                { this.state.loading ? '' : 'Next' }
              </Button>
            </div>
          </div>
        </Modal>
      );
    }
    else {
      return <div />;
    }
  }
}
