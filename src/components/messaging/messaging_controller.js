import React, { Component } from 'react';
import Conversation from './conversation';
import ConversationList from './conversation_list';
import ConversationListingsService from '../../shared/services/conversations/conversation_listings_service';
import ListingsSelector from '../listings/listings_selector';
import Loading from '../miscellaneous/loading';

export default class MessagingController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      listing: undefined,
      loading: false,
      selectedConversation: undefined
    };

    this.selectConversation = this.selectConversation.bind(this);
    this.handleVehicleSelect = this.handleVehicleSelect.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentWillMount() {
    this.refreshData();
  }

  componentWillReceiveProps(props) {
    this.refreshData(props);
  }

  refreshData(newProps) {
    if (!newProps || newProps.role === 'renter') {
      this.setState({ listings: [] })
    }
    else {
      this.setState({
        loading: true
      }, () => {
        ConversationListingsService.index()
                                   .then(response => {
                                     this.setState({
                                       listings: response.data.data.listings,
                                       loading: false
                                     })
                                   })
                                   .catch(error => this.setState({ loading: false }));
      })
    }
  }

  selectConversation(id) {
    this.setState({conversationID: id});
  }

  handleVehicleSelect(listing) {
    this.setState({ listing: listing })
  }

  render() {
    let conversationView = '';
    let listingsSelector = '';

    if (this.props.role === 'owner' && this.state.listings.length > 0) {
      listingsSelector = (
        <ListingsSelector listings={ this.state.listings }
                          currentListing={ this.state.listing }
                          handleVehicleSelect={ this.handleVehicleSelect } />
      )
    }

    if (this.state.conversationID) {
      conversationView = (<Conversation id={ this.state.conversationID } />);
    }
    else {
      conversationView = (<ConversationList selectConversation={ this.selectConversation } listing={ this.state.listing } {...this.props} />);
    }

    if (this.state.loading) {
      return <Loading />;
    }
    else {
      return (
        <div>
          { listingsSelector }
          <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 no-side-padding'>
            { conversationView }
          </div>
        </div>
      );
    }
  }
}
