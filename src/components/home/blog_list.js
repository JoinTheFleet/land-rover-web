import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class BlogList extends Component {
  render() {
    return (
      <div id="blog_list">
        <p className="text-center">
          <span className="strong-font-weight title-font-size text-uppercase">
            <FormattedMessage id="application.blog" />
          </span>
          <br/>
          <span className="subtitle-font-size">
            <FormattedMessage id="homescreen.keep_up_to_date" />
          </span>
        </p>
      </div>
    )
  }
}
