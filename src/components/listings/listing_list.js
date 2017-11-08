import React, { Component } from 'react';

import { FormattedMessage } from 'react-intl';

import Anime from 'react-anime';
import PropTypes from 'prop-types';
import SimpleListingItem from './simple_listing_item';
import ListingItem from './listing_item';

import chevronLeft from '../../assets/images/chevron_left.png';
import chevronRight from '../../assets/images/chevron_right.png';

export default class ListingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPosition: 0
    };

    this.handleNavigationClick = this.handleNavigationClick.bind(this);
  }

  handleNavigationClick(direction) {
    let itemsList = this.listingItem.getElementsByClassName('items-list')[0];
    let listingItems = itemsList.getElementsByClassName('listing-item');

    if (listingItems.length > 0) {
      let updatedCurrentPosition = this.state.currentPosition;
      let directionCoeficient = direction === 'next' ? 1 : -1;

      updatedCurrentPosition += itemsList.offsetWidth * directionCoeficient;

      if (updatedCurrentPosition > (itemsList.scrollWidth - itemsList.offsetWidth)) {
        updatedCurrentPosition = itemsList.scrollWidth - itemsList.offsetWidth;
      }
      else if (updatedCurrentPosition < 0) {
        updatedCurrentPosition = 0;
      }

      this.setState({currentPosition: updatedCurrentPosition});
    }
  }

  renderListingList() {
    let listings = this.props.listings;

    if (listings && listings.length > 0) {
      let listingItems = [];

      if (this.props.simpleListing) {
        listingItems = this.props.listings.map((listing) => {
          return (
            <SimpleListingItem toggleWishListModal={ this.props.toggleWishListModal } key={ 'listing_' + listing.id } additionalClasses="col-sm-6 col-lg-4" listing={ listing } />
          )
        });
      }
      else {
        listingItems = this.props.listings.map((listing) => (<ListingItem toggleWishListModal={ this.props.toggleWishListModal } key={ 'listing_' + listing.id } listing={ listing } />));
      }

      return listingItems;
    }
    else {
      return (<div className="no-listings-to-display-div title-font-size tertiary-text-color"><FormattedMessage id="listings.no_listings_to_display" /></div>);
    }
  }

  render() {
    let listClass = 'items-list';
    if (!this.props.scrollable) {
      listClass += ' full-screen-list';
    }

    let leftScroller = '';
    let rightScroller = '';

    if (this.props.scrollable) {
      leftScroller = (
        <div className="previous-listing-btn listing-nav-button" onClick={ () => { this.handleNavigationClick('prev') } }>
          <img src={ chevronLeft } alt="chevron_left" />
        </div>
      )

      rightScroller = (
        <div className="next-listing-btn listing-nav-button" onClick={ () => { this.handleNavigationClick('next') } }>
          <img src={ chevronRight } alt="chevron_right" />
        </div>
      )
    }
    return (
      <div>
        <div className="listing-list col-xs-12" ref={ (div) => { this.listingItem = div; }}>
          { leftScroller }
          <Anime easing="easeInOutQuart"
                 duration={500}
                 scrollLeft={ this.state.currentPosition }>
            <div className={ listClass }>
              { this.renderListingList() }
            </div>
          </Anime>
          { rightScroller }
        </div>
      </div>
    )
  }
}

ListingList.propTypes = {
  scrollable: PropTypes.bool,
  accessToken: PropTypes.string,
  simpleListing: PropTypes.bool,
  listingsService: PropTypes.func,
  changeCurrentView: PropTypes.func
}
