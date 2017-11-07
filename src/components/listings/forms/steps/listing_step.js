import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import Button from '../../../miscellaneous/button';

import Constants from '../../../../miscellaneous/constants';

const stepDirections = Constants.stepDirections();

class ListingStep extends Component {

  constructor(props) {
    super(props);

    this.proceedToNextStep = this.proceedToNextStep.bind(this);
    this.handleNextEvent = this.handleNextEvent.bind(this);
  }

  proceedToNextStep() {
    if (this.props.validateFields()) {
      if ( this.props.finalStep ) {
        this.props.handleCompleteListing(this.props.getListingProperties());
      }
      else {
        this.props.handleProceedToStepAndAddProperties(stepDirections.next, this.props.getListingProperties());
      }
    }
    else {
      let errorMessage = this.props.intl.formatMessage({ id: 'errors.forms.fill_up_all_required_fields' });
      Alert.error(errorMessage);
    }
  }

  handleNextEvent(event) {
    if (event) {
      event.preventDefault();
    }

    if (this.props.validateFields()) {
      this.proceedToNextStep();
    }
  }

  render() {
    let nextButtonText = (<FormattedMessage id="application.next" />);
    let previewButton = <div></div>;

    if (this.props.finalStep)  {
      nextButtonText = (<FormattedMessage id="listings.complete_listing" />);

      previewButton = (
        <Link to={ {
          pathname: '/listings/preview',
          state: {
            listing: this.props.listing,
            previousPage: {
              pathname: this.props.listing.id ? `/listings/${this.props.listing.id}/edit` : '/listings/new',
              props: {
                finalStep: true
              }
            }
          }
        } }>
          <Button className="tomato white-text" onClick={ () => {} }>
            <FormattedMessage id="listings.preview" />
          </Button>
        </Link>
      )
    }

    return (
      <form onSubmit={ this.handleNextEvent }>
        <div className="col-xs-12 no-side-padding">
          { this.props.children }

          { previewButton }

          <button className="proceed-to-step-btn btn secondary-color white-text fs-12 pull-right"
                  onClick={ this.handleNextEvent }
                  disabled={ !this.props.validateFields() }>
            { nextButtonText }
          </button>
        </div>
      </form>
    )
  }
}

export default ListingStep;

ListingStep.propTypes = {
  listing: PropTypes.object.isRequired,
  validateFields: PropTypes.func.isRequired,
  getListingProperties: PropTypes.func.isRequired,
  handleProceedToStepAndAddProperties: PropTypes.func,
  handleCompleteListing: PropTypes.func,
  finalStep: PropTypes.bool,
  intl: PropTypes.object
}
