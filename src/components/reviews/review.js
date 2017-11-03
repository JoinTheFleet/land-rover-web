import React, { Component } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

export default class Review extends Component {
  render() {
    let review = this.props.review;

    return (
      <div className='col-xs-12 no-side-padding review'>
        <div className='row'>
          <div className='col-xs-12 col-sm-2 no-side-padding'>
            <Link to={ `/users/${review.reviewer.id}` } >
              <div className='col-xs-12 col-sm-6 text-left'>
                <Avatar src={ review.reviewer.images.large_url } round />
                <span className='strong-font-weight reviewer-name col-xs-12 text-center'>
                  { review.reviewer.first_name }
                </span>
              </div>
            </Link>
          </div>
          <div className='col-xs-12 col-sm-10 review-feedback'>
            { review.feedback }
          </div>
        </div>
      </div>
    )
  }
}
