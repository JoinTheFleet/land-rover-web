import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Alert from 'react-s-alert';
import moment from 'moment';

import UsersService from '../../shared/services/users/users_service';
import FormButtonRow from '../miscellaneous/forms/form_button_row';
import FormField from '../miscellaneous/forms/form_field';
import Loading from '../miscellaneous/loading';

import UserForm from './user_profile_verified_info/user_form';
import BusinessInformationForm from './user_profile_verified_info/business_information_form';

import LocalizationService from '../../shared/libraries/localization_service';
import Errors from '../../miscellaneous/errors';

class UserProfileVerifiedInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addressUpdated: false,
      hideAccountType: false,
      user: {
        address: {
          country: {
          }
        },
        business_details: {
          address: {
            country: {
            }
          }
        }
      },
      loading: false
    };

    this.addError = this.addError.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);

    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleUserCountryChange = this.handleUserCountryChange.bind(this);
    this.handlePostCodeChange = this.handlePostCodeChange.bind(this);
    this.handleAddressLine1Change = this.handleAddressLine1Change.bind(this);
    this.handleAddressLine2Change = this.handleAddressLine2Change.bind(this);

    this.handleBusinessNameChange = this.handleBusinessNameChange.bind(this);
    this.handleBusinessCityChange = this.handleBusinessCityChange.bind(this);
    this.handleBusinessTaxIDChange = this.handleBusinessTaxIDChange.bind(this);
    this.handleBusinessStateChange = this.handleBusinessStateChange.bind(this);
    this.handleBusinessCountryChange = this.handleBusinessCountryChange.bind(this);
    this.handleBusinessPostCodeChange = this.handleBusinessPostCodeChange.bind(this);
    this.handleBusinessAddressLine1Change = this.handleBusinessAddressLine1Change.bind(this);
    this.handleBusinessAddressLine2Change = this.handleBusinessAddressLine2Change.bind(this);
  }

  componentDidMount() {
    if (this.props.location && this.props.location.state) {
      let verificationsNeeded = this.props.location.state.verificationsNeeded;

      if (verificationsNeeded && verificationsNeeded.length > 0) {
        Alert.error(LocalizationService.formatMessage('listings.need_to_complete_verifications',
                                                      { info_to_verify: verificationsNeeded.map(verification => verification.replace(/_/g, ' ')).join(', ') }));
      }
    }

    this.setState({ loading: true }, () => {
      UsersService.show('me')
                  .then(response => {
                    let user = response.data.data.user;

                    if (!user.address) {
                      user.address = {};
                    }

                    this.setState({ loading: false, user: user, hideAccountType: user.account_type === 'company' });
                  })
                  .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  updateUser() {
    let user = this.state.user;

    if (!user) {
      return;
    }

    this.setState({ loading: true}, () => {
      let user_params = {
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        email: user.email,
        country_code: user.country_code || user.country.alpha2,
        account_type: user.account_type
      };

      if (user.account_type === 'company' && user.business_details) {
        let business_details = user.business_details;

        user_params.business = {
          name: business_details.name,
          tax_id: business_details.tax_id,
          line1: business_details.address.line1,
          line2: business_details.address.line2,
          city: business_details.address.city,
          state: business_details.address.state,
          postal_code: business_details.address.postal_code,
          country_code: business_details.address.country_code || business_details.address.country.alpha2
        };
      }

      if (this.state.addressUpdated) {
        user_params.address = {
          line1: user.address.line1,
          line2: user.address.line2,
          state: user.address.state,
          city: user.address.city,
          postal_code: user.address.postal_code,
          country_code: user.address.country_code || user.address.country.alpha2
        };
      }

      UsersService.update('me', { user: user_params })
                  .then(response => {
                    let user = response.data.data.user;

                    if (!user.address) {
                      user.address = {};
                    }

                    this.setState({ loading: false, user: user, hideAccountType: user.account_type === 'company' }, () => {
                      Alert.success(LocalizationService.formatMessage('application.saved_changes_successfully'));
                    });
                  })
                  .catch(error => this.addError(Errors.extractErrorMessage(error)));
    });
  }

  addError(error) {
    this.setState({ loading: false }, () => { Alert.error(error); });
  }

  handleAccountTypeChange(accountType) {
    let user = this.state.user;

    user.account_type = accountType.value;

    this.setState({ user: user });
  }

  handleDateChange(date) {
    let user = this.state.user;

    user.date_of_birth = moment(date).utc().unix();

    this.setState({user: user});
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

  handleBusinessAddressLine1Change(event) {
    let user = this.state.user;

    if (!user.business_details) {
      user.business_details = {
        address: {
        }
      };
    }

    user.business_details.address.line1 = event.target.value;

    this.setState({ user: user });
  }

  handleBusinessAddressLine2Change(event) {
    let user = this.state.user;

    if (!user.business_details) {
      user.business_details = {
        address: {
        }
      };
    }

    user.business_details.address.line2 = event.target.value;

    this.setState({ user: user });
  }

  handleBusinessStateChange(event) {
    let user = this.state.user;

    if (!user.business_details) {
      user.business_details = {
        address: {
        }
      };
    }

    user.business_details.address.state = event.target.value;

    this.setState({ user: user });
  }

  handleBusinessCityChange(event) {
    let user = this.state.user;

    if (!user.business_details) {
      user.business_details = {
        address: {
        }
      };
    }

    user.business_details.address.city = event.target.value;

    this.setState({ user: user });
  }

  handleBusinessPostCodeChange(event) {
    let user = this.state.user;

    if (!user.business_details) {
      user.business_details = {
        address: {
        }
      };
    }

    user.business_details.address.postal_code = event.target.value;

    this.setState({ user: user });
  }

  handleUserCountryChange(country) {
    let user = this.state.user;

    user.country_code = country.value;

    this.setState({ user: user });
  }

  handleBusinessCountryChange(country) {
    let user = this.state.user;

    if (!user.business_details) {
      user.business_details = {
        address: {
        }
      };
    }

    user.business_details.address.country_code = country.value;

    this.setState({ user: user });
  }

  handleGenderChange(option) {
    let user = this.state.user;

    user.gender = option.value;

    this.setState({ user: user })
  }

  handleEmailChange(event) {
    let user = this.state.user;

    if (user) {
      user.email = event.target.value;

      this.setState({ user: user })
    }
  }

  handleBusinessNameChange(event) {
    let user = this.state.user;

    if (user && !user.business_details) {
      user.business_details = {
        address: {
        }
      }
    }

    user.business_details.name = event.target.value;

    this.setState({ user: user })
  }

  handleBusinessTaxIDChange(event) {
    let user = this.state.user;

    if (user && !user.business_details) {
      user.business_details = {
        address: {
        }
      }
    }

    user.business_details.tax_id = event.target.value;

    this.setState({ user: user })
  }

  renderAccountType() {
    if (this.state.hideAccountType) {
      return '';
    }

    const accountTypeOptions = [
      { label: 'Company', value: 'company' },
      { label: 'Individual', value: 'individual' }
    ];

    return (
      <div>
        <div className="panel-form row">
          <div className='col-xs-12 form-header'>
            <FormattedMessage id="user_profile_verified_info.account_type" />
          </div>
          <div className='col-xs-12 form-body'>
            <FormField type="select"
                       value={ this.state.user.account_type || 'individual' }
                       options={ accountTypeOptions }
                       handleChange={ this.handleAccountTypeChange  }
                       clearable={ false } />
          </div>
        </div>
      </div>
    )
  }

  renderUserForm() {
    return (
      <div>
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
                      handleUserCountryChange={ this.handleUserCountryChange }
                      handleEmailChange={ this.handleEmailChange }
                      placeholder={ this.props.intl.formatMessage({id: 'user_profile_verified_info.date_of_birth'}) } />
          </div>
        </div>
      </div>
    );
  }

  renderBusinessInformationForm() {
    if (this.state.user && this.state.user.account_type !== 'company') {
      return '';
    }

    return(
      <div className='panel-form row'>
        <div className='col-xs-12 form-header'>
          <FormattedMessage id="user_profile_verified_info.business_information" />
        </div>
        <div className='col-xs-12 form-body'>
          <BusinessInformationForm user={ this.state.user }
                                    handleNameChange={ this.handleBusinessNameChange }
                                    handleTaxIDChange={ this.handleBusinessTaxIDChange }
                                    handleCityChange={ this.handleBusinessCityChange }
                                    handleStateChange={ this.handleBusinessStateChange }
                                    handleAddressLine1Change={ this.handleBusinessAddressLine1Change }
                                    handleAddressLine2Change={ this.handleBusinessAddressLine2Change }
                                    handlePostCodeChange={ this.handleBusinessPostCodeChange }
                                    handleCountryChange={ this.handleBusinessCountryChange } />

        </div>
      </div>
    )
  }

  render() {
    if (this.state.loading) {
      return (<Loading fullWidthLoading={ true } />)
    }

    return (
      <div className="col-xs-12 no-side-padding">
        { this.renderAccountType() }
        { this.renderUserForm() }
        { this.renderBusinessInformationForm() }
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
