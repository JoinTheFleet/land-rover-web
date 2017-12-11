import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, MenuItem, Button, ButtonGroup } from 'react-bootstrap';

import LocalizationService from '../../shared/libraries/localization_service';

export default class ListingsSelector extends Component {
  render() {
    let vehicleDropdownPlaceholder = LocalizationService.formatMessage('application.vehicle');

    if (this.props.currentListing) {
      vehicleDropdownPlaceholder = `${this.props.currentListing.variant.make.name} ${this.props.currentListing.variant.model.name} ${this.props.currentListing.variant.year.year}`
    }

    let listingSelector = '';

    if (this.props.role === 'owner') {
      listingSelector = (
        <div className='text-right pull-right vehicle-select'>
          <span className="text-uppercase tertiary-text-color placeholder hidden-xs">{ LocalizationService.formatMessage('application.vehicle') }</span>
          <Dropdown key='listings_selector'
                    pullRight
                    id='listings_selector'>

            <Dropdown.Toggle disabled={ !this.props.loading } className='secondary-color white-text fs-12'>
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
      )
    }

    let roleSelector = '';

    if (!this.props.hideRoleSelector) {
      roleSelector = (
        <ButtonGroup pullLeft={ true }>
          <Button onClick={ () => { this.props.changeCurrentUserRole('renter'); }}
                  active={ this.props.role === 'renter' }>
            { LocalizationService.formatMessage('application.renter') }
          </Button>
          <Button onClick={ () => { this.props.changeCurrentUserRole('owner'); }}
                  active={ this.props.role === 'owner' }>
            { LocalizationService.formatMessage('application.owner') }
          </Button>
        </ButtonGroup>
      );
    }

    return (
        <div className="listings-selector-bar smoke-grey">
          { roleSelector }
          { listingSelector }
        </div>
    );
  }
}

ListingsSelector.propTypes = {
  listings: PropTypes.array,
  currentListing: PropTypes.object,
  handleVehicleSelect: PropTypes.func.isRequired
}
