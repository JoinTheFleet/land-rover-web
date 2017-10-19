import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Dropdown, MenuItem } from 'react-bootstrap';
import LocalizationService from '../../../shared/libraries/localization_service';

import PropTypes from 'prop-types';

const SORT_FILTERS = ['price', 'name', 'rating', 'distance']

class SortDropdown extends Component {
  render() {
    return (
      <div>
        <span className="tertiary-text-color text-uppercase">{ LocalizationService.formatMessage('application.sort_by') }</span>
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
      </div>
    )
  }
}

export default injectIntl(SortDropdown);

SortDropdown.propTypes = {
  handleSortToggle: PropTypes.func.isRequired,
  selectedSort: PropTypes.string.isRequired
}
