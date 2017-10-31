import React, { Component } from 'react';
import FormField from '../miscellaneous/forms/form_field';
import ConversationMessagesService from '../../shared/services/conversations/conversation_messages_service';
import addFileImage from '../../assets/images/add-file.png';
import S3Uploader from '../../shared/external/s3_uploader';

export default class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      attachmentURL: undefined,
      submitting: false
    }

    this.handleMessageInput = this.handleMessageInput.bind(this);
    this.handleMessageAttachment = this.handleMessageAttachment.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.buildImageAttachment = this.buildImageAttachment.bind(this);
  }

  handleMessageInput(event) {
    this.setState({ text: event.target.value });
  }

  buildImageAttachment() {
    return [{
      type: 'image',
      image: {
        image_url: this.state.attachmentURL
      }
    }];
  }

  handleMessageAttachment(event) {
    if (event && event.target && event.target.files) {
      let file = event.target.files[0];

      S3Uploader.upload(file, 'conversation_attachment_direct_upload')
        .then(response => {
          this.setState({attachmentURL: response.Location }, this.submitMessage);
        })
        .catch(error => {
          this.setState({attachmentURL: undefined});
        });
    }
  }

  submitMessage(event) {
    if (event) {
      event.preventDefault()
    }

    if (this.state.text.length > 0 || this.state.attachmentURL) {
      this.setState({
        submitting: true
      }, () => {
        if (this.state.text.length > 0 && !this.state.attachmentURL) {
          ConversationMessagesService.create(this.props.conversation.id, this.state.text)
                                     .then(() => {
                                       this.setState({
                                         text: '',
                                         submitting: false
                                       }, this.props.reloadData)
                                     })
                                     .catch(() => { this.setState({ submitting: false })});
        }
        else if (this.state.attachmentURL) {
          ConversationMessagesService.create(this.props.conversation.id, '', this.buildImageAttachment())
                                     .then(() => {
                                       this.setState({
                                         submitting: false,
                                         attachmentURL: undefined
                                       }, this.props.reloadData)
                                     })
                                     .catch(() => { this.setState({ submitting: false })});

        }
      })
    }
  }

  render() {
    return (
      <div id='message-input-row'>
        <form onSubmit={ this.submitMessage }>
          <input id='imageInput' type='file' onChange={ this.handleMessageAttachment } style={{ display: 'none'}} ref={(ref) => this.imageInput = ref} />
          <div className='col-xs-11 no-side-padding'>
            <FormField id='message-input' type='text' handleChange={ this.handleMessageInput } value={ this.state.text } disabled={ this.state.submitting } />
          </div>
          <div className='col-xs-1 no-side-padding' onClick={ (event) => this.imageInput.click() }>
            <i className='pull-right'><img src={addFileImage} alt="Add Image" /></i>
          </div>
        </form>
      </div>
    );
  }
}
