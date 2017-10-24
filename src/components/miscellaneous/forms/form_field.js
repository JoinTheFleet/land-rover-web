import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
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
    else if (this.props.type === 'daterange') {
      let showClearDates = typeof this.props.showClearDates === 'undefined' ? true : this.props.showClearDates;

      renderable = (
        <DateRangePicker
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          onDatesChange={this.props.handleChange}
          focusedInput={this.props.focusedInput}
          onFocusChange={this.props.handleFocusChange}
          withPortal={false}
          withFullScreenPortal={false}
          initialVisibleMonth={null}
          numberOfMonths={2}
          minimumNights={1}
          keepOpenOnDateSelect={false}
          showDefaultInputIcon={false}
          reopenPickerOnClearDate={false}
          showClearDates={showClearDates}
          hideKeyboardShortcutsPanel={true}
          displayFormat={ 'DD/MM/YYYY' }
          disabled={this.props.disabled}
        />
      )
    }
    else if (this.props.type === 'calendar') {
      renderable = (
        <DayPickerRangeController
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          focusedInput={this.props.focusedInput}
          onDatesChange={({ startDate, endDate }) =>  this.props.handleChange(startDate, endDate)}
          onFocusChange={this.props.handleFocusChange}
          onPrevMonthClick={this.props.handlePrevMonthClick}
          onNextMonthClick={this.props.handleNextMonthClick}
          renderDay={this.props.renderDay}
          isDayBlocked={this.props.isDayBlocked}
          withPortal={false}
          initialVisibleMonth={null}
          numberOfMonths={2}
          minimumNights={1}
          renderCalendardInfo={false}
          hideKeyboardShortcutsPanel={true}
          ref={this.props.fieldRef}
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
               onFocus={ this.props.handleFocusChange }
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
  focusedInput: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleFocusChange: PropTypes.func,
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj,
  options: PropTypes.array,
  className: PropTypes.string
}
