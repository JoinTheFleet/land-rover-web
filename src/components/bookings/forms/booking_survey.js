import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import BookingSurveyIssue from './booking_survey_issue';

import FormGroup from '../../miscellaneous/forms/form_group';
import FormField from '../../miscellaneous/forms/form_field';
import Button from '../../miscellaneous/button';
import Loading from '../../miscellaneous/loading';
import ConfirmationModal from '../../miscellaneous/confirmation_modal';

import BookingsService from '../../../shared/services/bookings/bookings_service';
import BookingSurveysService from '../../../shared/services/bookings/booking_surveys_service';
import BookingSurveyIssuesService from '../../../shared/services/bookings/booking_survey_issues_service';
import LocalizationService from '../../../shared/libraries/localization_service';
import S3Uploader from '../../../shared/external/s3_uploader';

import Errors from '../../../miscellaneous/errors';

class BookingSurvey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      survey: {},
      currentIssue: {},
      showConfirmNoIssuesModal: false,
      loading: false
    };

    this.addError = this.addError.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.fetchSurvey = this.fetchSurvey.bind(this);
    this.confirmNoIssues = this.confirmNoIssues.bind(this);
    this.saveCurrentIssue = this.saveCurrentIssue.bind(this);
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

  deleteIssue(issue) {
    this.setState({
      loading: true
    }, () => {
      BookingSurveyIssuesService.destroy(this.props.booking.id, this.state.survey.id, issue.id)
                                .then(response => {
                                  let survey = this.state.survey;

                                  survey.issues.splice(survey.issues.indexOf(issue), 1);

                                  this.setState({ survey: survey, loading: false });
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
      let survey = this.state.survey;

      S3Uploader.upload(this.state.currentIssue.image, 'booking_survey_images')
                .then(response => {
                  let imageUrl = response.Location;

                  BookingSurveyIssuesService.create(this.props.booking.id, this.state.survey.id, this.state.currentIssue.title, this.state.currentIssue.caption, imageUrl)
                                            .then(response => {
                                              survey.issues.push(response.data.data.issue);

                                              this.setState({ survey: survey, currentIssue: {}, loading: false });
                                            })
                                            .catch(error => this.addError(Errors.extractErrorMessage(error)));
                })
                .catch(error => {
                  Alert.error(LocalizationService.formatMessage('bookings.surveys.could_not_upload_image'))
                });
    });
  }

  confirmNoIssues() {
    this.setState({ loading: true }, () => {
      BookingsService.confirm_survey(this.props.booking.id)
                     .then(response => {
                       this.setState({ loading: false }, this.props.handleSaveSurvey);
                     })
                     .catch(error => { this.addError(Errors.extractErrorMessage(error)); });
    });
  }

  addError(error) {
    this.setState({ loading: false }, () => { Alert.error(error); });
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
    if (this.props.confirmSurvey && !this.state.raiseAnIssue) {
      return '';
    }

    return (
      <div className="booking-survey-raise-issue-tile fleet-tile col-xs-12 no-side-padding">
        <div className="booking-survey-raise-issue-tile-header tile-header fs-16 secondary-color white-text col-xs-12">
          { LocalizationService.formatMessage('bookings.surveys.raise_an_issue') }
        </div>

        <div className="booking-survey-raise-issue-tile-content tile-content col-xs-12">
          <FormGroup placeholder={ LocalizationService.formatMessage('bookings.surveys.photo') }>
            <FormField type="file"
                       hiddenInput
                       id="booking_survey_issue_photo_input"
                       value={ this.state.currentIssue.image ? this.state.currentIssue.image.name : '' }
                       handleChange={ (event) => { this.setCurrentIssueParamValue('image', event.target.files[0]); } } />
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

          <Button className="pull-right secondary-color white-text"
                  disabled={ !this.state.currentIssue.title || !this.state.currentIssue.caption || !this.state.currentIssue.image }
                  onClick={ this.saveCurrentIssue }>
            { LocalizationService.formatMessage('application.save') }
          </Button>
        </div>
      </div>
    )
  }

  renderIssuesList() {
    if (!this.state.survey.issues || (this.state.survey.issues && this.state.survey.issues.length === 0)) {
      if (this.props.currentUserRole === 'owner' && this.props.booking.survey_confirmed) {
        return (
          <div className="text-center col-xs-12 no-side-padding">
            <p className="tertiary-text-color fs-20">
              <br/>
              { LocalizationService.formatMessage('bookings.surveys.no_issues_reported') }
            </p>
          </div>
        )
      }

      if (!this.props.confirmSurvey) {
        return '';
      }

      return (
        <div className="secondary-text-color text-center col-xs-12 no-side-padding">
          <p>
            <br/>
            { `*${LocalizationService.formatMessage('bookings.surveys.please_walk_around_the_vehicle_and_make_note')}` }
          </p>
        </div>
      )
    }

    return (
      <div className="booking-survey-issues-list col-xs-12 no-side-padding">
        {
          this.state.survey.issues.map(issue => {
            return (<BookingSurveyIssue key={ issue.id } issue={ issue } handleDeleteIssue={ this.deleteIssue } />)
          })
        }
      </div>
    )
  }

  renderButtons() {
    let confirmNoIssuesDiv = '';
    let saveSurveyDiv = (
      <div className="col-xs-12 text-center no-side-padding">
        <Button className="tomato white-text text-center fs-16"
                onClick={ this.props.handleSaveSurvey }>
          { LocalizationService.formatMessage('bookings.surveys.save_vehicle_survey') }
        </Button>
      </div>
    );

    if (this.props.confirmSurvey && (!this.state.survey.issues || (this.state.survey.issues && this.state.survey.issues.length === 0))) {
      saveSurveyDiv = '';
      confirmNoIssuesDiv = (
        <div className="col-xs-12 text-center no-side-padding survey-buttons">
          <Button className="tomato white-text text-center fs-16"
                  hidden={ this.state.raiseAnIssue }
                  disabled={ this.state.survey && Object.keys(this.state.currentIssue).length > 0 }
                  onClick={ () => { this.setState({ raiseAnIssue: true }) } }>
            { LocalizationService.formatMessage('bookings.surveys.raise_an_issue') }
          </Button>

          <Button className="secondary-color white-text text-center fs-16"
                  disabled={ this.state.survey && Object.keys(this.state.currentIssue).length > 0 }
                  onClick={ () => { this.setState({ showConfirmNoIssuesModal: true }) } }>
            { this.state.raiseAnIssue ? LocalizationService.formatMessage('application.confirm') : LocalizationService.formatMessage('bookings.surveys.confirm_no_issues') }
          </Button>

          <ConfirmationModal open={ this.state.showConfirmNoIssuesModal }
                             toggleModal={ () => { this.setState(prevState => ({ showConfirmNoIssuesModal: !prevState.showConfirmNoIssuesModal })) } }
                             modalName="confirmNoIssues"
                             title={ LocalizationService.formatMessage('bookings.surveys.confirm_no_issues') }
                             confirmationText={ LocalizationService.formatMessage('application.confirm') }
                             cancelText={ LocalizationService.formatMessage('application.cancel') }
                             confirmationAction={ this.confirmNoIssues }
                             cancelAction={ () => { this.setState(prevState => ({ showConfirmNoIssuesModal: !prevState.showConfirmNoIssuesModal })) } } >
            <p> { LocalizationService.formatMessage('bookings.surveys.confirm_there_is_no_damage') } </p>
          </ConfirmationModal>
        </div>
      )
    }

    return (
      <div className="booking-survey-action-buttons text-center col-xs-12">
        { saveSurveyDiv }

        { confirmNoIssuesDiv }
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

        { this.renderButtons() }

        { this.renderLoading() }
      </div>
    );
  }
}

BookingSurvey.propTypes = {
  booking: PropTypes.object.isRequired,
  handleSaveSurvey: PropTypes.func,
  confirmSurvey: PropTypes.bool
};

export default BookingSurvey;
