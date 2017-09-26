import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ListingItem from './listing_item'

export default class ListingList extends Component {

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
      });
    }
  }

  renderListingList(){
    return this.state.listings.map((listing) => <ListingItem key={'listing_' + listing.id} listing={listing}/>);
  }

  render(){
    return (
      <div>
        <div id="listingList">{ this.renderListingList() }</div>
      </div>
    )
  }
}

ListingList.propTypes = {
  accessToken: PropTypes.string.isRequired,
  listingsHandler: PropTypes.func.isRequired
}
