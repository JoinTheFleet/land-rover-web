import React, {
  Component
} from 'react';

import {
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';

import ListingsFilters from './listings_filters';

export default class ListingsFiltersTopBar extends Component {
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

  render() {
    return (
      <div id="filters_top_bar" className="smoke-grey">
        <a id="selectListingsFiltersBtn" className="filters-top-bar-control secondary-color white-text fs-12 btn"
           onClick={ () => { this.toggleFilters() } }>
          <FormattedMessage id="application.filter" />
        </a>
        <div className="pull-right">
          <FormattedMessage id="application.sort_by">
            { (text) => (
              <span className="tertiary-text-color text-uppercase">{text}</span>
            ) }
          </FormattedMessage>
          <a id="selectListingsSortByBtn" className="filters-top-bar-control secondary-color white-text fs-12 btn" >
            <FormattedMessage id="listings.sort.price_high_low" />
          </a>
        </div>
        <ListingsFilters open={ this.state.filtersOpen }
                         handleFilterToggle={ this.props.handleFilterToggle }
                         toggleFilters={ this.toggleFilters } />
      </div>
    )
  }
}

ListingsFiltersTopBar.propTypes = {
  handleFilterToggle: PropTypes.func.isRequired
}
