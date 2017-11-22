import React, { Component } from 'react';
import { TimePicker } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import ListingStep from './listing_step';
import ListingFormFieldGroup from '../listing_form_field_group';
import FormField from '../../../miscellaneous/forms/form_field';

import LocalizationService from '../../../../shared/libraries/localization_service';
import Helpers from '../../../../miscellaneous/helpers';

const format = 'HH:mm';

export default class ListingRules extends Component {

  constructor(props) {
    super(props);

    this.state = {
      listing: this.props.listing
    };

    this.validateFields = this.validateFields.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
    this.handleRulesInsertion = this.handleRulesInsertion.bind(this);
    this.handleAddPickupTimeSelected = this.handleAddPickupTimeSelected.bind(this);
  }


  getListingProperties() {
    let listing = this.state.listing;

    return {
      check_in_time: listing.check_in_time || 0,
      check_out_time: listing.check_out_time || 0,
      rules: this.state.listing.rules
    };
  }

  validateFields() {
    return this.state.listing.rules && this.state.listing.rules.length > 0;
  }

  handleRulesInsertion(rulesText) {
    this.setState({ listing: Helpers.extendObject(this.state.listing, { rules: [ { rule: rulesText } ] }) });
  }

  handleAddPickupTimeSelected(time, timeString) {
    this.setState({ listing: Helpers.extendObject(this.state.listing, { check_in_time: time.unix(), check_out_time: time.unix() }) });
  }

  render() {
    let listing = this.state.listing;

    return (
      <div className="listing-form-rules col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
        <ListingStep validateFields={ this.validateFields }
                     getListingProperties={ this.getListingProperties }
                     handleCompleteListing={ this.props.handleCompleteListing }
                     finalStep={ true }
                     listing={ Helpers.extendObject(this.props.listing, this.getListingProperties()) } >
          <ListingFormFieldGroup title={ LocalizationService.formatMessage('listings.rules.rules') }>
            <FormField id="listing_rules"
                       type="textarea"
                       placeholder={ LocalizationService.formatMessage('listings.rules.rules_eg') }
                       value={ listing.rules ? listing.rules[0].rule : '' }
                       handleChange={ (event) => { this.handleRulesInsertion(event.target.value) } } />

          </ListingFormFieldGroup>

          <ListingFormFieldGroup title={ LocalizationService.formatMessage('listings.rules.pick_up_time') }>
            <TimePicker onChange={ this.handleAddPickupTimeSelected }
                        defaultValue={ moment.unix(this.state.listing.check_in_time || 0).utc() }
                        format={ format } />

          </ListingFormFieldGroup>
        </ListingStep>
      </div>
    )
  }
}

ListingRules.propTypes = {
  handleCompleteListing: PropTypes.func.isRequired,
  listing: PropTypes.object
};
