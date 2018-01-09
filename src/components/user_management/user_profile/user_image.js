import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class UserImage extends Component {
  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        <div className="panel-form row">
          <div className='col-xs-12 form-header'>
            <FormattedMessage id="user_profile.profile_photo" />
          </div>
          <div className='col-xs-12 form-body'>
            { this.props.imageURL ? <img className='col-xs-12 col-sm-8 col-sm-offset-2 col-md-4 col-md-offset-4 panel-image' alt='' src={ this.props.imageURL}/> : '' }

            <input id='imageInput' type='file' accept="image/*" onChange={ this.props.handleImageFile } style={{ display: 'none'}} ref={(ref) => this.imageInput = ref} />

            <button className='btn btn-primary text-center col-xs-12' onClick={ (event) => this.imageInput.click() }>
              <FormattedMessage id="user_profile.upload_profile_pic" />
            </button>
          </div>
        </div>
      </div>
    )
  }
}
