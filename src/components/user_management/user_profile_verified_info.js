import React, { Component } from 'react';

import UsersService from '../../shared/services/users/users_service';
import FormButtonRow from '../miscellaneous/forms/form_button_row';

import moment from 'moment';
import UserForm from './user_profile_verified_info/user_form';

import { FormattedMessage, injectIntl } from 'react-intl';

class UserProfileVerifiedInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addressUpdated: false,
      user: {
        address: {
          country: {
          }
        },
      }
    }

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleAddressLine1Change = this.handleAddressLine1Change.bind(this);
    this.handleAddressLine2Change = this.handleAddressLine2Change.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handlePostCodeChange = this.handlePostCodeChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  handleDateChange(date) {
    let user = this.state.user;

    user.date_of_birth = moment(date).utc().unix();

    this.setState({user: user})
  }

  handleAddressLine1Change(event) {
    let user = this.state.user;

    if (!user.address) {
      user.address = {};
    }

    user.address.line1 = event.target.value;

    this.setState({
      addressUpdated: true,
      user: user
    });
  }

  handleAddressLine2Change(event) {
    let user = this.state.user;

    if (!user.address) {
      user.address = {};
    }

    user.address.line2 = event.target.value;

    this.setState({
      addressUpdated: true,
      user: user
    });
  }

  handleStateChange(event) {
    let user = this.state.user;

    if (!user.address) {
      user.address = {};
    }

    user.address.state = event.target.value;

    this.setState({
      addressUpdated: true,
      user: user
    });
  }

  handleCityChange(event) {
    let user = this.state.user;

    if (!user.address) {
      user.address = {};
    }

    user.address.city = event.target.value;

    this.setState({
      addressUpdated: true,
      user: user
    });
  }

  handlePostCodeChange(event) {
    let user = this.state.user;

    if (!user.address) {
      user.address = {};
    }

    user.address.postal_code = event.target.value;

    this.setState({
      addressUpdated: true,
      user: user
    });
  }

  handleGenderChange(option) {
    let user = this.state.user;

    user.gender = option.value;

    this.setState({user: user})
  }

  handleCountryChange(country) {
    let user = this.state.user;

    if (!user.address) {
      user.address = {};
    }

    user.address.country_code = country.value;

    this.setState({
      addressUpdated: true,
      user: user
    });
  }

  handleEmailChange(event) {
    let user = this.state.user;

    if (user) {
      user.email = event.target.value;

      this.setState({user: user})
    }
  }

  updateUser() {
    let user = this.state.user;
    let user_params = {
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      email: user.email
    };

    if (this.state.addressUpdated) {
      user_params.address = {
        line1: user.address.line1,
        line2: user.address.line2,
        state: user.address.state,
        city: user.address.city,
        postal_code: user.address.postal_code,
        country_code: user.address.country_code || user.address.country.alpha2
      }
    }

    if (user) {
      UsersService.update('me', {
        user: user_params
      }).then(response => {
        let user = response.data.data.user;

        if (!user.address) {
          user.address = {};
        }

        this.setState({
          user: user
        });
      });
    }
  }

  componentWillMount() {
    UsersService.show('me')
                .then(response => {
                  let user = response.data.data.user;

                  if (!user.address) {
                    user.address = {};
                  }

                  this.setState({
                    user: user
                  });
                });
  }

  render() {
    return (

      <div className="col-xs-12 no-side-padding">
        <div className="panel-form row">
          <div className='col-xs-12 form-header'>
            <FormattedMessage id="user_profile_verified_info.verified_info" />
          </div>
          <div className='col-xs-12 form-body'>
            <UserForm user={this.state.user}
                      handleDateChange={ this.handleDateChange }
                      handleGenderChange={ this.handleGenderChange }
                      handleCityChange={ this.handleCityChange }
                      handleStateChange={ this.handleStateChange }
                      handleAddressLine1Change={ this.handleAddressLine1Change }
                      handleAddressLine2Change={ this.handleAddressLine2Change }
                      handlePostCodeChange={ this.handlePostCodeChange }
                      handleCountryChange={ this.handleCountryChange }
                      handleEmailChange={ this.handleEmailChange }
                      placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.date_of_birth'}) } />
          </div>
        </div>

        <FormButtonRow>
          <btn className='btn btn-primary text-center col-xs-12 col-sm-3 pull-right no-side-padding' onClick={ this.updateUser }>
            <FormattedMessage id="application.save" />
          </btn>
        </FormButtonRow>
      </div>
    )
  }
}

export default injectIntl(UserProfileVerifiedInfo)
