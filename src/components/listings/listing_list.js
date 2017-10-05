import React, { Component } from 'react';
import Anime from 'react-anime';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import SimpleListingItem from './simple_listing_item';
import ListingItem from './listing_item';

import ListingsService from '../../shared/services/listings_service'

import chevronLeft from '../../assets/images/chevron_left.png';
import chevronRight from '../../assets/images/chevron_right.png';

export default class ListingList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      listings: this.props.listings || [],
      currentPosition: 0
    };

    this.handleNavigationClick = this.handleNavigationClick.bind(this);
  }

  componentWillMount() {
    ListingsService.index()
                   .then((response) => {
                     this.setState({ listings: response.data.data.listings });
                   })
                   .catch((error) => {
                     alert(error); // TODO: Some sort of nice flash service.
                   });
  }

  handleNavigationClick(direction) {
    let itemsList = this.listingItem.getElementsByClassName('items-list')[0];
    let listingItems = itemsList.getElementsByClassName('listing-item');

    if(listingItems.length > 0){
      let listingItem = listingItems[0];
      let listingItemWidth = listingItem.offsetWidth;
      let updatedCurrentPosition = this.state.currentPosition;

      if(direction === 'next') {
        updatedCurrentPosition += listingItem.offsetWidth;
      }
      else {
        updatedCurrentPosition -= listingItem.offsetWidth;
      }

      if(updatedCurrentPosition > (itemsList.offsetWidth - listingItemWidth)) {
        updatedCurrentPosition = itemsList.offsetWidth - listingItemWidth;
      }
      else if(updatedCurrentPosition < 0) {
        updatedCurrentPosition = 0;
      }

      this.setState({currentPosition: updatedCurrentPosition});
    }
  }

  renderListingList(){
    let listings = this.state.listings;

    if(listings.length > 0){
      let listingItems = [];

      if(this.props.simpleListing) {
        listingItems = this.state.listings.map((listing) => (<SimpleListingItem key={'listing_' + listing.id} listing={listing}/>));
      }
      else {
        listingItems = this.state.listings.map((listing) => (<ListingItem key={'listing_' + listing.id} listing={listing}/>));
      }

      return listingItems;
    }
    else {
      return (<div className="no-listings-to-display-div title-font-size tertiary-text-color"><FormattedMessage id="listings.no_listings_to_display" /></div>);
    }
  }

  render(){
    return (
      <div>
        <div className="listing-list col-xs-12" ref={(div) => { this.listingItem = div; }}>
          <div className="previous-listing-btn listing-nav-button" onClick={() => { this.handleNavigationClick('prev') }}>
            <img src={chevronLeft} alt="chevron_left" />
          </div>
          <Anime easing="linear"
                 duration={500}
                 scrollLeft={this.state.currentPosition}>
            <div className="items-list">
              { this.renderListingList() }
            </div>
          </Anime>
          <div className="next-listing-btn listing-nav-button" onClick={() => { this.handleNavigationClick('next') }}>
            <img src={chevronRight} alt="chevron_right" />
          </div>
        </div>
      </div>
    )
  }
}

ListingList.propTypes = {
  accessToken: PropTypes.string,
  simpleListing: PropTypes.bool,
  listingsService: PropTypes.func
}
