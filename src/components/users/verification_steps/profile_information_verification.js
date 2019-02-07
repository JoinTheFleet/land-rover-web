import React, { Component } from 'react';

import FormRow from './form_row';
import LocalizationService from '../../../shared/libraries/localization_service';

import S3Uploader from '../../../shared/external/s3_uploader';

import Alert from 'react-s-alert';
import moment from 'moment';

export default class ProfileInformationVerification extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.genderOptions = [
      { value: 'male', label: LocalizationService.formatMessage('user_profile_verified_info.gender.male') },
      { value: 'female', label: LocalizationService.formatMessage('user_profile_verified_info.gender.female') }
    ];

    this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this);
    this.handleImageFile = this.handleImageFile.bind(this);
  }

  verified() {
    let user = this.props.user;

    if (user) {
      return user.first_name && user.first_name.length > 0 &&
             user.last_name && user.last_name.length > 0 &&
             user.gender && user.gender.length > 0 &&
             ((user.verifications_required && !user.verifications_required.profile_image) || (user.imageURL && user.imageURL.length > 0)) &&
             user.date_of_birth;
    }

    return false;
  }

  title() {
    return LocalizationService.formatMessage("user_verification.profile_information");
  }

  handleDateOfBirthChange(event) {
    let date = moment(event.target.value, 'DD/MM/YYYY').utc();

    if (event.target.value.length === 10) {
      if (date.isAfter(moment().startOf('day'))) {
        Alert.error(LocalizationService.formatMessage('user_profile_verified_info.previous_date_of_birth'));
      }
      else {
        this.props.updateUserField('date_of_birth', date.unix());
        this.setState({ showDatePrompt: false });
      }
    }
    else {
      this.setState({ showDatePrompt: true });
    }
  }

  handleImageFile(event) {
    if (event && event.target && event.target.files) {
      let file = event.target.files[0];

      if (file.size >= 5000000) {
        Alert.error(LocalizationService.formatMessage('listings.images.maximum_file_size'));
      }
      else if (!file.type.startsWith("image/")) {
        Alert.error(LocalizationService.formatMessage('listings.images.invalid_type'));
      }
      else {
        this.props.loading(true, () => {
          S3Uploader.upload(file, 'user_avatar')
                    .then(response => {
                      this.props.updateUserField('imageURL', response.Location);
                      this.setState({
                        imageURL: response.Location
                      }, () => {
                        this.props.loading(false);
                      });
                    })
                    .catch(() => {
                      this.props.loading(false);
                    });
        })
      }
    }
  }

  render() {
    let image = <i className='fa fa-user-circle' />;

    if (this.state.imageURL || (this.props.user && this.props.user.verifications_required && !this.props.user.verifications_required.profile_image)) {
      image = <img src={ this.state.imageURL || this.props.user.images.medium_url } alt='user' />
    }

    return (
      <div className='col-xs-12 verification-form'>
        <input id='imageInput' type='file' style={{ display: 'none'}} accept="image/*" onChange={ this.handleImageFile } ref='imageInput'/>
        <div className='col-xs-12 no-side-padding image' onClick={ () => { this.refs.imageInput.click() } }>
          <div className='col-xs-12 no-side-padding'>
            { image }
          </div>
          <div className='col-xs-12 no-side-padding text-center'>
            { LocalizationService.formatMessage('user_verification.add_profile_photo') }
          </div>
        </div>
        
        <FormRow type='text' id='user-first-name' value={ this.props.user.first_name } handleChange={ (event) => { this.props.updateUserField('first_name', event.target.value) } } placeholder={ LocalizationService.formatMessage('user_profile.first_name') } />
        <FormRow type='text' id='user-last-name' value={ this.props.user.last_name } handleChange={ (event) => { this.props.updateUserField('last_name', event.target.value) } } placeholder={ LocalizationService.formatMessage('user_profile.last_name') } />
        <FormRow type='select' id='user-gender' clearable={ false } value={ this.props.user.gender } handleChange={ (value) => { this.props.updateUserField('gender', value.value) } } options={ this.genderOptions } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.gender') } />
        <FormRow type='cleavedate' id='user-dateofbirth' handleChange={ this.handleDateOfBirthChange } value={ this.props.user.date_of_birth ? moment.unix(this.props.user.date_of_birth).format('DD/MM/YYYY') : undefined } placeholder={ LocalizationService.formatMessage('user_profile_verified_info.date_of_birth') } />
        <div className='col-xs-12 no-side-padding text-danger' hidden={ !this.state.showDatePrompt }>{ LocalizationService.formatMessage('application.date_format_prompt') }</div>
        <FormRow type='textarea' id='user-description' value={ this.props.user.description ? this.props.user.description : '' } handleChange={ (event) => { this.props.updateUserField('description', event.target.value) } } placeholder={ LocalizationService.formatMessage('user_profile.description') } fieldPlaceholder={ this.props.scope === 'renter' ? LocalizationService.formatMessage('user_verification.renter_description') : LocalizationService.formatMessage('user_verification.owner_description') } />
      </div>
    );
  }
}