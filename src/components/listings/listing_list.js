import React, { Component } from 'react'
import TopSearchBar from './top_search_bar'
import ListingItem from './listing_item'

class ListingList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      listings: []
    }
  }

  componentWillMount() {
    let listingsHandler = this.props.listingsHandler;

    if(listingsHandler){
      listingsHandler.listings(this.props.accessToken, (response) => {
        this.setState({ listings: response.data.data.listings });
      }, (error) => {
        alert(error);
      })
    }
  }

  renderListingList(){
    return this.state.listings.map((listing) => <ListingItem key={'listing_' + listing.id} listing={listing}/>);
  }

  render(){
    return (
      <div>
        <TopSearchBar />
        <div id="listingList">{ this.renderListingList() }</div>
      </div>
    )
  }
}

export default ListingList;
