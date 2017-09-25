import React, {Component} from 'react'

class RatingInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRating: this.props.rating || 0
    }

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(event){
    let element = event.target;

    if(element.checked) {
      this.setState({currentRating: element.value});
    }
  }

  render() {
    let ratingLength = this.props.length || 5;
    let inputNameSufix = this.props.inputNameSufix || '';
    let inputName = this.props.inputName || 'rating';
    let inputId = this.props.inputId || 'star';

    return (
      <div className="rating-input">
        {
          Array.from(new Array(ratingLength), (val, index) => index + 1).map((index) => {
            return (
              <div key={inputId + index}>
                <input type="radio" id={inputId + index} name={inputName + '_' + inputNameSufix} value={index} defaultChecked={index <= this.state.currentRating} onChange={this.handleOnChange} />
                <label htmlFor={inputId + index}></label>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default RatingInput;
