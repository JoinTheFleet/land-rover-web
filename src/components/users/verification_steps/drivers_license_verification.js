import React, { Component } from 'react';

import FormRow from './form_row';
import LocalizationService from '../../../shared/libraries/localization_service';
import IdentificationsService from '../../../shared/services/identifications_service';

import S3Uploader from '../../../shared/external/s3_uploader';

import Alert from 'react-s-alert';
import moment from 'moment';

export default class DriversLicenseVerification extends Component {
  constructor(props) {
    super(props);

    this.driversLicenseOptions = [];
    this.driversLicenseTypes = [];

    this.state = {};

    if (props && props.configurations) {
      this.driversLicenseTypes = props.configurations.drivers_license_types;
      this.driversLicenseOptions = this.driversLicenseTypes.map((licenseType) => {
        return {
          value: licenseType.id,
          label: licenseType.name
        }
      });
    }

    this.handleIssueDateChange = this.handleIssueDateChange.bind(this);
    this.beforeTransition = this.beforeTransition.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.submitLicense = this.submitLicense.bind(this);
  }

  verified() {
    return this.state.licenseType && this.state.licenseNumber && this.state.issueDate && this.state.frontImageURL && this.state.backImageURL;
  }

  title() {
    return LocalizationService.formatMessage("user_verification.drivers_license");
  }

  handleIssueDateChange(event) {
    let date = moment(event.target.value, 'DD/MM/YYYY').utc();

    if (event.target.value.length === 10) {
      if (date.isAfter(moment().startOf('day'))) {
        Alert.error(LocalizationService.formatMessage('user_verification.future_issue_date'));
      }
      else {
        this.setState({ issueDate: date.unix() })
      }
    }
  }

  handleImageChange(side, event) {
    if (event && event.target && event.target.files) {
      let file = event.target.files[0];

      let state = {};

      state[side + 'Image'] = event.target.value

      this.setState(state, () => {
        this.props.loading(true, () => {
          S3Uploader.upload(file, 'driver_license_direct_upload')
                    .then(response => {
                      state[side + 'ImageURL'] = response.Location;
                      this.setState(state, () => {
                        this.props.loading(false);
                      });
                    })
                    .catch(error => {
                      Alert.error(LocalizationService.formatMessage('application.image_failed'));

                      state[side + 'ImageURL'] = undefined;
                      state[side + 'Image'] = undefined;
                      this.setState(state, () => {
                        this.props.loading(false);
                      });
                    });
        });
      });
    }
  }

  submitLicense(callback) {
    let country = undefined;
    let date = moment.unix(this.state.issueDate);

    let license = this.driversLicenseTypes.find((licenseType) => {
      return licenseType.id === this.state.licenseType;
    });

    if (license) {
      if (license.shows_nested_countries) {
        let countryObj = license.countries.find((country) => {
          return country.id === this.state.country;
        });

        if (countryObj) {
          country = countryObj.code;
        }
      }
      else {
        country = license.countries[0].code;
      }
    }

    this.props.loading(true, () => {
      IdentificationsService.create(
        this.state.licenseNumber,
        date.month(),
        date.year(),
        this.state.licenseType,
        country,
        this.state.frontImageURL,
        this.state.backImageURL
      )
      .then(response => {
        Alert.success(LocalizationService.formatMessage('user_profile_verified_info.license_pending'));

        this.setState({
          licenseUploaded: true
        }, () => {
          this.props.loading(false);
          if (callback) {
            callback();
          }
        })
      })
      .catch(error => {
        this.props.loading(false);
        if (error.response) {
          Alert.error(error.response.data.message)
        }
      });
    })
  }

  beforeTransition(callback) {
    this.submitLicense(callback)
  }

  render() {
    return (
      <div className='col-xs-12 verification-form'>
        <FormRow id='license-type' type='select' handleChange={ (event) => { this.setState({ licenseType: event.value }) } } options={ this.driversLicenseOptions } value={ this.state.licenseType } placeholder={ LocalizationService.formatMessage('user_verification.select_license_type') } />
        <FormRow type='text' id='license-number' value={ this.state.licenseNumber } handleChange={ (event) => { this.setState({ licenseNumber: event.target.value }) } } placeholder={ LocalizationService.formatMessage('user_verification.license_number') } />
        <FormRow type='cleavedate' id='license-issue-date' handleChange={ this.handleIssueDateChange } value={ this.state.issueDate ? moment.unix(this.state.issueDate).format('DD/MM/YYYY') : undefined } placeholder={ LocalizationService.formatMessage('user_verification.license_issue_date') } />
        <FormRow id='license-front' type={ 'file' } handleChange={ (event) => { this.handleImageChange('front', event) } } value={ this.state.frontImage } placeholder={ LocalizationService.formatMessage('user_verification.front_of_license') } />
        <FormRow id='license-back' type={ 'file' } handleChange={ (event) => { this.handleImageChange('back', event) } } value={ this.state.backImage } placeholder={ LocalizationService.formatMessage('user_verification.back_of_license') } />
      </div>
    );
  }
}