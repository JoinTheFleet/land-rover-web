import React, { Component } from 'react';
import Alert from 'react-s-alert';
import ConversationService from '../../shared/services/conversations/conversation_service';
import ListingConversationsService from '../../shared/services/listings/listing_conversations_service';

export default class ConversationList extends Component {
  componentWillMount() {
    switch (this.props.role) {
      case 'renter':
          ConversationService.index()
                             .then(response => console.log(response))
                             .catch(error => console.log(error.response))
        break;
      default:

    }
  }

  render() {
    return (
      <div>
      Conversation List
      </div>
    );
  }
}
