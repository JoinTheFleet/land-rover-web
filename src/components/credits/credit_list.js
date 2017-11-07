import React, { Component } from 'react';
import Alert from 'react-s-alert';

import Loading from '../miscellaneous/loading';
import Pageable from '../miscellaneous/pageable';
import LocalizationService from '../../shared/libraries/localization_service';
import UserCreditHistoriesService from '../../shared/services/users/user_credit_histories_service';
import CreditCard from './credit_card';

const LIMIT = 10;

export default class CreditList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      credits: [],
      page: 0,
      pages: 1,
      loading: false
    }

    this.reloadData = this.reloadData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount() {
    this.reloadData();
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
      UserCreditHistoriesService.index({
        limit: LIMIT,
        offset: this.state.page * LIMIT
      }).then(response => {
        let data = response.data.data;

        this.setState({
          loading: false,
          credits: data.histories,
          pages: Math.ceil(data.count / LIMIT)
        })
      }).catch(error => {
        this.setState({
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
        <Pageable loading={ this.state.loading } currentPage={ this.state.page + 1 } totalPages={ this.state.pages } handlePageChange={ this.handlePageChange }>
          <div className='col-xs-12 credit' >
            <div className='row'>
              {
                this.state.credits.map((credit) => {
                  return (
                    <CreditCard credit={credit} />
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
            { LocalizationService.formatMessage('credits.credits') }
          </span>
        </div>
        <div className='col-xs-12 no-side-padding'>
          { body }
        </div>
      </div>
    )
  }
}
