import React, { Component } from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';

class BookingForm extends Component {
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

BookingForm.propTypes = {
  listing: PropTypes.object,
  checkInDate: momentPropTypes.momentObj,
  checkOutDate: momentPropTypes.momentObj
};

export default BookingForm;
