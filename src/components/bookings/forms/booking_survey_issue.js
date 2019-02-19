import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../miscellaneous/button';

import LocalizationService from '../../../shared/libraries/localization_service';

import noImagePlaceholder from '../../../assets/images/placeholder-no-images.png';

class BookingSurveyIssue extends Component {
  render() {
    if (!this.props.issue) {
      return '';
    }

    let imageBackground = `url(${this.props.issue.images.medium_url || noImagePlaceholder})`

    return (
      <div className="booking-survey-issue-row">
        <div className='col-xs-2 no-side-padding'>
          <div className="booking-survey-issue-row-image" style={ { backgroundImage: imageBackground } }></div>
        </div>

        <div className='col-xs-10'>
          <div> <b>{ this.props.issue.title }</b> </div>
          <div> { this.props.issue.caption } </div>

          <Button className="tomato white-text pull-right"
                  onClick={ () => { this.props.handleDeleteIssue(this.props.issue) } }>
            { LocalizationService.formatMessage('application.delete') }
          </Button>
        </div>

      </div>
    );
  }
}

BookingSurveyIssue.propTypes = {
  issue: PropTypes.object.isRequired,
  handleDeleteIssue: PropTypes.func.isRequired
};

export default BookingSurveyIssue;
