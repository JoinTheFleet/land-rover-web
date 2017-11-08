import React, { Component } from 'react';
import Alert from 'react-s-alert';

import Loading from '../miscellaneous/loading';
import Pageable from '../miscellaneous/pageable';
import LocalizationService from '../../shared/libraries/localization_service';
import WishListsService from '../../shared/services/wish_lists_service';
import UserListing from '../user_listings/user_listing';

const LIMIT = 10;

export default class WishListList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wish_list: {},
      listings: [],
      listings_count: 1,
      page: 0,
      pages: 1,
      initialLoad: false,
      loading: false
    }

    this.storeWishList = this.storeWishList.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount() {
    let location = this.props.location;

    if (location && location.state && location.state.wish_list) {
      let wish_list = location.state.wish_list;

      this.storeWishList(wish_list);
    }
    else {
      WishListsService.show(this.props.match.params.id)
                      .then(response => {
                        this.storeWishList(response.data.data.wish_list);
                      })
                      .catch(error =>  {
                        Alert.error(error.response.data.message);
                      });
    }
  }

  storeWishList(wish_list) {
    this.setState({
      initialLoad: false,
      wish_list: wish_list,
      listings_count: wish_list.listings_count,
      pages: Math.ceil(wish_list.listings_count / LIMIT)
    }, this.reloadData);
  }

  handlePageChange(pageNumber) {
    this.setState({
      page: pageNumber - 1
    }, this.reloadData)
  }

  reloadData() {
    if (this.state.wish_list) {
      this.setState({
        loading: true
      }, () => {
        WishListsService.getListings(this.state.wish_list.id, {
          limit: LIMIT,
          offset: this.state.page * LIMIT
        }).then(response => {
          this.setState({
            loading: false,
            listings: response.data.data.listings
          })
        }).catch(error => {
          this.setState({
            loading: false
          }, () => {
            Alert.error(error.response.data.message);
          });
        });
      });
    }
  }

  render() {
    let body = '';

    if (this.state.initialLoad) {
      body = <Loading hiddenText />
    }
    else {
      body = (
        <Pageable loading={ this.state.loading } currentPage={ this.state.page + 1} totalPages={ this.state.pages } handlePageChange={ this.handlePageChange }>
          <div className='col-xs-12 wishlist' >
            <div className='row'>
              {
                this.state.listings.map((listing) => {
                  return (
                    <UserListing listing={listing} />
                  )
                })
              }
            </div>
          </div>
        </Pageable>
      )
    }

    return (
      <div>
        <div className='col-xs-12 no-side-padding review-title'>
          <span className='main-text-color title'>
            { this.state.wish_list.name }
          </span>
        </div>
        <div className='col-xs-12 no-side-padding'>
          { body }
        </div>
      </div>
    )
  }
}
