import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

export default class ListingFormFieldGroup extends Component {

  render() {
    return (
      <div className="listing-form-field-group col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
        <div className="listing-form-field-group-header secondary-color text-secondary-font-weight ls-dot-five white-text fs-16">
          { this.props.title }
        </div>
        <div className="listing-form-field-group-fields">
          { this.props.children }
        </div>
      </div>
    )
  }
}

ListingFormFieldGroup.propTypes = {
  title: PropTypes.string
}
