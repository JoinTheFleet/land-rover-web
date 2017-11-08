import React, { Component } from 'react';
import Alert from 'react-s-alert';

import Loading from '../miscellaneous/loading';
import Pageable from '../miscellaneous/pageable';
import LocalizationService from '../../shared/libraries/localization_service';
import WishListsService from '../../shared/services/wish_lists_service';
import WishListCard from './wish_list_card'

const LIMIT = 10;

export default class WishListList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wish_lists: [],
      page: 0,
      pages: 1,
      initialLoad: true,
      loading: false
    }

    this.loadData = this.loadData.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount() {
    this.loadData();
  }

  loadData() {
    let location = this.props.location;

    if (location && location.state && location.state.wish_lists) {
      let wish_lists = location.state.wish_lists;

      this.setState({
        wish_lists: wish_lists,
        initialLoad: false
      }, this.reloadData);
    }
    else {
      this.reloadData();
    }
  }

  handlePageChange(pageNumber) {
    this.setState({
      page: pageNumber - 1
    }, this.reloadData)
  }

  reloadData() {
    this.setState({
      loading: true
    }, () => {
      WishListsService.index({
        limit: LIMIT,
        offset: this.state.page * LIMIT
      }).then(response => {
        let data = response.data.data;
        this.setState({
          initialLoad: false,
          loading: false,
          wish_lists: data.wish_lists,
          pages: Math.ceil(data.count / LIMIT)
        })
      }).catch(error => {
        this.setState({
          initialLoad: false,
          loading: false
        }, () => {
          Alert.error(error.response.data.message);
        });
      });
    });
  }

  render() {
    let body = '';

    if (this.state.initialLoad) {
      body = <Loading />
    }
    else {
      body = (
        <Pageable loading={ this.state.loading } currentPage={ this.state.page + 1} totalPages={ this.state.pages } handlePageChange={ this.handlePageChange }>
          <div className='col-xs-12 wishlist' >
            <div className='row'>
              {
                this.state.wish_lists.map((wish_list) => {
                  return (
                    <WishListCard wish_list={wish_list} />
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
            { LocalizationService.formatMessage('wish_lists.wish_lists') }
          </span>
        </div>
        <div className='col-xs-12 no-side-padding'>
          { body }
        </div>
      </div>
    )
  }
}
