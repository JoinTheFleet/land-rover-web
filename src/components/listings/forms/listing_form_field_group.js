import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

export default class ListingFormFieldGroup extends Component {

  render() {
    let fieldsDescriptionDiv = '';

    if (this.props.fieldsDescription) {
      fieldsDescriptionDiv = (
        <div className="listing-form-field-group-description text-secondary-font-weight tertiary-text-color col-xs-12 col-sm-8 col-sm-offset-4 col-md-9 col-md-offset-3 col-lg-10 col-lg-offset-2">
          { this.props.fieldsDescription }
        </div>
      )
    }

    return (
      <div className="listing-form-field-group col-xs-12 no-side-padding">
        <div className="listing-form-field-group-header secondary-color text-secondary-font-weight ls-dot-five white-text fs-16 col-xs-12">
          { this.props.title }
        </div>
        <div className="listing-form-field-group-fields col-xs-12">
          { fieldsDescriptionDiv }
          { this.props.children }
        </div>
      </div>
    )
  }
}

ListingFormFieldGroup.propTypes = {
  title: PropTypes.string,
  fieldsDescription: PropTypes.string
}
