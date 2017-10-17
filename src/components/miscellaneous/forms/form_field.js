import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import { ReactDatez } from 'react-datez';
import moment from 'moment';

export default class FormField extends Component {
  render() {
    let renderable = '';

    if (this.props.type === 'textarea') {
      renderable = (
        <textarea id={ this.props.id }
                  value={ this.props.value }
                  placeholder={ this.props.placeholder }
                  onChange={ this.props.handleChange }
                  className='col-xs-12' />
      );
    }
    else if (this.props.type === 'singledate') {
      renderable = (
        <SingleDatePicker
          date={this.props.value}
          onDateChange={this.props.handleChange}
          focused={this.props.focused}
          onFocusChange={this.props.handleFocusChange}
          showClearDate={false}
          withPortal={false}
          withFullScreenPortal={false}
          initialVisibleMonth={null}
          numberOfMonths={1}
          keepOpenOnDateSelect={false}
          renderCalendardInfo={false}
          hideKeyboardShortcutsPanel={true}
        />
      )
    }
    else if (this.props.type === 'singleyeardate') {
      renderable = (
        <ReactDatez
          value={this.props.value}
          handleChange={this.props.handleChange}
          highlightWeekends={true}
          yearJump={this.props.yearJump || true}
          allowPast={this.props.allowPast || true}
          allowFuture={this.props.allowFuture || true}
          startDate={this.props.startDate || this.props.value || moment()}
          endDate={this.props.endDate}
          position={this.props.position || 'left'}
          placeholder={this.props.placeholder}
        />
      )
    }
    else {
      renderable = (
        <input type={ this.props.type }
               id={ this.props.id }
               value={ this.props.value }
               placeholder={ this.props.placeholder }
               onChange={ this.props.handleChange }
               onFocusChange={ this.props.handleFocusChange }
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
  focused: PropTypes.book,
  handleChange: PropTypes.func.isRequired,
  handleFocusChange: PropTypes.func
}
