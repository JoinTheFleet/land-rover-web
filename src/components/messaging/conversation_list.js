import React, { Component } from 'react';

import ConversationService from '../../shared/services/conversations/conversation_service';
import ListingConversationsService from '../../shared/services/listings/listing_conversations_service';

import RenterConversationDetails from './renter_conversation_details';
import OwnerConversationDetails from './owner_conversation_details';

import Pageable from '../miscellaneous/pageable';
import Placeholder from '../miscellaneous/placeholder';
import Loading from '../miscellaneous/loading';

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

  componentDidMount() {
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
    if (this.state.loading) {
      return <Loading/>;
    }
    else if (this.state.conversations.length === 0) {
      if (this.props.role === 'owner') {
        return (<Placeholder contentType='owner_messages' />);
      }
      else {
        let placeholderType = 'renter_messages';

        if (this.props.role === 'owner') {
          placeholderType = 'owner_messages';
        }

        return (<Placeholder contentType={ placeholderType } />);
      }
    }
    else {
      return (
        <Pageable totalPages={ this.state.totalPages } currentPage={ this.state.currentPage + 1 } handlePageChange={ this.handlePageChange } loading={ this.state.loading }>
          <div className='conversation-list col-xs-12 no-side-padding'>
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
}
