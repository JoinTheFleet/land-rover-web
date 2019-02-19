import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import BlogListPost from './blog_list_post';

import LocalizationService from '../../shared/libraries/localization_service';

export default class BlogList extends Component {
  renderBlogPosts() {
    let blogPostsDiv = (
      <div className="blog-list-no-posts-placeholder text-center col-xs-12">
        <span className="tertiary-text-color text-secondary-font-weight fs-18">
          { LocalizationService.formatMessage('bloglist.no_posts') }
        </span>
      </div>
    );

    if (this.props.posts && this.props.posts.length > 0) {
      blogPostsDiv = (
        <div className="blog-list-posts col-xs-12 no-side-padding">
          {
            this.props.posts.slice(0, 3).map(post => (<BlogListPost key={ post.id } post={ post } author={ this.props.authors[post.creatorId] } />))
          }
        </div>
      )
    }

    return blogPostsDiv;
  }

  render() {
    return (
      <div className="blog-list col-xs-12">
        <p className="text-center">
          <span className="strong-font-weight title-font-size text-uppercase">
            <FormattedMessage id="application.blog" />
          </span>
          <br/>
          <span className="subtitle-font-size">
            <FormattedMessage id="homescreen.keep_up_to_date" />
          </span>
        </p>

        { this.renderBlogPosts() }

        <div className="blog-list-view-all col-xs-12 no-side-padding text-right">
          <a href={ process.env.REACT_APP_MEDIUM_URL || '/' } target="_blank" className="btn secondary-color white-text fs-12">
            { LocalizationService.formatMessage('application.view_all') }
          </a>
        </div>
      </div>
    )
  }
}

BlogList.propTypes = {
  posts: PropTypes.array,
  authors: PropTypes.object,
  loading: PropTypes.bool
}
