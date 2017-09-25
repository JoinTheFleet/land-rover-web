import React, { Component } from 'react'
import ListingList from '../listings/listing_list'
import ListingsHandler from '../../api_handlers/listings_handler'

class Homescreen extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        <ListingList accessToken={this.props.accessToken} listingsHandler={ListingsHandler} />
      </div>
    )
  }
}

export default Homescreen;
