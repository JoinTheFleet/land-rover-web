import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

export default class FormField extends Component {
  render() {
    return (
      <div className="form-field">
        <input type={ this.props.type }
               id={ this.props.id }
               value={ this.props.value }
               placeholder={ this.props.placeholder }
               className="col-xs-12" />
      </div>
    )
  }
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string
}
