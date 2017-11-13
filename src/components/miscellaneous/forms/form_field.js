import React, { Component } from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import Select, { AsyncCreatable, Creatable } from 'react-select';
import Button from '../button';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import { ReactDatez } from 'react-datez';
import { TimePicker } from 'antd';
import { countries } from '../countries';
import countryCodes from 'country-calling-codes';

import LocalizationService from '../../../shared/libraries/localization_service';

const DATEPICKER_DEFAULT_DAY_SIZE = 40;
const COUNTRIES = countries.map(function(country) {
  return {
    value: country['alpha-2'],
    label: country['name']
  };
});

const EU_COUNTRIES = countries
  .filter(function(country) {
    return country['region'] && country['region'].toLowerCase().includes('europe');
  })
  .map(function(country) {
    return {
      value: country['alpha-2'],
      label: country['name']
    };
  });

const COUNTRY_CODES =
  countryCodes
    .filter(function(country) {
      return !country.value.includes("undefined");
    }).map(function(country) {
      return {
        value: country.value.match(/(\d+)/)[0],
        label: country.label
      };
   });

export default class FormField extends Component {
  render() {
    let renderable = '';

    if (this.props.type === 'textarea') {
      renderable = (
        <textarea id={ this.props.id }
                  disabled={ this.props.disabled }
                  value={ this.props.value || '' }
                  placeholder={ this.props.placeholder }
                  onChange={ this.props.handleChange }
                  className='col-xs-12' />
      );
    }
    else if (this.props.type === 'button') {
      renderable = (
        <Button onClick={ this.props.handleChange }
                className={ this.props.className }>
          { this.props.value }
        </Button>
      )
    }
    else if (this.props.type === 'singledate') {
      renderable = (
        <SingleDatePicker
          date={ this.props.value }
          onDateChange={ this.props.handleChange }
          focused={ this.props.focused }
          onFocusChange={ this.props.handleFocusChange }
          showClearDate={ false }
          withPortal={ false }
          withFullScreenPortal={ false }
          initialVisibleMonth={ null }
          numberOfMonths={ 1 }
          keepOpenOnDateSelect={ false }
          renderCalendarInfo={ false }
          hideKeyboardShortcutsPanel={ true }
        />
      )
    }
    else if (this.props.type === 'daterange') {
      let showClearDates = typeof this.props.showClearDates === 'undefined' ? true : this.props.showClearDates;

      renderable = (
        <DateRangePicker
          startDate={ this.props.startDate }
          endDate={ this.props.endDate }
          daySize={ this.props.daySize || DATEPICKER_DEFAULT_DAY_SIZE }
          onDatesChange={ this.props.handleChange }
          focusedInput={ this.props.focusedInput || this.props.focused }
          onFocusChange={ this.props.handleFocusChange }
          withPortal={ false }
          withFullScreenPortal={ false }
          initialVisibleMonth={ null }
          numberOfMonths={ this.props.numberOfMonths || 2 }
          minimumNights={ typeof this.props.minimumNights !== undefined ? this.props.minimumNights : 1 }
          keepOpenOnDateSelect={ false }
          showDefaultInputIcon={ false }
          showClearDates={ showClearDates }
          reopenPickerOnClearDates={ false }
          renderCalendarInfo={ () => { return false } }
          hideKeyboardShortcutsPanel={ true }
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
          minimumNights={ typeof this.props.minimumNights !== undefined ? this.props.minimumNights : 1 }
          renderCalendarInfo={ () => { return false } }
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
          value={ value }
          handleChange={ this.props.handleChange }
          highlightWeekends={ true }
          yearJump={ this.props.yearJump || true }
          allowPast={ this.props.allowPast || true }
          allowFuture={ this.props.allowFuture || true }
          startDate={ startDate }
          endDate={ endDate }
          position={ this.props.position || 'left' }
          placeholder={ this.props.placeholder}
        />
      )
    }
    else if (this.props.type === 'timepicker') {
      renderable = (
        <TimePicker onChange={ this.props.handleChange }
                    defaultValue={ this.props.value || moment('00:00', this.props.format || 'HH:mm') }
                    disabled={ this.props.disabled }
                    format={ this.props.format || 'HH:mm' } />
      )
    }
    else if (this.props.type === 'select') {
      renderable = (
        <Select value={ this.props.value }
                options={ this.props.options }
                disabled={ this.props.disabled }
                onChange={ this.props.handleChange }
                className={ this.props.className }
                clearable={ this.props.clearable } />
        );
    }
    else if (this.props.type === 'select-create') {
      renderable = (
        <Creatable value={ this.props.value }
                   options={ this.props.options }
                   disabled={ this.props.disabled }
                   onChange={ this.props.handleChange }
                   className={ this.props.className } 
                   clearable={ this.props.clearable }
                   onNewOptionClick={ this.props.handleNewOption}
                   promptTextCreator={ this.props.promptTextCreator } />
      );
    }
    else if (this.props.type === 'select-create-async') {
      renderable = (
        <AsyncCreatable value={ this.props.value }
                        disabled={ this.props.disabled }
                        onChange={ this.props.handleChange }
                        loadOptions={ this.props.loadOptions }
                        isLoading={ this.props.loading }
                        className={ this.props.className } 
                        clearable={ this.props.clearable } 
                        promptTextCreator={ this.props.promptTextCreator } />
      );
    }
    else if (this.props.type === 'country') {
      renderable = (
        <Select value={ this.props.value }
                options={ COUNTRIES }
                disabled={ this.props.disabled }
                onChange={ this.props.handleChange }
                className={ this.props.className }
                clearable={ this.props.clearable } />
        );
    }
    else if (this.props.type === 'eu-country') {
      renderable = (
        <Select value={ this.props.value }
                options={ EU_COUNTRIES }
                disabled={ this.props.disabled }
                onChange={ this.props.handleChange }
                className={ this.props.className }
                clearable={ this.props.clearable } />
        );
    }
    else if (this.props.type === 'country-code') {
      renderable = (
        <Select value={ this.props.value }
                options={ COUNTRY_CODES }
                disabled={ this.props.disabled }
                onChange={ this.props.handleChange }
                className={ this.props.className }
                clearable={ this.props.clearable } />
        );
    }
    else if (this.props.type === 'file' && this.props.hiddenInput) {
      renderable = (
        <div className="fleet-file-select col-xs-12 no-side-padding">
          <input type="file"
                 className="hide"
                 id={ this.props.id }
                 disabled={ this.props.disabled }
                 onChange={ this.props.handleChange } />

          <div className="fleet-tile-select-input text-left col-xs-12 no-side-padding">
            <Button className="white black-text"
                    onClick={ () => { document.getElementById(this.props.id).click(); } }>
              { LocalizationService.formatMessage('application.choose_file') }
            </Button>

            <span> { this.props.value } </span>
          </div>
        </div>
      )
    }
    else if (this.props.type === 'checkbox') {
      let labels = (
        <div className='col-xs-10'>
          { this.props.placeholder }
        </div>
      )

      if (this.props.label) {
        labels = (
          <div className='col-xs-10'>
            { this.props.placeholder }
            <br />
            { this.props.label }
          </div>
        )
      }

      renderable = (
        <div className='col-xs-12 no-side-padding form--checkbox-row fleet-checkbox'>
          { labels }

          <input type="checkbox"
                 id={ this.props.id }
                 value={ this.props.value }
                 checked={ this.props.value }
                 onChange={ this.props.handleChange }
                 disabled={ this.props.disabled }
                 className={ `pull-right ${this.props.className || ''}`} />
          <label htmlFor={ this.props.id }>{ ' ' }</label>
        </div>
      )
    }
    else {
      renderable = (
        <input type={ this.props.type }
               id={ this.props.id }
               value={ this.props.value || '' }
               placeholder={ this.props.placeholder }
               onChange={ this.props.handleChange }
               onFocus={ this.props.handleFocusChange }
               disabled={ this.props.disabled }
               className={ typeof(this.props.className) === 'string' ? this.props.className : "col-xs-12" } />
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
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  focused: PropTypes.bool,
  focusedInput: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleFocusChange: PropTypes.func,
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj,
  options: PropTypes.array,
  className: PropTypes.string,
  hiddenInput: PropTypes.bool
}
