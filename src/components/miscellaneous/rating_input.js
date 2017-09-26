import React, {Component} from 'react'

class RatingInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRating: this.props.rating || 0,
      disabled: this.props.readonly || false
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

    let className = 'rating-input';

    if(this.state.disabled) {
      className += ' disabled';
    }

    return (
      <div className={className}>
        {
          Array.from(new Array(ratingLength), (val, index) => index + 1).map((index) => {
            return (
              <div key={inputId + index}>
                <input type="checkbox" id={inputId + index} name={inputName + '_' + inputNameSufix} disabled={this.state.disabled} value={index} defaultChecked={index <= this.state.currentRating} onChange={this.handleOnChange} />
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
