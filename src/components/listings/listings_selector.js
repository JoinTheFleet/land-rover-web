import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, MenuItem } from 'react-bootstrap';

import LocalizationService from '../../shared/libraries/localization_service';

export default class ListingsSelector extends Component {
  render() {
    let vehicleDropdownPlaceholder = LocalizationService.formatMessage('application.vehicle');

    if (this.props.currentListing) {
      vehicleDropdownPlaceholder = `${this.props.currentListing.variant.make.name} ${this.props.currentListing.variant.model.name} ${this.props.currentListing.variant.year.year}`
    }

    return (
      <div className="listings-selector-bar smoke-grey text-right">
        <span className="text-uppercase tertiary-text-color">{ vehicleDropdownPlaceholder }</span>

        <Dropdown pullRight={true}
                  key='listings_selector'
                  id='listings_selector'>

          <Dropdown.Toggle className='secondary-color white-text fs-12'>
            { vehicleDropdownPlaceholder }
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {
              this.props.listings.map(listing => {
                return (
                  <MenuItem key={`listing_selector_${listing.id}`}
                            eventKey={listing.id}
                            active={this.props.currentListing && listing.id === this.props.currentListing.id}
                            onClick={ () => { this.props.handleVehicleSelect(listing) } }>
                    { `${listing.variant.make.name} ${listing.variant.model.name} ${listing.variant.year.year}` }
                  </MenuItem>
                )
              })
            }
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

ListingsSelector.propTypes = {
  listings: PropTypes.array,
  currentListing: PropTypes.object,
  handleVehicleSelect: PropTypes.func.isRequired
}
