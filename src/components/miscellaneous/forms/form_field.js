import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import { ReactDatez } from 'react-datez';
import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';

export default class FormField extends Component {
  render() {
    let renderable = '';

    if (this.props.type === 'textarea') {
      renderable = (
        <textarea id={ this.props.id }
                  value={ this.props.value || '' }
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
      let value = (this.props.value || moment()).format('YYYY-MM-DD');
      let startDate = this.props.startDate ? (this.props.startDate).format('YYYY-MM-DD') : undefined;
      let endDate = this.props.endDate ? (this.props.endDate).format('YYYY-MM-DD') : undefined;
      renderable = (
        <ReactDatez
          value={value}
          handleChange={this.props.handleChange}
          highlightWeekends={true}
          yearJump={this.props.yearJump || true}
          allowPast={this.props.allowPast || true}
          allowFuture={this.props.allowFuture || true}
          startDate={startDate}
          endDate={endDate}
          position={this.props.position || 'left'}
          placeholder={this.props.placeholder}
        />
      )
    }
    else {
      renderable = (
        <input type={ this.props.type }
               id={ this.props.id }
               value={ this.props.value || '' }
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
  placeholder: PropTypes.string,
  focused: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleFocusChange: PropTypes.func,
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj
}
