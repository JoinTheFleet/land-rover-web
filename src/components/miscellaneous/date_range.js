import React, { Component } from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

export default class DateRange extends Component {
  render() {
    let startFormat = 'DD';
    let endFormat = 'DD/MM/YYYY';
    let start = this.props.start;
    let end = this.props.end;
    let range = end.format(endFormat);

    if (end.month() !== start.month() || end.year() !== end.year()) {
      startFormat += '/MM';
    }

    if (end.year() !== start.year()) {
      startFormat += '/YYYY';
    }

    if (start.day() !== end.day() || start.month() !== end.month() || start.year() !== end.year()) {
      range = `${start.format(startFormat)} - ${end.format(endFormat)}`;
    }

    return (
      <span>
        { range }
      </span>
    );
  }
}

DateRange.propTypes = {
  start: momentPropTypes.momentObj.isRequired,
  end: momentPropTypes.momentObj.isRequired
};
