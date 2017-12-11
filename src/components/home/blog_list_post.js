import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import MediumService from '../../shared/services/medium_service';
import LocalizationService from '../../shared/libraries/localization_service';

import noImagesPlaceholder from '../../assets/images/placeholder-no-images.png';

class BlogListPost extends Component {
  render() {
    let image = noImagesPlaceholder;
    let post = this.props.post;

    if (post.virtuals && post.virtuals.previewImage) {
      image = MediumService.getImageUrl(post.virtuals.previewImage.imageId);
    }

    return (
      <div className="blog-list-post">
        <a href={ `${process.env.REACT_APP_MEDIUM_URL}${post.uniqueSlug}` } target="_blank">
          <div className="blog-list-post-image" style={ { backgroundImage: `url(${image})` } }></div>
          <p className="blog-list-post-title">
            <span className="secondary-text-color subtitle-font-weight text-uppercase fs-19"> { moment.unix(post.firstPublishedAt / 1000).format('DD MMM') } </span>
            <span className="fs-18"> { post.title } </span>
          </p>
          <p className="blog-list-post-subtitle tertiary-text-color text-secondary-font-weight fs-15">
            { post.virtuals.subtitle }
          </p>
          <p className="text-right fs-15">
            { LocalizationService.formatMessage('bloglist.by_author', { author: this.props.author.name }) }
          </p>
        </a>
      </div>
    );
  }
}

BlogListPost.propTypes = {
  post: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
};

export default BlogListPost;
