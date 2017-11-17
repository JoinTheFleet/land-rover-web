import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import LocalizationService from '../../../shared/libraries/localization_service';

import PropTypes from 'prop-types';

import ListingsFilters from './listings_filters';
import SortDropdown from './sort_dropdown';
import Button from '../../miscellaneous/button';

class ListingsFiltersTopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filtersOpen: false
    };

    this.toggleFilters = this.toggleFilters.bind(this);
    this.resetAllFilters = this.resetAllFilters.bind(this);
  }

  toggleFilters() {
    this.setState((prevState) => ( { filtersOpen: !prevState.filtersOpen } ));
  }

  componentDidUpdate() {
    if (this.state.shouldClearFilters) {
      this.setState({ shouldClearFilters: false });
    }
  }

  resetAllFilters() {
    this.setState({ shouldClearFilters: true });
  }

  render() {
    let resetFilters = '';

    if (this.state.filtersOpen) {
      resetFilters = (
        <a className="filters-top-bar-control reset-filters secondary-color white-text fs-12 btn" onClick={ this.resetAllFilters }>
          { LocalizationService.formatMessage('listings.reset_all_filters') }
        </a>
      )
    }
    return (
      <div id="filters_top_bar" className="smoke-grey">
        <a id="selectListingsFiltersBtn" className="filters-top-bar-control secondary-color white-text fs-12 btn"
           onClick={ () => { this.toggleFilters() } }>
           { LocalizationService.formatMessage('application.filter') }
        </a>
        { resetFilters }
        <div className="pull-right">
          <SortDropdown handleSortToggle={this.props.handleSortToggle} selectedSort={this.props.selectedSort}/>
        </div>
        <ListingsFilters open={ this.state.filtersOpen }
                         handleFilterToggle={ this.props.handleFilterToggle }
                         toggleFilters={ this.toggleFilters }
                         shouldClearFilters={ this.state.shouldClearFilters } />
      </div>
    )
  }
}

export default injectIntl(ListingsFiltersTopBar);

ListingsFiltersTopBar.propTypes = {
  handleFilterToggle: PropTypes.func.isRequired,
  handleSortToggle: PropTypes.func.isRequired,
  selectedSort: PropTypes.string.isRequired
}
