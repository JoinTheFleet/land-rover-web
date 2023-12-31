import React, {
  Component
} from 'react';

import Anime from 'react-anime';

import PropTypes from 'prop-types';

import stepCompleteIcon from '../../assets/images/step-complete.png';
import stepIncompleteIcon from '../../assets/images/step-incomplete.png';

const stepIconWidth = 20; // This assumes both icons have same size
const stepIconHeight = 20; // This assumes both icons have same size

export default class Stepper extends Component {
  componentDidMount () {
    let steps = Object.keys(this.props.steps);
    this.stepWidth = this.refs.stepperBar.clientWidth / (steps.length - 1);
  }

  render() {
    let steps = Object.keys(this.props.steps);
    let currentStepIndex = steps.indexOf(this.props.currentStep);
    let previousStepIndex = steps.indexOf(this.props.previousStep);
    let totalDividers = steps.length + 2;
    let stepperContainerStyle = {
      marginLeft: 'calc(100% / ' + totalDividers + ')',
      width: 'calc(100% / ' + totalDividers + ' * ' + (totalDividers - 2) + ')'
    };

    let stepWidth = this.stepWidth || 0;

    return (
      <div className="fleet-stepper smoke-grey col-xs-12 no-side-padding">
        <div className="fleet-stepper-steps"
             style={ stepperContainerStyle }>
          <div className="fleet-stepper-bar white" ref="stepperBar">
            <Anime easing="linear"
                    duration={ 500 }
                    width={ (stepWidth * currentStepIndex) + 'px' }
                    begin={ (anime) => {
                      if (this.props.previousStep) {
                        anime.animatables[0].target.style.width = (stepWidth * previousStepIndex) + 'px';
                      }
                    } }
                    complete={ (anime) => {
                      anime.animatables[0].target.style.width = (100 / (steps.length - 1) * currentStepIndex) + '%';
                    }}>
              <div className="fleet-stepper-bar-progress secondary-color"></div>
            </Anime>
          </div>
          {
            steps.map((step, index) => {
              let stepIndex = steps.indexOf(step);
              let stepLeftValue = 'calc(' + (stepIndex * (100 / (steps.length - 1))) + '% - ' + (stepIndex * stepIconWidth + stepIconWidth / 2)  + 'px)';
              let stepCompleted = stepIndex <= currentStepIndex;
              let icon = stepCompleted ? stepCompleteIcon : stepIncompleteIcon;
              let numberTextColor = stepCompleted ? ' white-text' : ' tertiary-text-color';
              let stepTextColor = stepCompleted ? ' secondary-text-color' : ' tertiary-text-color';
              let className = 'fleet-stepper-step';

              if (index <= currentStepIndex) {
                className += ' active';
              }

              return (
                <div key={'step_' + step}
                     className={ className }
                     onClick={ () => {
                       if (index <= currentStepIndex) {
                         this.props.handleStepChange(index)
                       }
                     }}
                     style={ { left: stepLeftValue, width: stepIconWidth } }>
                  <img src={ icon } alt="step_icon" />

                  <span className={ 'fleet-stepper-step-number fs-12 text-secondary-font-weight' + numberTextColor }
                        style={ { top: (stepIconHeight / 2) + 'px' } }>
                    { stepIndex + 1 }
                  </span>

                  <span className={ 'fleet-stepper-step-text fs-12' + stepTextColor }> { this.props.steps[step] } </span>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

Stepper.propTypes = {
  steps: PropTypes.object.isRequired,
  currentStep: PropTypes.string.isRequired,
  previousStep: PropTypes.string,
  handleStepChange: PropTypes.func
}
