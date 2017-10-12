import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';
import Alert from '../../../miscellaneous/alert';

import Constants from '../../../../miscellaneous/constants';

const stepDirections = Constants.stepDirections();

class ListingStep extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.proceedToNextStep = this.proceedToNextStep.bind(this);
  }

  proceedToNextStep() {
    if (this.props.validateFields()) {
      this.props.handleProceedToStepAndAddProperties(stepDirections.next, this.props.getListingProperties());
    }
    else {
      let errorMessage = this.props.intl.formatMessage({ id: 'errors.forms.fill_up_all_required_fields' });
      let errors = this.state.errors;
      errors.push(errorMessage);

      this.setState({ errors: errors });
    }
  }

  render() {
    let errors = this.state.errors;

    return (
      <div className="col-xs-12 no-side-padding">
        { this.props.children }
        <button className="proceed-to-step-btn btn secondary-color white-text fs-12 pull-right"
                onClick={ this.proceedToNextStep }>
          <FormattedMessage id="application.next" />
        </button>
        {
          errors.map((error, index) => {
            return (<Alert key={ "error" + index } type="danger" message={ error } />)
          })
        }
      </div>
    )
  }
}

export default ListingStep;

ListingStep.propTypes = {
  validateFields: PropTypes.func.isRequired,
  getListingProperties: PropTypes.func.isRequired,
  handleProceedToStepAndAddProperties: PropTypes.func.isRequired,
  intl: PropTypes.object
}
