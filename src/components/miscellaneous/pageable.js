import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pagination from './pagination';
import Loading from './loading';

export default class Pageable extends Component {
  render() {
    let paginationDiv = '';

    if (this.props.totalPages > 1) {
      paginationDiv = (
        <Pagination currentPage={ this.props.currentPage }
                    totalPages={ this.props.totalPages }
                    handlePageChange={ this.props.handlePageChange } />
      )
    }

    let childElements = this.props.children;

    if (this.props.loading) {
      return <Loading />;
    }
    else {
      return (
        <div className="pageable">
          { childElements }
          { paginationDiv }
        </div>
      )
    }
  }
}

Pageable.propTypes = {
  loading: PropTypes.bool,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired
}
