import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Modal from '../miscellaneous/modal';

import ProfileInformationVerification from './verification_steps/profile_information_verification';
import VerifiedInformationVerification from './verification_steps/verified_information_verification';

export default class UserVerificationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStepNumber: 1,
      verificationSteps: [],
      componentUpdated: undefined
    }
    
    this.showRenterVerifications = this.showRenterVerifications.bind(this);
    this.buildRenterVerificationSteps = this.buildRenterVerificationSteps.bind(this);
    this.buildOwnerVerificationSteps = this.buildOwnerVerificationSteps.bind(this);
    this.setVerificationComponent = this.setVerificationComponent.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  showRenterVerifications() {
    return this.props.scope === 'renter';
  }

  setVerificationComponent(verificationComponent) {
    this.verificationComponent = verificationComponent;
    this.setState({ verificationComponentUpdated: Date.now() });
  }

  componentWillMount() {
    this.buildVerifications();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.buildVerifications();
    }
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
    if (this.state.currentStepNumber < this.state.verificationSteps.length) {
      this.setState({ currentStepNumber: this.state.currentStepNumber + 1 })
    }
  }

  buildRenterVerificationSteps() {
    let verificationSteps = [];

    verificationSteps.push(ProfileInformationVerification)
    verificationSteps.push(VerifiedInformationVerification)
    verificationSteps.push(ProfileInformationVerification)
    verificationSteps.push(VerifiedInformationVerification)

    this.setState({ verificationSteps: verificationSteps });
  }

  buildOwnerVerificationSteps() {
    let verificationSteps = [];

    this.setState({ verificationSteps: verificationSteps });
  }

  render() {
    if (this.state.currentStepNumber <= this.state.verificationSteps.length) {
      let CurrentVerificationStep = this.state.verificationSteps[this.state.currentStepNumber - 1];
      let currentVerificationStep = <CurrentVerificationStep ref={ this.setVerificationComponent } />;
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
