import React, { Component } from 'react';
import FormField from '../miscellaneous/forms/form_field';

export default class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      messageAttachment: undefined
    }

    this.handleMessageInput = this.handleMessageInput.bind(this);
    this.handleMessageAttachment = this.handleMessageAttachment.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  handleMessageInput(event) {
    this.setState({ message: event.target.value });
  }

  handleMessageAttachment() {
  }

  submitMessage(event) {
    event.preventDefault();
    // TODO: Update the message thread above with the new message;
  }

  render() {
    return (
      <div id='message-input-row'>
        <form onSubmit={ this.submitMessage }>
          <div className='col-xs-10 col-sm-11 no-side-padding'>
            <FormField id='message-input' type='text' handleChange={ this.handleMessageInput } value={ this.state.message } />
          </div>
          <div className='col-xs-2 col-sm-1 no-side-padding'>
            Image Input
          </div>
        </form>
      </div>
    );
  }
}
