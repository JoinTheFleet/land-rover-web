import React, { Component } from 'react';
import Alert from 'react-s-alert';
import ConversationService from '../../shared/services/conversations/conversation_service';
import ListingConversationsService from '../../shared/services/listings/listing_conversations_service';

import RenterConversationDetails from './renter_conversation_details';

import Pageable from '../miscellaneous/pageable';

export default class ConversationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conversations: [],
      totalPages: 1,
      limit: 20,
      currentPage: 0
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.forceDataRefresh = this.forceDataRefresh.bind(this);
  }

  componentWillMount() {
    this.forceDataRefresh();
  }

  componentWillReceiveProps(props) {
    let role = props ? props.role : this.props.role;
    let refreshNeeded = role !== this.props.role || !props || props.listing !== this.props.listing;

    if (refreshNeeded) {
      this.setState({
        conversations: [],
        totalPages: 1,
        currentPage: 20
      }, () => {
        this.forceDataRefresh(props);
      });
    }
    else {
      this.setState({ conversations: [] });
    }
  }

  handlePageChange(pageNumber) {
    this.setState({ currentPage: pageNumber - 1 }, this.forceDataRefresh);
  }

  forceDataRefresh(newProps) {
    let role = newProps ? newProps.role : this.props.role;
    let listingChanged = newProps && newProps.listing && (!this.props.listing || (newProps.listing.id !== this.props.listing.id));

    if (role === 'renter') {
      ConversationService.index({ offset: this.state.currentPage * this.state.limit, limit: this.state.limit })
                         .then(response => {
                           let data = response.data.data;
                           this.setState({
                             conversations: data.conversations,
                             totalPages: data.total_pages
                           });
                         })
    }
    else if (listingChanged) {
      ListingConversationsService.index(newProps.listing.id, { offset: this.state.currentPage * this.state.limit, limit: this.state.limit })
                                 .then(response => {
                                   let data = response.data.data;
                                   this.setState({
                                     conversations: data.conversations,
                                     totalPages: data.total_pages
                                   });
                                 });
    }
    else {
      this.setState({ conversations: [] });
    }
  }

  render() {
    return (
      <Pageable totalPages={ this.state.totalPages } currentPage={ this.state.currentPage } handlePageChange={ this.handlePageChange }>
        <div>
        {
          this.state.conversations.map((conversation) => {
            return <RenterConversationDetails key={ `conversation_${conversation.id}` } conversation={ conversation } />
          })
        }
        </div>
      </Pageable>
    );
  }
}
