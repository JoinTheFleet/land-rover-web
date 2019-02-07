import React, { Component } from 'react';

export default class Card extends Component {
  render() {
    return (
      <div className={ `${this.props.className} card` }>
        <div className='image'>
          <img src={ this.props.img } alt={ this.props.alt } />
        </div>
        <div className='header'>
          { this.props.title }
        </div>
        <div className='text'>
          { this.props.text }
        </div>
      </div>
    );
  }
}
