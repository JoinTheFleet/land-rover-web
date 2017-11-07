import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import BookingSurveyIssue from './booking_survey_issue';

import FormGroup from '../../miscellaneous/forms/form_group';
import FormField from '../../miscellaneous/forms/form_field';
import Button from '../../miscellaneous/button';
import Loading from '../../miscellaneous/loading';

import BookingSurveysService from '../../../shared/services/bookings/booking_surveys_service';
import BookingSurveyIssuesService from '../../../shared/services/bookings/booking_survey_issues_service';
import LocalizationService from '../../../shared/libraries/localization_service';

import Errors from '../../../miscellaneous/errors';

class BookingSurvey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      survey: {},
      currentIssue: {},
      loading: false
    };

    this.addError = this.addError.bind(this);
    this.fetchSurvey = this.fetchSurvey.bind(this);
    this.setCurrentIssueParamValue = this.setCurrentIssueParamValue.bind(this);
  }

  componentDidMount() {
    this.fetchSurvey();
  }

  fetchSurvey() {
    this.setState({
      loading: true
    }, () => {
      BookingSurveysService.index(this.props.booking.id)
                           .then(response => {
                             this.setState({ survey: response.data.data.survey, loading: false });
                           })
                           .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  saveCurrentIssue() {
    if (Object.keys(this.state.survey).length === 0) {
      return;
    }

    this.setState({
      loading: true
    }, () => {
      BookingSurveyIssuesService.create(this.props.booking.id, this.state.survey.id, this.state.survey.title, this.state.survey.caption, this.state.survey.image_url)
                                .then(response => {
                                  let survey = this.state.survey;
                                  survey.issues.push(response.data.data.issue);
                                  console.log(response);

                                  this.setState({ survey: survey, loading: false });
                                })
                                .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  addError(error) {
    this.setState({ loading: false }, Alert.error(error));
  }

  setCurrentIssueParamValue(param, value) {
    let currentIssue = this.state.currentIssue;

    currentIssue[param] = value;

    this.setState({ currentIssue: currentIssue });
  }

  renderListingName() {
    let booking = this.props.booking;

    if (!booking) {
      return '';
    }

    let vehicleTitle = `${booking.listing.variant.make.name} ${booking.listing.variant.model.name}`;

    return (
      <div className="booking-survey-listing-vehicle-name fs-36">
        <b>{ vehicleTitle }</b>
        <span> { ` ${booking.listing.variant.year.year}` } </span>
      </div>
    )
  }

  renderRaiseIssueTile() {
    return (
      <div className="booking-survey-raise-issue-tile fleet-tile col-xs-12 no-side-padding">
        <div className="booking-survey-raise-issue-tile-header tile-header secondary-color white-text">
          { LocalizationService.formatMessage('bookings.surveys.raise_an_issue') }
        </div>

        <div className="booking-survey-raise-issue-tile-content tile-content">
          <FormGroup placeholder={ LocalizationService.formatMessage('bookings.surveys.photo') }>
            <FormField type="file"
                       value={ this.state.currentIssue.image_url } />
          </FormGroup>

          <FormGroup placeholder={ LocalizationService.formatMessage('bookings.surveys.issue_title') }>
            <FormField type="text"
                       value={ this.state.currentIssue.title }
                       handleChange={ (event) => { this.setCurrentIssueParamValue('title', event.target.value) } } />
          </FormGroup>

          <FormGroup placeholder={ LocalizationService.formatMessage('bookings.surveys.issue_caption') }>
            <FormField type="textarea"
                       value={ this.state.currentIssue.caption }
                       handleChange={ (event) => { this.setCurrentIssueParamValue('caption', event.target.value) } } />
          </FormGroup>

          <Button className="secondary-color white-text" onClick={ this.saveCurrentIssue }>
            { LocalizationService.formatMessage('application.save') }
          </Button>
        </div>
      </div>
    )
  }

  renderIssuesList() {
    if (Object.keys(this.state.survey).length === 0) {
      return '';
    }

    return (
      <div className="booking-survey-issues-list col-xs-12 no-side-padding">
        {
          this.state.survey.issues.map(issue => {
            return (<BookingSurveyIssue issue={ issue } />)
          })
        }
      </div>
    )
  }

  renderLoading() {
    if (!this.state.loading) {
      return '';
    }

    return (<Loading fullWidthLoading={ true } />)
  }

  render() {
    return (
      <div className="booking-survey-div col-xs-12 no-side-padding">
        <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          { this.renderListingName() }

          { this.renderRaiseIssueTile() }

          { this.renderIssuesList() }
        </div>

        { this.renderLoading() }
      </div>
    );
  }
}

BookingSurvey.propTypes = {
  booking: PropTypes.object.isRequired,
  handleSaveSurvey: PropTypes.func
};

export default BookingSurvey;
