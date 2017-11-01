import React, { Component } from 'react';

import ConversationService from '../../shared/services/conversations/conversation_service';
import ListingConversationsService from '../../shared/services/listings/listing_conversations_service';

import RenterConversationDetails from './renter_conversation_details';
import OwnerConversationDetails from './owner_conversation_details';

import Pageable from '../miscellaneous/pageable';

export default class ConversationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conversations: [],
      totalPages: 1,
      limit: 20,
      currentPage: 0,
      loading: false
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.forceDataRefresh = this.forceDataRefresh.bind(this);
  }

  componentWillMount() {
    this.forceDataRefresh(this.state.currentPage);
  }

  componentWillReceiveProps(props) {
    let role = props ? props.role : this.props.role;
    let refreshNeeded = role !== this.props.role || !props || props.listing !== this.props.listing;

    if (refreshNeeded) {
      this.setState({
        conversations: [],
        totalPages: 1,
        currentPage: 0
      }, () => {
        this.forceDataRefresh(this.state.currentPage);
      });
    }
    else {
      this.setState({ conversations: [] });
    }
  }

  handlePageChange(pageNumber) {
    this.forceDataRefresh(pageNumber - 1);
  }

  forceDataRefresh(pageNumber) {
    this.setState({
      loading: true
    }, () => {
      if (this.props.role === 'renter') {
        ConversationService.index({ offset: pageNumber * this.state.limit, limit: this.state.limit })
                           .then(response => {
                             let data = response.data.data;
                             this.setState({
                               currentPage: pageNumber,
                               conversations: data.conversations,
                               totalPages: data.total_pages,
                               loading: false
                             });
                           });
      }
      else if (this.props.listing) {
        ListingConversationsService.index(this.props.listing.id, { offset: pageNumber * this.state.limit, limit: this.state.limit })
                                   .then(response => {
                                     let data = response.data.data;
                                     this.setState({
                                       currentPage: pageNumber,
                                       conversations: data.conversations,
                                       totalPages: data.total_pages,
                                       loading: false
                                     });
                                   });
      }
      else {
        this.setState({
          conversations: [],
          loading: false
        });
      }
    })
  }

  render() {
    return (
      <Pageable totalPages={ this.state.totalPages } currentPage={ this.state.currentPage + 1 } handlePageChange={ this.handlePageChange } loading={ this.state.loading }>
        <div className='col-xs-12'>
          {
            this.state.conversations.map((conversation) => {
              if (this.props.role === 'renter') {
                return <RenterConversationDetails key={ `conversation_${conversation.id}` } conversation={ conversation } />;
              }
              else {
                return <OwnerConversationDetails key={ `conversation_${conversation.id}` } conversation={ conversation } />;
              }
            })
          }
        </div>
      </Pageable>
    );
  }
}
