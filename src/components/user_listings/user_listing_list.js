import React, { Component } from 'react';

import Loading from '../miscellaneous/loading';
import Pageable from '../miscellaneous/pageable';
import Placeholder from '../miscellaneous/placeholder';
import LocalizationService from '../../shared/libraries/localization_service';

import UserListing from './user_listing';

export default class UserListingList extends Component {
  render() {
    let body = '';

    if (this.props.initialLoad) {
      body = <Loading hiddenText />
    }
    else if (this.props.listings.length === 0) {
      body = <Placeholder contentType="vehicles_guest" />
    }
    else {
      body = (
        <Pageable loading={ this.props.loading } currentPage={ this.props.page } totalPages={ this.props.pages } handlePageChange={ this.props.handlePageChange }>
          <div className='col-xs-12 user-listings-summary' >
            <div className='row'>
              {
                this.props.listings.map((listing) => {
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
      <div className='user-listings'>
        <div className='col-xs-12 no-side-padding user-listings-title'>
          <span className='main-text-color title'>
            { LocalizationService.formatMessage('listings.listings') }
          </span>
          <span className='tertiary-text-color count'>
            ({ this.props.count })
          </span>
        </div>
        { body }
      </div>
    )
  }
}
