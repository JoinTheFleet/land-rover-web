import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';


export default class Pagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: this.props.currentPage || 1
    };

    this.changePage = this.changePage.bind(this);
  }

  changePage(page) {
    this.setState({ currentPage: page }, () => {
      this.props.handlePageChange(page);
    });
  }

  render() {
    let paginationLinks = [];
    let previousPageLink = '';
    let nextPageLink = '';
    let paginationLink;

    for(let i = 1; i <= this.props.totalPages; i++) {
      if (i === this.state.currentPage) {
        paginationLink = (<span className="secondary-text-color">{ i }</span>);
      }
      else {
        paginationLink = (<a className="static-link tertiary-text-color" onClick={ () => { this.changePage(i) } }> { i } </a>);
      }

      paginationLinks.push((
        <div key={ 'page_' + i } className="pagination-page-link">
          { paginationLink }
        </div>
      ));
    }

    if (this.state.currentPage > 1) {
      previousPageLink = (
        <div className="pagination-nav-link previous-page-link">
          <a className="static-link" onClick={ () => { this.changePage(this.state.currentPage - 1) } }>
            <FormattedMessage id="application.previous" />
          </a>
        </div>
      );
    }

    if (this.state.currentPage < this.props.totalPages ) {
      nextPageLink = (
        <div className="pagination-nav-link next-page-link">
          <a className="static-link" onClick={ () => { this.changePage(this.state.currentPage + 1) } }>
            <FormattedMessage id="application.next" />
          </a>
        </div>
      );
    }

    return (
      <div className="pagination col-xs-12 text-center">
        { previousPageLink }

        <div className="pagination-pages">
          { paginationLinks }
        </div>

        { nextPageLink }
      </div>
    )
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired
};
