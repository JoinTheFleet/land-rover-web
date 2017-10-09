import React, {
  Component
} from 'react';

export default class FiltersTopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: [],
      sort_by: ''
    };
  }

  render() {
    return (
      <div id="filters_top_bar" className="smoke-grey">
        <a id="selectListingsFiltersBtn" className="filters-top-bar-control secondary-color white-text fs-12 btn" >
          <span>Filter</span>
        </a>
        <div className="pull-right">
          <span className="tertiary-text-color">SORT BY</span>
          <a id="selectListingsSortByBtn" className="filters-top-bar-control secondary-color white-text fs-12 btn" >
            <span>Price high - low</span>
          </a>
        </div>
      </div>
    )
  }
}
