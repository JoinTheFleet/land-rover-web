import React, { Component } from 'react';

import Loading from '../miscellaneous/loading';
import Pageable from '../miscellaneous/pageable';
import LocalizationService from '../../shared/libraries/localization_service';

import Review from './review';

export default class ReviewList extends Component {
  render() {
    let body = '';

    if (this.props.initialLoad) {
      body = <Loading hiddenText />
    }
    else {
      body = (
        <Pageable loading={ this.props.loading } currentPage={ this.props.page } totalPages={ this.props.pages } handlePageChange={ this.props.handlePageChange }>
          <div className='col-xs-12 review-summary' >
            <div className='row'>
              {
                this.props.reviews.map((review) => {
                  return (
                    <Review review={review} />
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
            { LocalizationService.formatMessage('reviews.reviews') }
          </span>
        </div>
        { body }
      </div>
    )
  }
}
