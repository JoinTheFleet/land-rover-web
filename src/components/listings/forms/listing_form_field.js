import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

export default class ListingFormField extends Component {
  render() {
    return (
      <div className="listing-form-field col-xs-12 no-side-padding">
        <div className={ `listing-form-field-label text-right tertiary-text-color ${this.props.hideLabelOnMobile ? 'hidden-xs' : 'col-xs-4'} col-sm-2 no-side-padding` }>
          { this.props.label }
        </div>
        <div className={ `listing-form-field-input ${this.props.hideLabelOnMobile ? 'col-xs-12' : 'col-xs-8'} col-sm-10` }>
          { this.props.children }
        </div>
      </div>
    )
  }
}

ListingFormField.propTypes = {
  label: PropTypes.string,
  hideLabelOnMobile: PropTypes.bool
}
