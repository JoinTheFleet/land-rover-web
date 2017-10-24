import React, { Component } from 'react';
import Alert from 'react-s-alert';
import ConversationService from '../../shared/services/conversations/conversation_service';
import ListingConversationsService from '../../shared/services/listings/listing_conversations_service';

export default class ConversationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conversations: []
    };

    this.refreshData = this.refreshData.bind(this);
  }

  componentWillMount() {
    this.refreshData();
  }

  componentWillReceiveProps(props) {
    this.refreshData(props);
  }

  refreshData(newProps) {
    let role = newProps ? newProps.role : this.props.role;
    let refreshNeeded = role !== this.props.role || !newProps || newProps.listing !== this.props.listing;
    let listingChanged = newProps && newProps.listing && (!this.props.listing || (newProps.listing.id !== this.props.listing.id));

    if (refreshNeeded) {
      if (role === 'renter') {
        ConversationService.index()
                           .then(response => this.setState({ conversations: response.data.data.conversations }))
      }
      else if (listingChanged) {
        ListingConversationsService.index(newProps.listing.id)
                                   .then(response => this.setState({ conversations: response.data.data.conversations }));
      }
      else {
        this.setState({ conversations: [] });
      }
    }
    else {
      this.setState({ conversations: [] });
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
