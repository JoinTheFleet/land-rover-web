import React, {Component} from 'react'

class RatingInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRating: this.props.rating || 0
    }
  }

  render() {
    let ratingLength = this.props.length || 5;
    let inputName = this.props.inputName || 'rating';
    let inputId = this.props.inputId || 'star';

    return (
      <div className="rating-input">
        {
          Array.from(new Array(ratingLength), (val, index) => index + 1).map((index) => {
            return (
              <div>
                <input type="radio" id={inputId + index} name={inputName} value={index} checked={index <= this.state.currentRating} />
                <label for={inputId + index} ></label>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default RatingInput;
