import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Modal from '../miscellaneous/modal';

import ProfileInformationVerification from './verification_steps/profile_information_verification';
import VerifiedInformationVerification from './verification_steps/verified_information_verification';

import UsersService from '../../shared/services/users/users_service';

export default class UserVerificationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      originalUser: {},
      currentStepNumber: 1,
      verificationSteps: [],
      componentUpdated: undefined,
      saving: false
    }
    
    this.showRenterVerifications = this.showRenterVerifications.bind(this);
    this.buildRenterVerificationSteps = this.buildRenterVerificationSteps.bind(this);
    this.buildOwnerVerificationSteps = this.buildOwnerVerificationSteps.bind(this);
    this.setVerificationComponent = this.setVerificationComponent.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.progressToNextStep = this.progressToNextStep.bind(this);
    this.updateUserField = this.updateUserField.bind(this);
    this.setUser = this.setUser.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.extractUserParams = this.extractUserParams.bind(this);
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
    UsersService.show('me')
                .then(response => {
                  this.setUser(response.data.data.user, false, false);
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
        saving: false,
        user: user,
        originalUser: Object.assign({}, user)
      }, () => {
        if (!skipBuildVerifications) {
          this.buildVerifications();
        }
        else if (progressToNextStep) {
          this.progressToNextStep();
        }
      });
    }
  }

  saveUser(progressToNextStep) {
    let userParams = this.extractUserParams();

    if (!userParams) {
      return;
    }

    this.setState({ saving: true }, () => {
      UsersService.update('me', { user: userParams })
                  .then(response => {
                    this.setUser(response.data.data.user, true, true);
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
      country_code: user.country_code
    };

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
    if (this.showRenterVerifications()) {
      this.buildRenterVerificationSteps();
    }
    else {
      this.buildOwnerVerificationSteps();
    }
  }

  nextStep() {
    if (this.verificationComponent && this.verificationComponent.verified()) {
      this.saveUser(true);
    }
  }

  progressToNextStep() {
    if (this.state.currentStepNumber < this.state.verificationSteps.length) {
      this.setState({ currentStepNumber: this.state.currentStepNumber + 1 })
    }
  }

  buildRenterVerificationSteps() {
    let verificationSteps = [];

    if (this.profileInformationMissing()) {
      verificationSteps.push(ProfileInformationVerification);
    }

    verificationSteps.push(ProfileInformationVerification)
    verificationSteps.push(VerifiedInformationVerification)

    this.setState({ verificationSteps: verificationSteps });
  }

  profileInformationMissing() {
    let user = this.state.user;

    return !user || !user.first_name || !user.last_name || !user.gender || !user.description;
  }

  buildOwnerVerificationSteps() {
    let verificationSteps = [];

    this.setState({ verificationSteps: verificationSteps });
  }

  render() {
    if (this.state.currentStepNumber <= this.state.verificationSteps.length) {
      let CurrentVerificationStep = this.state.verificationSteps[this.state.currentStepNumber - 1];
      let currentVerificationStep = <CurrentVerificationStep configurations={ this.props.configurations } user={ this.state.user } ref={ this.setVerificationComponent } updateUserField={ this.updateUserField } />;
      let disabledNext = !this.verificationComponent || !this.verificationComponent.verified();
      let stepWidth = 100.0 / ((this.state.verificationSteps.length - 1) || 1);
      let ulClass = this.state.verificationSteps.length <= 1 ? 'single' : '';
      let modalTitle = !this.verificationComponent ? '' : this.verificationComponent.title();

      return (
        <Modal {...this.props} modalClass='user-verification' title={ modalTitle }>
          <div className='row'>
            <div className='col-xs-12 verification'>
              { currentVerificationStep }
            </div>
            <div className='col-xs-12 footer'>
              <div className='col-xs-2 step-number'>
                { `Step ${this.state.currentStepNumber}` }
              </div>
              <div className='col-xs-8 steps'>
                <ul className={ ulClass }>
                  {
                    this.state.verificationSteps.map((verificationStep, index) => {
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
                    })
                  }
                </ul>
              </div>
              <button type='button' className='col-xs-2 btn button text-center' onClick={ this.nextStep } disabled={ disabledNext } >
                Next
              </button>
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
