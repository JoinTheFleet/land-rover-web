import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ListingItem from './listing_item'

import chevronLeft from '../../assets/images/chevron_left.png';
import chevronRight from '../../assets/images/chevron_right.png';

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
        <div id="listingList" className="col-xs-12">
          <div className="previous-listing-btn listing-nav-button">
            <img src={chevronLeft} alt="chevron_left" />
          </div>
          { this.renderListingList() }
          <div className="next-listing-btn listing-nav-button">
            <img src={chevronRight} alt="chevron_right" />
          </div>
        </div>
      </div>
    )
  }
}

ListingList.propTypes = {
  accessToken: PropTypes.string.isRequired,
  listingsHandler: PropTypes.func.isRequired
}
