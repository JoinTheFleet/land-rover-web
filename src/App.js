import React, { Component } from 'react';

import './App.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-datez/dist/css/react-datez.css';
import 'react-select/dist/react-select.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import 'react-chat-elements/dist/main.css';

import Alert from 'react-s-alert';

import Constants from './miscellaneous/constants';

import Header from './components/layout/header';
import HeaderTopMenu from './components/layout/header_top_menu';
import Footer from './components/layout/footer';
import Homescreen from './components/home/homescreen';
import Homefeed from './components/homefeed/homefeed';
import Login from './components/authentication/login';
import Listings from './components/listings/listings';
import Bookings from './components/bookings/bookings';
import UserManagement from './components/user_management/user_management';
import BookingsCalendar from './components/bookings/bookings_calendar';
import MessagingController from './components/messaging/messaging_controller';
import UserController from './components/users/user_controller';
import DashboardController from './components/dashboard/dashboard_controller';

import GeolocationService from './shared/services/geolocation_service';
import AuthenticationService from './shared/services/authentication_service';
import LocationsService from './shared/services/locations_service';
import SearchService from './shared/services/search_service';
import client from './shared/libraries/client';
import Cookies from 'universal-cookie';
import { Route, Redirect, Switch } from 'react-router-dom';

const cookies = new Cookies();
const navigationSections = Constants.navigationSections();
const userRoles = Constants.userRoles();
const ALERT_OPTIONS = {
  position: 'top',
  theme: 'dark',
  timeout: 10000,
  effect: 'stackslide',
  stack: {
    limit: 1
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: cookies.get('accessToken'),
      currentUserRole: userRoles.renter,
      roleChanged: false,
      listings: [],
      modalName: undefined,
      searchLocations: [],
      locationName: '',
      currentSearch: false,
      customSearch: false,
      startDate: undefined,
      endDate: undefined,
      location: {
        latitude: 0,
        longitude: 0
      },
      boundingBox: undefined,
      sort: 'distance',
      viewsProps: {},
      visitedDashboard: false,
      limit: 20,
      page: 0,
      pages: 1
    };

    if (this.state.accessToken && this.state.accessToken.length > 0) {
      client.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.accessToken;
    }

    this.toggleModal = this.toggleModal.bind(this);
    this.handleMapDrag = this.handleMapDrag.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.performSearch = this.performSearch.bind(this);
    this.setAccessToken = this.setAccessToken.bind(this);
    this.locationSearch = this.locationSearch.bind(this);
    this.handleSortToggle = this.handleSortToggle.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.hideSearchResults = this.hideSearchResults.bind(this);
    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.handleLocationFocus = this.handleLocationFocus.bind(this);
    this.handleMenuItemSelect = this.handleMenuItemSelect.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleLocationSelect = this.handleLocationSelect.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
    this.changeCurrentUserRole = this.changeCurrentUserRole.bind(this);
  }

  componentWillMount() {
    setTimeout(() => {
      GeolocationService.getCurrentPosition()
                        .then(position => {
                          let location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                          };
                          this.setState({location: location});
                        });
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.roleChanged && prevState.roleChanged === this.state.roleChanged) {
      this.setState({ roleChanged: false });
    }
  }

  setAccessToken(accessToken) {
    cookies.remove('accessToken');
    if (accessToken.length > 0) {
      let newState = {
        visitedDashboard: this.state.accessToken,
        accessToken: accessToken,
        modalName: undefined
      };

      this.setState(newState, () => {
        if (accessToken.length > 0) {
          cookies.set('accessToken', accessToken);
          client.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        }
        else {
          delete client.defaults.headers.common['Authorization'];
        }
      });
    }
    else {
      this.setState({
        accessToken: undefined
      });
    }
  }

  hideSearchResults() {
    this.setState({ searchLocations: [] });
  }

  changeCurrentUserRole() {
    this.setState((prevState) => ({
      currentUserRole: (prevState.currentUserRole === userRoles.renter) ? userRoles.owner : userRoles.renter,
      roleChanged: true
    }));
  }

  handleMenuItemSelect(menuItem) {
    if (menuItem === navigationSections.logout) {
      AuthenticationService.logout()
                           .then(() => { this.setAccessToken(''); })
                           .catch(() => { this.setAccessToken(''); });
      return (<Redirect to='/' />);
    }
  }

  toggleModal(modal) {
    if (this.state.modalName === modal) {
      this.setState({ modalName: undefined });
    }
    else {
      this.setState({ modalName: modal });
    }
  }

  renderHeaderTopMenu() {
    return (
      <HeaderTopMenu currentUserRole={ this.state.currentUserRole }
                     loggedIn={ this.state.accessToken && this.state.accessToken.length > 0 } />
    )
  }

  handleDatesChange({startDate, endDate}) {
    this.setState({
      startDate: startDate,
      endDate: endDate,
      pages: 1,
      page: 0
    }, () => {
      if (startDate && endDate) {
        this.performSearch();
      }
    });
  }

  handleLocationSelect(location) {
    this.setState({
      locationName: location.name,
      searchLocations: [],
      customSearch: true,
      pages: 1,
      page: 0,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      boundingBox: location.bounding_box
    }, this.performSearch);
  }

  handlePageChange(pageNumber) {
    this.setState({
      page: pageNumber - 1
    }, this.performSearch);
  }

  performSearch() {
    let searchParams = {
      sort: this.state.sort
    };
    let location = this.state.location;
    let boundingBox = this.state.boundingBox;
    let filters = this.state.filters;
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;

    if (location) {
      searchParams.location = location;
    }

    if (startDate && endDate) {
      searchParams.start_at = startDate.utc().unix();
      searchParams.end_at = endDate.utc().unix();
    }

    if (boundingBox) {
      searchParams.bounding_box = boundingBox;
      searchParams.force_bounding_box = true;
    }

    if (filters) {
      Object.keys(filters).forEach(filter => {
        if (filters[filter]) {
          searchParams[filter] = filters[filter];
        }
      });
    }

    SearchService.create({
      search: searchParams,
      limit: this.state.limit,
      offset: this.state.page * this.state.limit
    }).then((response) => {
      this.setState({
        listings: response.data.data.listings,
        pages: Math.ceil(response.data.data.total_count / this.state.limit)
      });
    })
  }

  handleSortToggle(eventKey, event) {
    this.setState({
      page: 0,
      pages: 1,
      sort: eventKey,
      customSearch: true
    }, this.performSearch)
  }

  handlePositionChange(bounds, center) {
    let location = {
      latitude: center.lat,
      longitude: center.lng
    }

    let boundingBox = {
      left: bounds.sw.lng,
      right: bounds.ne.lng,
      bottom: bounds.sw.lat,
      top: bounds.ne.lat
    }

    this.setState({
      page: 0,
      pages: 1,
      location: location,
      boundingBox: boundingBox,
      currentSearch: false
    }, this.performSearch);
  }

  handleFilterToggle(filters) {
    this.setState({
      page: 0,
      pages: 1,
      filters: filters,
      currentSearch: true
    }, this.performSearch);
  }

  handleMapDrag(bounds, center) {
    this.setState({
      page: 0,
      pages: 1,
      customSearch: true
    });
    this.handlePositionChange(bounds, center);
  }

  locationSearch(latitude, longitude, term) {
    LocationsService.create(latitude, longitude, term)
                    .then(response => {
                      this.setState({
                        searchLocations: response.data.data.locations
                      });
                    });
  }


  handleLocationFocus(event) {
    this.handleLocationChange(event, true);
  }

  handleLocationChange(event, immediate) {
    let location = this.state.location;
    let term = event.target.value;
    let latitude = location ? location.latitude : undefined;
    let longitude = location ? location.longitude : undefined;
    let locationTimeout = this.state.locationTimeout;

    if (locationTimeout) {
      clearTimeout(locationTimeout);
      locationTimeout = undefined;
    }

    if (!immediate) {
      locationTimeout = setTimeout(() => {
        this.locationSearch(latitude, longitude, term);
      }, 1000);
    }
    else {
      locationTimeout = setTimeout(() => {
        this.locationSearch(latitude, longitude, term);
      }, 10);
    }

    this.setState({
      locationName: term,
      locationTimeout: locationTimeout
    });
  }

  render() {
    if( this.state.roleChanged ) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <Route path="/" render={(props) => {
        return (
          <div className="App">
            <Alert {...ALERT_OPTIONS} />
            <Header loggedIn={ this.state.accessToken && this.state.accessToken.length > 0 }
                    currentUserRole={ this.state.currentUserRole }
                    handleMenuItemSelect={ this.handleMenuItemSelect }
                    toggleModal={ this.toggleModal }
                    handleChangeCurrentUserRole={ this.changeCurrentUserRole }
                    handleLocationChange={ this.handleLocationChange }
                    handleLocationFocus={ this.handleLocationFocus }
                    handleDatesChange={ this.handleDatesChange }
                    handleLocationSelect={ this.handleLocationSelect }
                    handleSearch={ this.performSearch }
                    startDate={ this.state.startDate }
                    endDate={ this.state.endDate }
                    locationName={ this.state.locationName }
                    hideSearchResults={ this.hideSearchResults }
                    searchLocations={ this.state.searchLocations }
                    hideSearchForm={ props.location.pathname === '/' }
                    showSearchButton={ true } />

            { this.renderHeaderTopMenu() }

            <div id="main_container" className="col-xs-12 no-side-padding">
              <Switch>
                <Route exact path="/" render={(props) => {
                  if (this.state.accessToken && !this.state.visitedDashboard) {
                    this.setState({ visitedDashboard: true });
                    return <Redirect to='/dashboard' />
                  }
                  else {
                    return <Homescreen {...props}
                                currentUserRole={ this.state.currentUserRole }
                                handleLocationChange={ this.handleLocationChange }
                                handleLocationFocus={ this.handleLocationFocus }
                                handleDatesChange={ this.handleDatesChange }
                                handleLocationSelect={ this.handleLocationSelect }
                                handleSearch={ this.performSearch }
                                startDate={ this.state.startDate }
                                endDate={ this.state.endDate }
                                locationName={ this.state.locationName }
                                hideSearchResults={ this.hideSearchResults }
                                searchLocations={ this.state.searchLocations }
                                showSearchButton={ true } />
                  }
                }} />
                <Route path="/search" render={(props) => {
                  return (
                    <Homefeed {...props}
                              currentUserRole={ this.state.currentUserRole }
                              accessToken={ this.state.accessToken }
                              handleFilterToggle={ this.handleFilterToggle }
                              handleMapDrag={ this.handleMapDrag }
                              handlePositionChange={ this.handlePositionChange }
                              handleSortToggle={ this.handleSortToggle }
                              sort={ this.state.sort }
                              listings={ this.state.listings }
                              location={ this.state.location }
                              boundingBox={ this.state.boundingBox }
                              customSearch={ this.state.customSearch }
                              currentSearch={ this.state.currentSearch }
                              handlePageChange={ this.handlePageChange }
                              pages={ this.state.pages }
                              page={ this.state.page + 1 } />
                  )
                }} />
                <Route path='/dashboard' component={ DashboardController } />
                <Route path='/users/:id' component={ UserController } />

                if (this.state.accessToken && this.state.accessToken.length > 0) {
                  <Switch>
                    <Route exact path="/home" render={() => <Redirect to="/" /> } />
                    <Route path="/messages" render={(props) => {
                      return (<MessagingController {...props}
                                                   role={ this.state.currentUserRole } />)
                    }} />
                    <Route path="/listings" render={(props) => {
                      return (<Listings {...props}
                                        currentUserRole={ this.state.currentUserRole } />)
                    }} />
                    <Route path="/account" render={(props) => {
                      return (<UserManagement {...props}
                                              currentUserRole={ this.state.currentUserRole} />)
                    }} />
                    <Route path="/calendar" render={(props) => {
                      return ( <BookingsCalendar /> )
                    }} />
                    <Route path="/bookings" render={(props) => {
                      return (<Bookings {...props}
                                        currentUserRole={ this.state.currentUserRole} />)
                    }} />
                    <Route path="*" render={(props) => { return <Redirect to='/' /> }} />
                  </Switch>
                }
                else {
                  <Redirect to='/' />
                }
                <Route path="*" render={(props) => { return <Redirect to='/' /> }} />
              </Switch>
            </div>
            <Login setAccessToken={ this.setAccessToken } toggleModal={ this.toggleModal } modalName={ this.state.modalName }/>
            <Footer />
          </div>
        )
      }} />
    );
  }
}
