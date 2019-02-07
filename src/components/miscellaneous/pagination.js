import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';

const OFFSET = 2;

export default class Pagination extends Component {
  render() {
    let paginationLinks = [];
    let previousPageLink = '';
    let firstPageLink = '';
    let nextPageLink = '';
    let lastPageLink = '';
    let paginationLink;

    for(let i = Math.max(1, this.props.currentPage - OFFSET); i <= Math.min(this.props.totalPages, this.props.currentPage + OFFSET); i++) {
      if (i === this.props.currentPage) {
        paginationLink = (<span className="secondary-text-color">{ i }</span>);
      }
      else {
        paginationLink = (<a className="static-link tertiary-text-color" onClick={ () => { this.props.handlePageChange(i) } }> { i } </a>);
      }

      paginationLinks.push((
        <div key={ 'page_' + i } className="pagination-page-link">
          { paginationLink }
        </div>
      ));
    }

    if (this.props.currentPage > 1) {
      previousPageLink = (
        <div className="pagination-nav-link previous-page-link">
          <a className="static-link" onClick={ () => { this.props.handlePageChange(this.props.currentPage - 1) } }>
            <FormattedMessage id="application.previous" />
          </a>
        </div>
      );
    }

    if (this.props.currentPage > (1 + OFFSET)) {
      firstPageLink = (
        <div className="pagination-nav-link first-page-link">
          <a className="static-link" onClick={ () => { this.props.handlePageChange(1) } }>
            <FormattedMessage id="application.first" />
          </a>
        </div>
      );
    }    

    if (this.props.currentPage < this.props.totalPages ) {
      nextPageLink = (
        <div className="pagination-nav-link next-page-link">
          <a className="static-link" onClick={ () => { this.props.handlePageChange(this.props.currentPage + 1) } }>
            <FormattedMessage id="application.next" />
          </a>
        </div>
      );
    }

    if (this.props.currentPage < (this.props.totalPages - OFFSET)) {
      lastPageLink = (
        <div className="pagination-nav-link last-page-link">
          <a className="static-link" onClick={ () => { this.props.handlePageChange(this.props.totalPages) } }>
            <FormattedMessage id="application.last" />
          </a>
        </div>
      );
    }

    return (
      <div className="pagination col-xs-12 text-center">
        { firstPageLink }
        { previousPageLink }

        <div className="pagination-pages">
          { paginationLinks }
        </div>

        { nextPageLink }
        { lastPageLink }
      </div>
    )
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired
};
