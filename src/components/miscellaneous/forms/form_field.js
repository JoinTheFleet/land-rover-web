import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import { ReactDatez } from 'react-datez';
import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';
import Select from 'react-select';
import { countries } from '../countries';

const COUNTRIES = countries.map(function(country) {
  return {
    value: country['alpha-2'],
    label: country['name']
  };
});

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
    else if (this.props.type === 'select') {
      renderable = (
        <Select value={this.props.value}
                options={this.props.options}
                onChange={this.props.handleChange}
                className={this.props.className} />
        );
    }
    else if (this.props.type === 'country') {
      renderable = (
        <Select value={this.props.value}
                options={COUNTRIES}
                onChange={this.props.handleChange}
                className={this.props.className} />
        );
    }
    else {
      renderable = (
        <input type={ this.props.type }
               id={ this.props.id }
               value={ this.props.value || '' }
               placeholder={ this.props.placeholder }
               onChange={ this.props.handleChange }
               className={ typeof(this.props.className) === 'string' ? this.props.className : "col-xs-12" }/>
      );
    }

    if (this.props.children) {
      return (
        <div className='pull-left' >
          { renderable }
          { this.props.children }
        </div>
      )
    }
    else {
      return renderable;
    }
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
  endDate: momentPropTypes.momentObj,
  options: PropTypes.array,
  className: PropTypes.string
}
