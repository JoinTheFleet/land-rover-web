import React, { Component } from 'react';

import FormPanel from '../miscellaneous/forms/form_panel';
import MessageInput from './message_input';
import ConversationService from '../../shared/services/conversations/conversation_service';
import ConversationMessagesService from '../../shared/services/conversations/conversation_messages_service';

import Loading from '../miscellaneous/loading';
import Message from './message';
import LocalizationService from '../../shared/libraries/localization_service';

import { Link } from 'react-router-dom';

const REFRESH_PERIOD = 5000;

export default class Conversation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      messages: [],
      totalMessages: 1,
      limit: 20,
      loading: false,
      initialLoad: true,
      refreshInterval: undefined,
      mostRecentMessageID: undefined,
      conversation: undefined
    };

    this.refreshData = this.refreshData.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.scroll = this.scroll.bind(this);
  }

  componentWillMount() {
    let location = this.props.location;

    if (location && location.state && location.state.conversation) {
      this.setState({ conversation: location.state.conversation }, this.refreshData);
    }
    else {
      ConversationService.show(this.props.match.params.id)
                         .then(response => {
                           this.setState({ conversation: response.data.data.conversation }, this.refreshData);
                         });
    }
  }

  componentDidMount() {
    this.setupPeriodicRefresh();
  }

  componentWillUnmount() {
    if (this.state.refreshInterval) {
      clearInterval(this.state.refreshInterval);
    }
  }

  setupPeriodicRefresh() {
    let interval = setInterval(() => {
      let mostRecentMessageID = this.state.mostRecentMessageID;
      let conversation = this.state.conversation;

      if (conversation && mostRecentMessageID && !this.state.loading) {
        ConversationService.latestMessageID(conversation.id)
                           .then(response => {
                             let messageID = response.data.data.message_id;
                             if (mostRecentMessageID !== messageID) {
                               this.reloadData();
                             }
                           });
      }
    }, REFRESH_PERIOD);
    this.setState({ refreshInterval: interval })
  }

  reloadData() {
    let conversation = this.state.conversation;

    if (conversation) {
      this.setState({ loading: true }, () => {
        ConversationMessagesService.index(conversation.id, {
          limit: this.state.limit,
          offset: 0
        }).then(response => {
          let data = response.data.data;

          this.setState({
            currentPage: 1,
            totalMessages: data.total_messages,
            messages: data.messages,
            loading: false
          }, () => {
            let messages = this.state.messages;

            if (messages && messages.length > 0) {
              this.setState({ mostRecentMessageID: messages[0].id })
            }

            if (this.refs.messageList) {
              this.refs.messageList.scrollTop = this.refs.messageList.scrollHeight;
            }
          });
        }).catch(error => {
          this.setState({ loading: false });
        });
      });
    }
  }

  refreshData() {
    let limit = this.state.limit;
    let offset = this.state.messages.length;
    let conversation = this.state.conversation;
    let previousScrollHeight = 0;

    if (this.refs.messageList) {
      previousScrollHeight = this.refs.messageList.scrollHeight;
    }

    if (conversation && offset < this.state.totalMessages) {
      this.setState({ loading: true }, () => {
        ConversationMessagesService.index(conversation.id, {
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
            let messages = this.state.messages;

            if (messages && messages.length > 0) {
              this.setState({ mostRecentMessageID: messages[0].id })
            }
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
    let conversation = this.state.conversation;
    if (conversation) {
      let booking = conversation.booking;
      let listing = conversation.listing;
      let owner = listing.user;
      let vendorLocation = owner.vendor_location;
      let renter = booking.renter;
      let viewer = this.props.role === 'renter' ? renter : owner;
      let otherParticpant = this.props.role === 'renter' ? owner : renter;

      let messageLoader = '';

      let name = otherParticpant.first_name;

      if (vendorLocation && this.props.role === 'renter') {
        name = vendorLocation.name;
      }

      if (this.state.loading) {
        messageLoader = <Loading hiddenText={ true } fixedSize={ '30px' } />;
      }

      let button = (
        <Link to={{
          pathname: `/bookings/${booking.id}`,
          state: {
            booking: booking
          }
        }}
        className='white-text'>
          { LocalizationService.formatMessage('bookings.view') }
        </Link>
      )

      return (
        <FormPanel title={ name } button={ button } className='conversation-thread'>
          <div className='message-list' onScroll={ this.scroll } ref='messageList'>
            { messageLoader }
            {
              [...this.state.messages].reverse().map(message => { return <Message message={ message } viewer={ viewer } /> })
            }
          </div>
          <div id='bottomPlaceholder' ref='bottomPlaceholder' />
          <MessageInput conversation={ this.state.conversation } reloadData={ this.reloadData }/>
        </FormPanel>
      );
    }
    else {
      return <Loading />;
    }
  }
}
