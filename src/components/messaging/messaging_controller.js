import React, { Component } from 'react';
import Conversation from './conversation';
import ConversationList from './conversation_list';
import ConversationListingsService from '../../shared/services/conversations/conversation_listings_service';
import ListingsSelector from '../listings/listings_selector';
import Loading from '../miscellaneous/loading';
import { Switch, Route } from "react-router-dom";

const LIMIT = 10;

export default class MessagingController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      listing: undefined,
      loading: false,
      totalPages: 1,
      currentPage: 1
    };

    this.handleVehicleSelect = this.handleVehicleSelect.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    this.refreshData(this.props);
  }

  componentWillReceiveProps(props) {
    this.refreshData(props);
  }

  refreshData(newProps) {
    if (!newProps || newProps.role === 'renter') {
      this.setState({ listings: [] });
    }
    else {
      this.setState({
        loading: true
      }, () => {
        ConversationListingsService.index({
          limit: LIMIT,
          offset: (this.state.currentPage - 1) * LIMIT
        }).then(response => {
          let data = response.data.data;
          let listings = this.state.listings || [];

          listings = listings.concat(data.listings);

          this.setState({
            listings: listings,
            totalPages: Math.ceil(data.count / LIMIT)
          }, () => {
          let newCurrentPage = this.state.currentPage + 1;

          if (this.state.currentPage > this.state.totalPages) {
            this.setState({
              currentPage: newCurrentPage,
              loading: false
            })
          }
          else {
            this.setState({
              currentPage: newCurrentPage
            }, this.refreshData)
          }
          })
        })
        .catch(error => this.setState({ loading: false }));
      })
    }
  }

  handleVehicleSelect(listing) {
    this.setState({ listing: listing })
  }

  render() {
    return (
      <Switch>
        <Route path="/messages/:id" render={(props) => {
          if (this.state.loading) {
            return <Loading />;
          }
          else {
            return (
              <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2'>
                <Conversation {...this.props} {...props} />
              </div>
            );
          }
        }} />
        <Route path="/messages" render={(props) => {
          let contents = <Loading />;

          if (!this.state.loading) {
            contents = <ConversationList listing={ this.state.listing } {...this.props} />
          }

          return (
            <div className='col-xs-12 no-side-padding'>
              <ListingsSelector listings={ this.state.listings }
                                role={ this.props.role }
                                loading={ this.state.loading }
                                currentListing={ this.state.listing }
                                handleVehicleSelect={ this.handleVehicleSelect }
                                changeCurrentUserRole={ this.props.changeCurrentUserRole } />
              <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2'>
                <div className="col-xs-12 no-side-padding">
                  { contents }
                </div>
              </div>
            </div>
          )
        }} />
      </Switch>
    );
  }
}
