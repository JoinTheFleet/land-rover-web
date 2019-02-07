import React, {Component} from 'react'
import PropTypes from 'prop-types';

export default class RatingInput extends Component {
  constructor(props) {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(event) {
    let element = event.target;

    if (element.checked) {
      this.setState({ currentRating: element.value });
    }

    if (this.props.handleOnChange) {
      this.props.handleOnChange(element.value);
    }
  }

  render() {
    let ratingLength = this.props.length || 5;
    let inputNameSufix = this.props.inputNameSufix || '';
    let inputName = this.props.inputName || 'rating';
    let inputId = this.props.inputId || 'star';

    let className = `${this.props.className} rating-input`;

    if (this.props.readonly) {
      className += ' disabled';
    }

    return (
      <div className={ className }>
        {
          Array.from(new Array(ratingLength), (val, index) => index + 1).map((index) => {
            return (
              <div key={inputId + index}>
                <input type="checkbox"
                       id={ inputId + index }
                       name={ inputName + '_' + inputNameSufix }
                       disabled={ this.props.readonly }
                       value={ index }
                       checked={ index <= (this.props.rating || 0) }
                       onChange={ this.handleOnChange } />
                <label htmlFor={inputId + index}></label>
              </div>
            )
          })
        }
        { this.props.children  }
      </div>
    )
  }
}

RatingInput.propTypes = {
  length: PropTypes.number,
  rating: PropTypes.number,
  readonly: PropTypes.bool,
  inputNameSufix: PropTypes.string,
  inputName: PropTypes.string,
  inputId: PropTypes.string,
  handleOnChange: PropTypes.func
}
