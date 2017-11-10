import React, { Component } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

import moment from 'moment';

export default class Review extends Component {
  render() {
    let review = this.props.review;

    return (
      <div className='col-xs-12 no-side-padding review'>
        <div className='review-reviewer-image col-xs-12 no-side-padding'>
          <Link to={ `/users/${review.reviewer.id}` } >
            <Avatar src={ review.reviewer.images.large_url } round />
          </Link>
        </div>
        <div className='review-feedback col-xs-12'>
          <p>
            <Link to={ `/users/${review.reviewer.id}` } >
              <span className="subtitle-font-weight fs-20"> { review.reviewer.name } </span>
            </Link>
            <br/>
            <span className="tertiary-text-color"> { moment.utc(moment.unix(review.created_at)).format('DD MMM YYYY') } </span>
          </p>
          <p> { review.feedback } </p>
        </div>
      </div>
    )
  }
}
