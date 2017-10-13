import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import FormRow from '../../miscellaneous/forms/form_row';
import moment from 'moment';

class UserForm extends Component {
  handleChange() {
    console.log(arguments)
  }
  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        <div className="panel-form row">
          <div className='col-xs-12 form-header'>

            <FormattedMessage id="user_profile.profile" />
          </div>
          <div className='col-xs-12 form-body'>
            <FormRow type='text' id='user-first-name' value={ this.props.user.first_name } placeholder={ this.props.intl.formatMessage({id: 'user_profile.first_name'}) } />
            <FormRow type='text' id='user-last-name' value={ this.props.user.last_name } placeholder={ this.props.intl.formatMessage({id: 'user_profile.last_name'}) } />
            <FormRow type='textarea' id='user-description' value={ this.props.user.description ? this.props.user.description : '' } placeholder={ this.props.intl.formatMessage({id: 'user_profile.description'}) } />
            <FormRow type='singledate' id='user-dateofbirth' handleChange={this.handleChange} handleFocusChange={this.handleChange} value={ this.props.user.date_of_birth ? moment.unix(this.props.user.date_of_birth).utc() : moment().utc() } placeholder={ this.props.intl.formatMessage({id: 'user_profile.date_of_birth'}) } />
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(UserForm)
