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
        this.forceDataRefresh(this.state.currentPage, props);
      });
    }
    else {
      this.setState({ conversations: [] });
    }
  }

  handlePageChange(pageNumber) {
    this.forceDataRefresh(pageNumber - 1);
  }

  forceDataRefresh(pageNumber, newProps) {
    let role = newProps ? newProps.role : this.props.role;
    let listingChanged = newProps && newProps.listing && (!this.props.listing || (newProps.listing.id !== this.props.listing.id));

    this.setState({
      loading: true
    }, () => {
      if (role === 'renter') {
        ConversationService.index({ offset: pageNumber * this.state.limit, limit: this.state.limit })
                           .then(response => {
                             let data = response.data.data;
                             this.setState({
                               currentPage: pageNumber,
                               conversations: data.conversations,
                               totalPages: data.total_pages,
                               loading: false
                             });
                           })
      }
      else if (listingChanged) {
        ListingConversationsService.index(newProps.listing.id, { offset: pageNumber * this.state.limit, limit: this.state.limit })
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
