import React, { Component } from 'react';
import Alert from 'react-s-alert';
import moment from 'moment';

import FormField from '../../miscellaneous/forms/form_field';
import Button from '../../miscellaneous/button';
import LocalizationService from '../../../shared/libraries/localization_service';
import IdentificationsService from '../../../shared/services/identifications_service';
import ConfigurationService from '../../../shared/services/configuration_service';

import S3Uploader from '../../../shared/external/s3_uploader';

export default class VerifyDriversLicenseForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      driversLicenseTypes: [],
      loading: false,
      licenseType: undefined,
      country: undefined,
      frontImage: undefined,
      frontImageURL: undefined,
      backImage: undefined,
      backImageURL: undefined,
      licenseNumber: undefined,
      issueDate: moment().utc()
    }

    this.handleLicenseTypeChange = this.handleLicenseTypeChange.bind(this);
    this.handleLicenseNumberChange = this.handleLicenseNumberChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleIssueDateChange = this.handleIssueDateChange.bind(this);
    this.handleFrontImageChange = this.handleFrontImageChange.bind(this);
    this.handleBackImageChange = this.handleBackImageChange.bind(this);
    this.canSubmitDriversLicense = this.canSubmitDriversLicense.bind(this);
    this.submitDriversLicense = this.submitDriversLicense.bind(this);
  }

  componentWillMount() {
    ConfigurationService.show()
                        .then(response => {
                          this.setState({ driversLicenseTypes: response.data.data.configuration.drivers_license_types })
                        })
  }

  handleLicenseTypeChange(licenseType) {
    if (licenseType) {
      this.setState({ licenseType: licenseType.value });
    }
  }

  handleCountryChange(country) {
    if (country) {
      this.setState({ country: country.value });
    }
  }

  handleLicenseNumberChange(event) {
    this.setState({ licenseNumber: event.target.value });
  }

  handleIssueDateChange(date) {
    if (date) {
      this.setState({ issueDate: moment(date).utc() });
    }
  }

  handleFrontImageChange(event) {
    if (event && event.target && event.target.files) {
      let file = event.target.files[0];

      this.setState({
        frontImage: event.target.value
      }, () => {
        S3Uploader.upload(file, 'driver_license_direct_upload')
                  .then(response => {
                    this.setState({
                      frontImageURL: response.Location
                    });
                  })
                  .catch(error => {
                    Alert.error(LocalizationService.formatMessage('application.image_failed'));

                    this.setState({
                      frontImageURL: undefined,
                      frontImage: undefined
                    });
                  });
      });
    }
  }

  handleBackImageChange(event) {
    if (event && event.target && event.target.files) {
      let file = event.target.files[0];

      this.setState({
        backImage: event.target.value
      }, () => {
        S3Uploader.upload(file, 'driver_license_direct_upload')
                  .then(response => {
                    this.setState({
                      backImageURL: response.Location
                    });
                  })
                  .catch(error => {
                    Alert.error(LocalizationService.formatMessage('application.image_failed'));

                    this.setState({
                      backImageURL: undefined,
                      backImage: undefined
                    });
                  });
      });
    }
  }

  submitDriversLicense(event) {
    if (event) {
      event.preventDefault();
    }

    let country = undefined;
    let license = this.state.driversLicenseTypes.find((licenseType) => {
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

    if (this.canSubmitDriversLicense()) {
      this.setState({
        loading: true
      }, () => {
        IdentificationsService.create(
          this.state.licenseNumber,
          this.state.issueDate.month(),
          this.state.issueDate.year(),
          this.state.licenseType,
          country,
          this.state.frontImageURL,
          this.state.backImageURL
        )
        .then(response => {
          this.props.toggleModal();
          Alert.success(LocalizationService.formatMessage('user_profile_verified_info.license_pending'));

          this.setState({
            loading: false,
            licenseType: undefined,
            country: undefined,
            frontImage: undefined,
            frontImageURL: undefined,
            backImage: undefined,
            backImageURL: undefined,
            licenseNumber: undefined,
            issueDate: moment().utc()
          })
        })
        .catch(error => {
          this.setState({
            loading: false
          }, () => {
            if (error.response) {
              Alert.error(error.response.data.message)
            }
          });
        });
      });
    }
  }

  renderLicenseTypeSelector() {
    let options = this.state.driversLicenseTypes.map((licenseType) => {
      return {
        value: licenseType.id,
        label: licenseType.name
      }
    });

    return (
      <div className='col-xs-12'>
        <div className='col-xs-12'>
          Select License Type
        </div>
        <div className='col-xs-12'>
          <FormField id='license-type' type='select' handleChange={ this.handleLicenseTypeChange } options={ options } value={ this.state.licenseType } />
        </div>
      </div>
    )
  }

  renderCountrySelector() {
    if (this.state.driversLicenseTypes && this.state.licenseType) {
      let license = this.state.driversLicenseTypes.find((licenseType) => {
        return licenseType.id === this.state.licenseType;
      });

      if (license && license.shows_nested_countries && license.countries.length > 0) {
        let options = license.countries.map((country) => {
          return {
            label: country.name,
            value: country.id
          }
        })
        return (
          <div className='col-xs-12'>
            <div className='col-xs-12'>
              Select Country
            </div>
            <div className='col-xs-12'>
              <FormField id='license-country' type={ 'select' } options={ options } handleChange={ this.handleCountryChange } value={ this.state.country } />
            </div>
          </div>
        )
      }
      else {
        return '';
      }
    }
    else {
      return '';
    }
  }

  canSubmitDriversLicense() {
    if (this.state.driversLicenseTypes && this.state.licenseType) {
      let license = this.state.driversLicenseTypes.find((licenseType) => {
        return licenseType.id === this.state.licenseType;
      });

      return !this.state.loading &&
             license &&
             (!license.shows_nested_countries || this.state.country) &&
             this.state.licenseType &&
             this.state.frontImage &&
             this.state.frontImageURL &&
             this.state.backImage &&
             this.state.backImageURL &&
             this.state.licenseNumber &&
             this.state.issueDate;
    }
    else {
      return false;
    }
  }

  renderLicenseDetails() {
    if (this.state.driversLicenseTypes && this.state.licenseType) {
      let license = this.state.driversLicenseTypes.find((licenseType) => {
        return licenseType.id === this.state.licenseType;
      });

      if (license && (!license.shows_nested_countries || this.state.country)) {
        return (
          <div className='drivers-license-form'>
            <div className='col-xs-12 modal-row'>
              <div className='col-xs-12 col-sm-6 form-label'>
                { LocalizationService.formatMessage('user_profile_verified_info.license_number') }
              </div>
              <div className='col-xs-12 col-sm-6'>
                <FormField id='license-number' type={ 'text' } handleChange={ this.handleLicenseNumberChange } value={ this.state.licenseNumber } />
              </div>
            </div>
            <div className='col-xs-12 modal-row'>
              <div className='col-xs-12 col-sm-6 form-label'>
                { LocalizationService.formatMessage('user_profile_verified_info.issue_date') }
              </div>
              <div className='col-xs-12 col-sm-6'>
                <FormField id='license-issue' type={ 'singleyeardate' } handleChange={ this.handleIssueDateChange } value={ this.state.issueDate } />
              </div>
            </div>
            <div className='col-xs-12 modal-row'>
              <div className='col-xs-12 col-sm-6 form-label'>
                { LocalizationService.formatMessage('user_profile_verified_info.front_of_license') }
              </div>
              <div className='col-xs-12 col-sm-6'>
                <FormField id='license-front' type={ 'file' } handleChange={ this.handleFrontImageChange } value={ this.state.frontImage } />
              </div>
            </div>
            <div className='col-xs-12 modal-row'>
              <div className='col-xs-12 col-sm-6 form-label'>
                { LocalizationService.formatMessage('user_profile_verified_info.back_of_license') }
              </div>
              <div className='col-xs-12 col-sm-6'>
                <FormField id='license-front' type={ 'file' } handleChange={ this.handleBackImageChange } value={ this.state.backImage } />
              </div>
            </div>
            <div className='col-xs-12 modal-row'>
              <div className='col-xs-12 col-sm-4'>
                <Button className='btn btn-primary text-center no-side-padding inherit-width modal-button' spinner={ this.state.loading } disabled={ !this.canSubmitDriversLicense() }>
                  { LocalizationService.formatMessage('application.verify') }
                </Button>
              </div>
            </div>
          </div>
        )
      }
      else {
        return '';
      }
    }
    else {
      return '';
    }
  }

  render() {
    return (
      <form onSubmit={ this.submitDriversLicense }>
        <div className='row'>
          { this.renderLicenseTypeSelector() }
          { this.renderCountrySelector() }
          { this.renderLicenseDetails() }
        </div>
      </form>
    )
  }
}
