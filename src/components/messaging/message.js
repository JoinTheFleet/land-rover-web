import React, { Component } from 'react';

export default class Message extends Component {
  render() {
    return (
      <div key={ `message_${this.props.message.id}`}>{ this.props.message.text }</div>
    );
  }
}
