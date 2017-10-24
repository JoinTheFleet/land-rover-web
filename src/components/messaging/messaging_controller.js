import React, { Component } from 'react';
import Conversation from './conversation';
import ConversationList from './conversation_list';
import ConversationListingsService from '../../shared/services/conversations/conversation_listings_service';

export default class MessagingController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: []
    };

    this.selectConversation = this.selectConversation.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.role !== this.props.role && props.role === 'owner') {
      ConversationListingsService.index()
                                 .then(response => {
                                   this.setState({ listings: response.data.data.listings })
                                 });
    }
    else {
      this.setState({ listings: [] });
    }
  }

  selectConversation(id) {
    this.setState({conversationID: id});
  }

  render() {
    let conversationView = '';
    if (this.state.conversationID) {
      conversationView = (<Conversation id={ this.state.conversationID } />);
    }
    else {
      conversationView = (<ConversationList selectConversation={ this.selectConversation } {...this.props} />);
    }

    return (
      <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 no-side-padding'>
        <div className='col-xs-12 col-sm-3'>
          { conversationView }
        </div>
      </div>
    );
  }
}
