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
  render() {
    let steps = Object.keys(this.props.steps);
    let currentStepIndex = steps.indexOf(this.props.currentStep);
    let previousStepIndex = steps.indexOf(this.props.previousStep);
    let totalDividers = steps.length + 2;
    let stepperContainerStyle = {
      marginLeft: 'calc(100% / ' + totalDividers + ')',
      width: 'calc(100% / ' + totalDividers + ' * 5 )'
    };

    return (
      <div className="fleet-stepper smoke-grey col-xs-12 no-side-padding">
        <div className="fleet-stepper-steps"
             style={ stepperContainerStyle }>
          <div className="fleet-stepper-bar white">
            <Anime easing="linear"
                    duration={ 500 }
                    width={ (100 / (steps.length - 1) * currentStepIndex) + '%' }
                    begin={ (anime) => {
                      if (this.props.previousStep) {
                        anime.animatables[0].target.style.width = (100 / (steps.length - 1) * previousStepIndex) + '%';
                      }
                    } }>
              <div className="fleet-stepper-bar-progress secondary-color"></div>
            </Anime>
          </div>
          {
            steps.map((step) => {
              let stepIndex = steps.indexOf(step);
              let stepLeftValue = 'calc(' + (stepIndex * (100 / (steps.length - 1))) + '% - ' + (stepIndex * stepIconWidth + stepIconWidth / 2)  + 'px)';
              let stepCompleted = stepIndex <= currentStepIndex;
              let icon = stepCompleted ? stepCompleteIcon : stepIncompleteIcon;
              let numberTextColor = stepCompleted ? ' white-text' : ' tertiary-text-color';
              let stepTextColor = stepCompleted ? ' secondary-text-color' : ' tertiary-text-color';

              return (
                <div key={'step_' + step}
                     className="fleet-stepper-step"
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
  previousStep: PropTypes.string
}
