import React, { Component } from 'react';

import UsersService from '../../shared/services/users/users_service';

import UserForm from './user_profile/user_form';
import UserImage from './user_profile/user_image';

import S3Uploader from '../../shared/external/s3_uploader';

export default class UserProfileDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: undefined,
      user: {
        images: {}
      }
    }

    this.handleImageFile = this.handleImageFile.bind(this);
    this.handleFirstNameUpdate = this.handleFirstNameUpdate.bind(this);
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

  handleFirstNameUpdate(name) {
    console.log(name)
  }

  componentWillMount() {
    UsersService.show('me')
                .then(response => {
                  let user = response.data.data.user;
                  console.log(user);

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
                  handleFirstNameUpdate={this.handleFirstNameUpdate} />
      </div>
    )
  }
}
