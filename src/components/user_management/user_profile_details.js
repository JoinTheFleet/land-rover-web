import React, { Component } from 'react';

import UsersService from '../../shared/services/users/users_service';

import UserForm from './user_profile/user_form';
import UserImage from './user_profile/user_image';
import FormButtonRow from '../miscellaneous/forms/form_button_row';

import S3Uploader from '../../shared/external/s3_uploader';
import { FormattedMessage } from 'react-intl';

export default class UserProfileDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: undefined,
      user: {
        images: {}
      }
    };

    this.handleImageFile = this.handleImageFile.bind(this);
    this.handleFirstNameUpdate = this.handleFirstNameUpdate.bind(this);
    this.handleLastNameUpdate = this.handleLastNameUpdate.bind(this);
    this.handleDescriptionUpdate = this.handleDescriptionUpdate.bind(this);
    this.setUser = this.setUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  handleImageFile(event) {
    if (event && event.target && event.target.files) {
      let file = event.target.files[0];

      S3Uploader.upload(file, 'user_avatar')
        .then(response => {
          this.setState({imageURL: response.Location });
        })
        .catch(error => {
          this.setState({imageURL: undefined});
        });
    }
  }

  handleFirstNameUpdate(event) {
    let user = this.state.user;

    user.first_name = event.target.value;

    this.setUser(user);
  }

  handleLastNameUpdate(event) {
    let user = this.state.user;

    user.last_name = event.target.value;

    this.setUser(user);
  }

  handleDescriptionUpdate(event) {
    let user = this.state.user;

    user.description = event.target.value;

    this.setUser(user);
  }

  setUser(user) {
    this.setState({ user: user })
  }


  updateUser() {
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
      UsersService.update('me', {
        user: user_params
      }).then(response => {
        this.setState({
          user: response.data.data.user
        });
      })
    }
  }

  componentWillMount() {
    UsersService.show('me')
                .then(response => {
                  let user = response.data.data.user;

                  this.setState({
                    user: user,
                    imageURL: user.images.original_url
                  });
                });
  }

  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        <UserImage handleImageFile={this.handleImageFile}
                   imageURL={this.state.imageURL} />
        <UserForm user={this.state.user}
                  handleFirstNameUpdate={this.handleFirstNameUpdate}
                  handleLastNameUpdate={this.handleLastNameUpdate}
                  handleDescriptionUpdate={this.handleDescriptionUpdate} />

        <FormButtonRow>
          <button className='btn btn-primary text-center col-xs-12 col-sm-3 pull-right no-side-padding' onClick={ this.updateUser }>
            <FormattedMessage id="application.save" />
          </button>
        </FormButtonRow>
      </div>
    )
  }
}
