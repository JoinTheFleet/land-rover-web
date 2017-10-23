import React, { Component } from 'react';

import './App.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-datez/dist/css/react-datez.css';
import 'react-select/dist/react-select.css';
import 'font-awesome/css/font-awesome.min.css';

import Constants from './miscellaneous/constants';
import Header from './components/layout/header';
import HeaderTopMenu from './components/layout/header_top_menu';
import Footer from './components/layout/footer';
import Homescreen from './components/home/homescreen';
import Homefeed from './components/homefeed/homefeed';
import Login from './components/authentication/login';
import Listings from './components/listings/listings';
import UserManagement from './components/user_management/user_management';
import GeolocationService from './shared/services/geolocation_service';
import AuthenticationService from './shared/services/authentication_service';
import LocationsService from './shared/services/locations_service';
import SearchService from './shared/services/search_service';
import client from './shared/libraries/client';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const navigationSections = Constants.navigationSections();
const userRoles = Constants.userRoles();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: cookies.get('accessToken'),
      currentUserRole: userRoles.renter,
      currentSelectedView: navigationSections.home,
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
      showSearchButton: false
    };

    if (this.state.accessToken && this.state.accessToken.length > 0) {
      client.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.accessToken;
    }

    this.toggleModal = this.toggleModal.bind(this);
    this.setAccessToken = this.setAccessToken.bind(this);
    this.changeCurrentUserRole = this.changeCurrentUserRole.bind(this);
    this.locationSearch = this.locationSearch.bind(this);
    this.handleMenuItemSelect = this.handleMenuItemSelect.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleLocationSelect = this.handleLocationSelect.bind(this);
    this.handleLocationFocus = this.handleLocationFocus.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleMapDrag = this.handleMapDrag.bind(this);
    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.handleSortToggle = this.handleSortToggle.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchIfNotShowingSearchButton = this.handleSearchIfNotShowingSearchButton.bind(this);
    this.performSearch = this.performSearch.bind(this);
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

  setAccessToken(accessToken) {
    if (accessToken.length > 0) {
      cookies.remove('accessToken');

      let newState = {
        accessToken: accessToken,
        currentSelectedView: navigationSections.dashboard,
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
  }

  changeCurrentUserRole() {
    this.setState((prevState) => ({
      currentUserRole: (prevState.currentUserRole === userRoles.renter) ? userRoles.owner : userRoles.renter
    }));
  }

  handleMenuItemSelect(menuItem) {
    if (menuItem === navigationSections.logout) {
      AuthenticationService.logout()
                           .then((success) => {
                             this.setAccessToken('');
                           })
                           .catch((error) => {
                             alert(error);
                           });
    }
    else {
      this.setState({
        currentSelectedView: menuItem,
        showSearchButton: menuItem !== navigationSections.dashboard });
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
    let headerTopMenu = '';

    if (this.state.accessToken) {
      headerTopMenu = (<HeaderTopMenu currentMenuItem={ this.state.currentSelectedView }
                                      currentUserRole={ this.state.currentUserRole }
                                      handleMenuItemSelect={ this.handleMenuItemSelect }
                                      loggedIn={ this.state.accessToken && this.state.accessToken.length > 0 } />)
    }

    return headerTopMenu;
  }

  renderMainContent() {
    let viewToRender;

    switch(this.state.currentSelectedView) {
      case navigationSections.profile:
        break;
      case navigationSections.bookings:
        break;
      case navigationSections.messages:
        break;
      case navigationSections.listings:
        viewToRender = (<Listings></Listings>);
        break;
      case navigationSections.account:
        viewToRender = (<UserManagement></UserManagement>)
        break;
      case navigationSections.dashboard:
        viewToRender = (<Homefeed accessToken={ this.state.accessToken }
                                  handleFilterToggle={ this.handleFilterToggle }
                                  handleMapDrag={ this.handleMapDrag }
                                  handlePositionChange={ this.handlePositionChange }
                                  handleSortToggle={ this.handleSortToggle }
                                  sort={ this.state.sort }
                                  listings={ this.state.listings }
                                  location={ this.state.location }
                                  boundingBox={ this.state.boundingBox }
                                  customSearch={ this.state.customSearch }
                                  currentSearch={ this.state.currentSearch } />);
        break;
      default:
        viewToRender = (<Homescreen handleLocationChange={ this.handleLocationChange }
                                    handleLocationFocus={ this.handleLocationFocus }
                                    handleDatesChange={ this.handleDatesChange }
                                    handleLocationSelect={ this.handleLocationSelect }
                                    handleSearch={ this.handleSearch }
                                    startDate={ this.state.startDate }
                                    endDate={ this.state.endDate }
                                    locationName={ this.state.locationName }
                                    searchLocations={ this.state.searchLocations }
                                    showSearchButton={ !this.state.accessToken || this.state.showSearchButton } />);
    }

    return viewToRender;
  }

  handleDatesChange({startDate, endDate}) {
    this.setState({
      startDate: startDate,
      endDate: endDate
    }, () => {
      if (startDate && endDate) {
        this.handleSearchIfNotShowingSearchButton();
      }
    });
  }

  handleLocationSelect(location) {
    this.setState({
      locationName: location.name,
      searchLocations: [],
      customSearch: true,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      boundingBox: location.bounding_box
    }, this.handleSearchIfNotShowingSearchButton);
  }

  handleSearch() {
    this.setState({
      currentSelectedView: navigationSections.dashboard,
      showSearchButton: false
    }, this.performSearch);
  }

  handleSearchIfNotShowingSearchButton() {
    if (!this.state.showSearchButton) {
      this.handleSearch();
    }
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
      search: searchParams
    }).then((response) => {
      this.setState({
        listings: response.data.data.listings,
      });
    })
  }

  handleSortToggle(eventKey, event) {
    this.setState({
      sort: eventKey,
      customSearch: true
    }, this.handleSearch)
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
      location: location,
      boundingBox: boundingBox,
      currentSearch: false
    }, this.handleSearch);
  }

  handleFilterToggle(filters) {
    this.setState({
      filters: filters,
      currentSearch: true
    }, this.handleSearch);
  }

  handleMapDrag(bounds, center) {
    this.setState({
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
    return (
      <div className="App">
        <Header loggedIn={ this.state.accessToken && this.state.accessToken.length > 0 }
                currentUserRole={ this.state.currentUserRole }
                currentMenuItem={ this.state.currentSelectedView }
                handleMenuItemSelect={ this.handleMenuItemSelect }
                toggleModal={ this.toggleModal }
                handleChangeCurrentUserRole={ this.changeCurrentUserRole }
                handleLocationChange={ this.handleLocationChange }
                handleLocationFocus={ this.handleLocationFocus }
                handleDatesChange={ this.handleDatesChange }
                handleLocationSelect={ this.handleLocationSelect }
                handleSearch={ this.handleSearch }
                startDate={ this.state.startDate }
                endDate={ this.state.endDate }
                locationName={ this.state.locationName }
                searchLocations={ this.state.searchLocations }
                hideSearchForm={ false }
                showSearchButton={ this.state.showSearchButton } />

        { this.renderHeaderTopMenu() }

        <div id="main_container" className="col-xs-12 no-side-padding">
          { this.renderMainContent() }
        </div>

        <Login setAccessToken={ this.setAccessToken } toggleModal={ this.toggleModal } modalName={ this.state.modalName }/>

        <Footer />
      </div>
    );
  }
}
