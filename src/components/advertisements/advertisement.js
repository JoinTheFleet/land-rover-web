import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

export default class Advertisement extends Component {
  render() {
    let advertisement = this.props.advertisement;

    return (
      <div>
        <div className='col-xs-12 listing-list'>
          <div className={ 'listing-item col-xs-12 ' + (this.props.additionalClasses || '') }>
            <div>
              <div className="listing-item-photo-and-title">
                <Link to={ `${advertisement.url}?token=${this.props.accessToken}` }
                      target='_blank'>
                  <img alt='' src={ advertisement.images.original_url } />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Advertisement.propTypes = {
  advertisement: PropTypes.string,
  accessToken: PropTypes.string
}
