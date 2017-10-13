import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker, SingleDatePicker } from 'react-dates';

export default class FormField extends Component {
  render() {
    let renderable = '';

    if (this.props.type === 'textarea') {
      renderable = (
        <textarea id={ this.props.id }
                  defaultValue={ this.props.value }
                  placeholder={ this.props.placeholder }
                  onChange={ this.props.handleChange }
                  className='col-xs-12' />
      );
    }
    else if (this.props.type === 'singledate') {
      renderable = (
        <SingleDatePicker
          date={null} // momentPropTypes.momentObj or null
          onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
          focused={true} // PropTypes.bool
          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
        />
      )
    }
    else if (this.props.type === 'daterange') {
      renderable = (
        <DateRangePicker
          onDatesChange={this.props.handleChange} // PropTypes.func.isRequired,
          onFocusChange={this.props.handleFocusChange} // PropTypes.func.isRequired,
        />
      )
    }
    else {
      renderable = (
        <input type={ this.props.type }
               id={ this.props.id }
               defaultValue={ this.props.value }
               placeholder={ this.props.placeholder }
               onChange={ this.props.handleChange }
               className="col-xs-12" />
      );
    }

    return renderable;
  }
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleFocusChange: PropTypes.func
}
