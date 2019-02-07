import React, { Component } from 'react';

import { Switch, Route } from 'react-router-dom';

import Alert from 'react-s-alert';
import Loading from '../miscellaneous/loading';

import VendorLocationsService from '../../shared/services/vendor_locations/vendor_locations_service';

import Profile from './profile';
import Listings from './listings';
import Reviews from './reviews'

export default class Controller extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vendorLocation: undefined
    };

    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  componentWillReceiveProps(props) {
    if (this.props.match.params.id !== props.match.params.id) {
      this.setState({
        vendorLocation: undefined,
      }, this.refreshData);
    }
  }

  refreshData() {
    let location = this.props.location;

    if (location && location.state && location.state.vendorLocation) {
      this.setState({ vendorLocation: location.state.vendorLocation });
    }
    else {
      VendorLocationsService.show(this.props.match.params.id)
                            .then(response => {
                              let data = response.data.data;

                              if (data && data.vendor_location && this.state) {
                                this.setState({
                                  vendorLocation: data.vendor_location
                                });
                              }
                            })
                            .catch(error => {
                              if (error.response) {
                                Alert.error(error.response.data.message);
                              }
                            });
    }
  }

  render() {
    if (this.state.vendorLocation) {
      return (
        <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 no-side-padding'>
          <Switch>
            <Route path='/vendor_locations/:id/reviews' render={(props) => { return <Reviews vendorLocation={ this.state.vendorLocation } {...props} {...this.props} />}} />
            <Route path='/vendor_locations/:id/listings' render={(props) => { return <Listings vendorLocation={ this.state.vendorLocation } {...props} {...this.props} />}} />
            <Route path='/vendor_locations/:id' render={(props) => { return <Profile vendorLocation={ this.state.vendorLocation } {...props} {...this.props} />}} />
          </Switch>
        </div>
      );
    }
    else {
      return <Loading />;
    }
  }
}
