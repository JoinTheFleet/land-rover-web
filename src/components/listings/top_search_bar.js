import React, {Component} from 'react'

class TopSearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: [],
      sort_by: ''
    }
  }

  render () {
    return (
      <div id="top_search_bar" className="smoke-grey">
        <a id="selectListingsFiltersBtn" className="top-search-bar-control secondary-color white-text btn" >
          <span>Filter</span>
        </a>
        <div className="pull-right">
          <span className="terciary-text-color">SORT BY</span>
          <a id="selectListingsSortByBtn" className="top-search-bar-control secondary-color white-text btn" >
            <span>Price high - low</span>
          </a>
        </div>
      </div>
    )
  }
}

export default TopSearchBar;
