import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Loading from '../miscellaneous/loading';

import WishListsService from '../../shared/services/wish_lists_service';
import WishListCard from './wish_list_card';

import LocalizationService from '../../shared/libraries/localization_service';

const LIMIT = 5;

export default class WishListSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      wish_lists: [],
      count: 1
    }

    this.loadWishLists = this.loadWishLists.bind(this);
    this.storeResponse = this.storeResponse.bind(this);
  }

  componentWillMount() {
    this.loadWishLists();
  }

  loadWishLists() {
    this.setState({
      loading: true
    }, () => {
      WishListsService.index({
        limit: LIMIT
      })
      .then(this.storeResponse)
    });
  }

  storeResponse(response) {
    if (response && response.data.data) {
      let data = response.data.data;

      this.setState({
        loading: false,
        wish_lists: data.wish_lists,
        count: data.count
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    else {
      return (
        <div>
          <div className='col-xs-12 no-side-padding review-title'>
            <span className='main-text-color title'>
              { LocalizationService.formatMessage('wish_lists.wish_lists') }
            </span>
            <span className='tertiary-text-color count'>
              ({ this.state.count })
            </span>
            <span>
              <Link to={{
                      pathname: `/dashboard/wish_lists`,
                      state: {
                        wish_lists: this.state.wish_lists
                      }
                    }}
                    className='secondary-text-color link pull-right'>
                { LocalizationService.formatMessage('application.see_all') }
              </Link>
            </span>
          </div>
          <div className='col-xs-12 wishlist-summary' >
            <div className='row'>
              {
                this.state.wish_lists.map((wish_list) => {
                  return (
                    <WishListCard key={wish_list.id} wish_list={wish_list} />
                  )
                })
              }
            </div>
          </div>
        </div>
      );
    }
  }
}
