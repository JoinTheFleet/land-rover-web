import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';

class BookingSurveyIssue extends Component {
  render() {
    if (!this.props.issue) {
      return '';
    }

    return (
      <div className="booking-survey-issue-row">
        <div className='col-xs-2 col-lg-1'>
          <Avatar src={ this.props.issue.image_url } />
        </div>

        <div className='col-xs-10 col-lg-11'>
          <div> <b>{ this.props.issue.title }</b> </div>
          <div> { this.props.issue.caption } </div>

          <div className="pull-right tertiary-text-color">

          </div>
        </div>

      </div>
    );
  }
}

BookingSurveyIssue.propTypes = {
  issue: PropTypes.object.isRequired
};

export default BookingSurveyIssue;
