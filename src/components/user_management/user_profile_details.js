import React, { Component } from 'react';
import Alert from 'react-s-alert';

import UserForm from './user_profile/user_form';
import UserImage from './user_profile/user_image';
import FormButtonRow from '../miscellaneous/forms/form_button_row';
import Button from '../miscellaneous/button';
import Loading from '../miscellaneous/loading';

import LocalizationService from '../../shared/libraries/localization_service';
import UsersService from '../../shared/services/users/users_service';
import S3Uploader from '../../shared/external/s3_uploader';

export default class UserProfileDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: undefined,
      user: {
        images: {}
      },
      loading: false,
      accountUpdating: false
    };

    this.handleImageFile = this.handleImageFile.bind(this);
    this.handleFirstNameUpdate = this.handleFirstNameUpdate.bind(this);
    this.handleLastNameUpdate = this.handleLastNameUpdate.bind(this);
    this.handleDescriptionUpdate = this.handleDescriptionUpdate.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      UsersService.show('me')
                  .then(response => {
                    let user = response.data.data.user;

                    this.setState({
                      loading: false,
                      user: user,
                      imageURL: user.images.original_url
                    });
                  })
                  .catch(error => {
                    this.setState({ loading: false }, Alert.error(LocalizationService.formatMessage('user_profile.unable_to_retrieve_account_details')));
                  });
    });
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
        S3Uploader.upload(file, 'user_avatar')
          .then(response => {

            this.setState({
              imageURL: response.Location
            }, this.props.setDirty);
          })
          .catch(error => {
            this.setState({imageURL: undefined});
          });
      }
    }
  }

  handleFirstNameUpdate(event) {
    let user = this.state.user;

    user.first_name = event.target.value;

    this.setState({
      user: user
    }, this.props.setDirty);
  }

  handleLastNameUpdate(event) {
    let user = this.state.user;

    user.last_name = event.target.value;

    this.setState({
      user: user
    }, this.props.setDirty);
  }

  handleDescriptionUpdate(event) {
    let user = this.state.user;

    user.description = event.target.value;

    this.setState({
      user: user
    }, this.props.setDirty);
  }

  updateUser(event) {
    if (event) {
      event.preventDefault();
    }

    let user = this.state.user;
    let user_params = {
      first_name: user.first_name,
      last_name: user.last_name,
      description: user.description
    };

    if (this.state.imageURL) {
      user_params.image_url = this.state.imageURL;
    }

    if (user) {
      this.setState({
        accountUpdating: true
      }, () => {
        UsersService.update('me', {
          user: user_params
        }).then(response => {
          Alert.success(LocalizationService.formatMessage('user_profile_verified_info.account_success'));
          this.setState({
            user: response.data.data.user,
            accountUpdating: false
          }, this.props.setClean);
        }).catch(error => {
          this.setState({ accountUpdating: false });
          Alert.error(error.response.data.message);
        })
      });
    }
  }

  render() {
    let body = '';

    if (this.state.loading) {
      body = <Loading />;
    }
    else {
      body = (
        <div className="col-xs-12 no-side-padding">
          <UserImage handleImageFile={this.handleImageFile}
                    imageURL={this.state.imageURL} />
          <form onSubmit={ this.updateUser }>
            <UserForm user={this.state.user}
                      handleFirstNameUpdate={this.handleFirstNameUpdate}
                      handleLastNameUpdate={this.handleLastNameUpdate}
                      handleDescriptionUpdate={this.handleDescriptionUpdate} />

            <FormButtonRow>
              <Button className="btn btn-primary text-center col-xs-12 col-sm-3 pull-right"
                      spinner={ this.state.accountUpdating }
                      disabled={ this.state.accountUpdating }
                      onClick={ this.updateUser } >
                { LocalizationService.formatMessage('application.update_profile') }
              </Button>
            </FormButtonRow>
          </form>
        </div>
      )
    }

    return (
      <div className='dashboard-section'>
        <div className='col-xs-12 no-side-padding review-title'>
          <span className='main-text-color title'>
            { LocalizationService.formatMessage('dashboard.profile_details') }
          </span>
        </div>
        { body }
      </div>
    )
  }
}
