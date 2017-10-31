import React, { Component } from 'react';
import Alert from 'react-s-alert';
import FormPanel from '../miscellaneous/forms/form_panel';
import MessageInput from './message_input';
import ConversationMessagesService from '../../shared/services/conversations/conversation_messages_service';
import Helpers from '../../miscellaneous/helpers';
import ReactDOM from 'react-dom';
import Message from './message';

export default class Conversation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      messages: [],
      totalMessages: 1,
      limit: 20,
      loading: false,
      initialLoad: true
    }

    this.refreshData = this.refreshData.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.scroll = this.scroll.bind(this);
  }

  componentWillMount() {
    this.refreshData();
  }

  reloadData() {
    this.setState({ loading: true }, () => {
      ConversationMessagesService.index(this.props.conversation.id, {
        limit: this.state.limit,
        offset: 0
      }).then(response => {
        let data = response.data.data;
        let messages = data.messages;

        this.setState({
          currentPage: 1,
          totalMessages: data.total_messages,
          messages: data.messages,
          loading: false
        }, () => {
          if (this.refs.messageList) {
            this.refs.messageList.scrollTop = this.refs.messageList.scrollHeight;
          }
        });
      }).catch(error => {
        this.setState({ loading: false });
      });
    });
  }

  refreshData() {
    let limit = this.state.limit;
    let offset = this.state.messages.length;
    let previousScrollHeight = 0;

    if (this.refs.messageList) {
      previousScrollHeight = this.refs.messageList.scrollHeight;
    }

    if (offset < this.state.totalMessages) {
      this.setState({ loading: true }, () => {
        ConversationMessagesService.index(this.props.conversation.id, {
          limit: limit,
          offset: offset
        }).then(response => {
          let data = response.data.data;
          let messages = this.state.messages.concat(data.messages);

          this.setState({
            currentPage: this.state.currentPage + 1,
            totalMessages: data.total_messages,
            messages: messages,
            loading: false
          }, () => {
            if (this.refs.messageList) {
              if (this.state.initialLoad) {
                this.refs.messageList.scrollTop = this.refs.messageList.scrollHeight;
                this.setState({ initialLoad: false });
              }
              else {
                this.refs.messageList.scrollTop = this.refs.messageList.scrollHeight - previousScrollHeight;
              }
            }
          });
        }).catch(error => {
          this.setState({ loading: false });
        });
      });
    }
  }

  scroll(event) {
    if (this.refs.messageList.scrollTop === 0 && !this.state.loading) {
      this.refreshData();
    }
  }

  render() {
    let conversation = this.props.conversation;
    let booking = conversation.booking;
    let listing = conversation.listing;
    let owner = listing.user;
    let renter = booking.renter;
    let viewer = this.props.role === 'renter' ? renter : owner;
    let otherParticpant = this.props.role === 'renter' ? owner : renter;

    return (
      <FormPanel title={ otherParticpant.name } className='conversation-thread'>
        <div className='message-list' onScroll={ this.scroll } ref='messageList'>
          {
            [...this.state.messages].reverse().map(message => { return <Message message={ message } viewer={ viewer } /> })
          }
        </div>
        <div id='bottomPlaceholder' ref='bottomPlaceholder' />
        <MessageInput conversation={ this.props.conversation } reloadData={ this.reloadData }/>
      </FormPanel>
    );
  }
}
