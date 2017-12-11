import React, { Component } from 'react';
import FormRow from '../../miscellaneous/forms/form_row';

import LocalizationService from '../../../shared/libraries/localization_service';

export default class UserForm extends Component {
  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        <div className="panel-form row">
          <div className='col-xs-12 form-header'>
            { LocalizationService.formatMessage('user_profile.profile') }
          </div>
          <div className='col-xs-12 form-body'>
            <FormRow type='text' id='user-first-name' value={ this.props.user.first_name } handleChange={ this.props.handleFirstNameUpdate } placeholder={ LocalizationService.formatMessage('user_profile.first_name') } />
            <FormRow type='text' id='user-last-name' value={ this.props.user.last_name } handleChange={ this.props.handleLastNameUpdate } placeholder={ LocalizationService.formatMessage('user_profile.last_name') } />
            <FormRow type='textarea' id='user-description' value={ this.props.user.description ? this.props.user.description : '' } handleChange={ this.props.handleDescriptionUpdate } placeholder={ LocalizationService.formatMessage('user_profile.description') } />
          </div>
        </div>
      </div>
    )
  }
}
