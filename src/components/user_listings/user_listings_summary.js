import React, { Component } from 'react';

import UserListing from './user_listing';
import { Link } from 'react-router-dom';

import UserListingsService from '../../shared/services/users/user_listings_service';
import LocalizationService from '../../shared/libraries/localization_service';

const LIMIT = 5;

export default class UserListingsSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      listings: []
    }

    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    this.setState({
      loading: true
    }, () => {
      UserListingsService.index(this.props.user.id, {
        limit: LIMIT
      })
      .then(response => {
        this.setState({
          loading: false,
          listings: response.data.data.listings
        });
      })
    })
  }

  componentWillMount() {
    this.loadData();
  }

  render() {
    return (
      <div>
        <div className='col-xs-12 no-side-padding user-listings-title'>
          <span className='main-text-color title'>
            { LocalizationService.formatMessage('listings.listings') }
          </span>
          <span className='tertiary-text-color count'>
            ({ this.props.user.listing_count })
          </span>
          <span>
            <Link to={{
                    pathname: `/users/${this.props.user.id}/listings`,
                    state: {
                      listings: this.state.listings
                    }
                  }}
                  className='secondary-text-color link pull-right'>
              { LocalizationService.formatMessage('application.see_all') }
            </Link>
          </span>
        </div>
        <div className='col-xs-12' >
          <div className='row'>
            {
              this.state.listings.map((listing) => {
                return (
                  <UserListing listing={listing} />
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
