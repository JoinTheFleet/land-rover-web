import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import Pagination from './pagination';

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

    return (
      <div className="pageable">
        { this.props.children }
        { paginationDiv }
      </div>
    )
  }
}

Pageable.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired
}
