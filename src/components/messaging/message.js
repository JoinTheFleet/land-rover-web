import React, { Component } from 'react';
import { MessageBox } from 'react-chat-elements'

export default class Message extends Component {
  render() {
    let message = this.props.message;
    let viewer = this.props.viewer;

    let type = 'text';
    let position = 'right';
    let data = {};
    let url = undefined;

    if (viewer.id !== message.owner.id) {
      position = 'left';
    }

    if (message.attachments && message.attachments.length > 0) {
      let attachment = message.attachments[0].attachment;

      if (attachment.type === 'image') {
        type = 'photo';
        data = {
          uri: attachment.images.large_url,
          status: {
            download: true
          }
        };
      }
      else if (attachment.type === 'location') {
        type = 'location';
        data = {
          latitude: attachment.coordinates.latitude,
          longitude: attachment.coordinates.longitude
        };
      }
    }

    return (
      <MessageBox
        apiKey={ process.env.REACT_APP_GOOGLE_MAPS_API_KEY }
        position={ position }
        notch={ false }
        type={ type }
        data={ data }
        url={ url }
        text={ message.text }
        zoom={10}
        markerColor={ '0x23a9f6' }
        date={ message.created_at * 1000 } />
    );
  }
}
