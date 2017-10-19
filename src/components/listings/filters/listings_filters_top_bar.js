import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Dropdown, MenuItem } from 'react-bootstrap';
import LocalizationService from '../../../shared/libraries/localization_service';

import PropTypes from 'prop-types';

import ListingsFilters from './listings_filters';

const SORT_FILTERS = ['price', 'name', 'rating', 'distance']

class ListingsFiltersTopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filtersOpen: false
    };

    this.toggleFilters = this.toggleFilters.bind(this);
  }

  toggleFilters() {
    this.setState((prevState) => ( { filtersOpen: !prevState.filtersOpen } ));
  }

  sortButton() {
    return (
      <Dropdown onSelect={this.props.handleSortToggle}
                pullRight={true}
                key='search-sort'
                id='search-sort'>
        <Dropdown.Toggle className='secondary-color white-text fs-12 selectListingsSortByBtn'>
          { LocalizationService.formatMessage(`listings.sort.${this.props.selectedSort}`) }
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            SORT_FILTERS.map((filter) => {
              return <MenuItem eventKey={filter} active={filter === this.props.selectedSort}>{ LocalizationService.formatMessage(`listings.sort.${filter}`) }</MenuItem>
            })
          }
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  render() {
    return (
      <div id="filters_top_bar" className="smoke-grey">
        <a id="selectListingsFiltersBtn" className="filters-top-bar-control secondary-color white-text fs-12 btn"
           onClick={ () => { this.toggleFilters() } }>
           { LocalizationService.formatMessage('application.filter') }
        </a>
        <div className="pull-right">
          <span className="tertiary-text-color text-uppercase">{ LocalizationService.formatMessage('application.sort_by') }</span>
          { this.sortButton() }
        </div>
        <ListingsFilters open={ this.state.filtersOpen }
                         handleFilterToggle={ this.props.handleFilterToggle }
                         toggleFilters={ this.toggleFilters } />
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
