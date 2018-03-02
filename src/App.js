import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import './App.css';
import 'react-dates/initialize';

import Alert from 'react-s-alert';
import branch from 'branch-sdk';
import Cookies from 'universal-cookie';
import EventEmitter from 'eventemitter3';

import Constants from './miscellaneous/constants';
import Helpers from './miscellaneous/helpers';

import Alerts from './components/alerts/alerts';
import Header from './components/layout/header';
import HeaderTopMenu from './components/layout/header_top_menu';
import Footer from './components/layout/footer';
import Homescreen from './components/home/homescreen';
import Homefeed from './components/homefeed/homefeed';
import Login from './components/authentication/login';
import Listings from './components/listings/listings';
import Bookings from './components/bookings/bookings';

import RenterInformation from './components/information/renter_information';
import OwnerInformation from './components/information/owner_information';

import UserManagement from './components/user_management/user_management';
import BookingsCalendar from './components/bookings/bookings_calendar';
import MessagingController from './components/messaging/messaging_controller';
import UserController from './components/users/user_controller';
import DashboardController from './components/dashboard/dashboard_controller';
import NotificationsController from './components/notifications/notifications_controller';
import WishListModal from './components/wishlists/wish_list_modal';
import ConfirmationModal from './components/miscellaneous/confirmation_modal';

import ConfigurationService from "./shared/services/configuration_service";
import GeolocationService from './shared/services/geolocation_service';
import AuthenticationService from './shared/services/authentication_service';
import LocationsService from './shared/services/locations_service';
import SearchService from './shared/services/search_service';
import WishListsService from './shared/services/wish_lists_service';
import NotificationsService from './shared/services/notifications_service';

import client from './shared/libraries/client';
import LocalizationService from './shared/libraries/localization_service';

import ReactFacebookPixel from 'react-facebook-pixel';
import GoogleTagManager from './shared/external/google_tag_manager';

const cookies = new Cookies();
const navigationSections = Constants.navigationSections();
const userRoles = Constants.userRoles();
const ALERT_OPTIONS = {
  position: 'top',
  theme: 'dark',
  timeout: 10000,
  effect: 'stackslide',
  stack: {
    limit: 2
  }
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.eventEmitter = new EventEmitter();

    const defaultLocation = {
      latitude: 0,
      longitude: 0
    };

    this.state = {
      accessToken: cookies.get('accessToken'),
      configuration: undefined,
      currentUserRole: cookies.get('currentUserRole') || userRoles.renter,
      showAlerts: false,
      listings: [],
      searchLocations: [],
      locationName: '',
      currentSearch: false,
      customSearch: false,
      modalName: undefined,
      startDate: undefined,
      endDate: undefined,
      defaultLocation: defaultLocation,
      location: defaultLocation,
      loadings: {
        homefeed: false
      },
      boundingBox: undefined,
      sort: 'distance',
      viewsProps: {},
      wishListModalOpen: false,
      limit: 20,
      page: 0,
      pages: 1,
      pendingNotificationRequest: false
    };

    if (this.state.accessToken && this.state.accessToken.length > 0) {
      client.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.accessToken;
    }

    this.setupEvents = this.setupEvents.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleMapDrag = this.handleMapDrag.bind(this);
    this.performSearch = this.performSearch.bind(this);
    this.setAccessToken = this.setAccessToken.bind(this);
    this.handleReferral = this.handleReferral.bind(this);
    this.locationSearch = this.locationSearch.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSortToggle = this.handleSortToggle.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.hideSearchResults = this.hideSearchResults.bind(this);
    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.toggleWishListModal = this.toggleWishListModal.bind(this);
    this.handleLocationFocus = this.handleLocationFocus.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleLocationSelect = this.handleLocationSelect.bind(this);
    this.handlePromotedLocationSelect = this.handlePromotedLocationSelect.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
    this.changeCurrentUserRole = this.changeCurrentUserRole.bind(this);
    this.addedWishListToListing = this.addedWishListToListing.bind(this);
    this.removeWishListFromListing = this.removeWishListFromListing.bind(this);
    this.removedWishListFromListing = this.removedWishListFromListing.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  componentWillMount() {
    ReactFacebookPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID);
    ReactFacebookPixel.pageView();
  }

  componentDidMount() {
    setTimeout(() => {
      GeolocationService.getCurrentPosition()
                        .then(position => {
                          let location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                          };

                          this.setState({ defaultLocation: location, location: location });
                        });
    }, 1000);

    setInterval(() => {
      let token = cookies.get('accessToken');

      if (token && !this.state.pendingNotificationRequest) {
        this.setState({
          pendingNotificationRequest: true
        }, () => {
          NotificationsService.unreadCount()
                              .then(response => {
                                if (response && response.data && response.data.data) {
                                  let count = response.data.data.count;

                                  this.setState({ pendingNotificationRequest: false})

                                  this.eventEmitter.emit('UPDATED_NOTIFICATIONS_COUNT', count);
                                }
                              })
                              .catch(() => {
                                this.setState({ pendingNotificationRequest: false})
                              });
        });
      }
      
    }, 5000)

    branch.init(process.env.REACT_APP_BRANCH_KEY);
    this.setupEvents();

    ConfigurationService.show()
                        .then(response => {
                          this.setState({ configuration: response.data.data.configuration });
                        })
                        .catch(error => { Alert.error(LocalizationService.formatMessage('configurations.could_not_fetch')); });
  }

  clearFilters() {
    this.setState({ filters: undefined });
  }

  setupEvents() {
    this.eventEmitter.on('REMOVED_LISTING_WISHLIST', this.removedWishListFromListing);
    this.eventEmitter.on('ADDED_LISTING_WISHLIST', this.addedWishListToListing);
  }

  addedWishListToListing(options, error) {
    if (options && options.listingID && options.wishListID) {
      let listings = this.state.listings;
      let listing = this.state.listings.find((listing) => {
        return listing.id === options.listingID;
      });

      if (listing) {
        listing.wish_lists.push(options.wishListID);

        this.setState({ listings: listings });
      }
    }
  }

  removeWishListFromListing(options, error) {
    if (options && options.listingID && options.wishListID) {
      WishListsService.destroyListing(options.wishListID, options.listingID)
                      .then(response => {
                        this.eventEmitter.emit('REMOVED_LISTING_WISHLIST', options);
                        Alert.success(LocalizationService.formatMessage('wish_lists.successfully_removed'));
                      })
                      .catch(error => { Alert.error(error.response.data.message); });
    }
  }

  removedWishListFromListing(options, error) {
    if (options && options.listingID && options.wishListID) {
      let listings = this.state.listings;
      let listing = this.state.listings.find((listing) => {
        return listing.id === options.listingID;
      });

      if (listing) {
        let wishListIndex = listing.wish_lists.findIndex((wishListID) => {
          return wishListID === options.wishListID;
        });

        if (wishListIndex >= 0) {
          listing.wish_lists.splice(wishListIndex, 1);

          this.setState({ listings: listings });
        }
      }
    }
  }

  handleReferral(referralCode) {
    if (!this.state.referralCode) {
      this.setState({
        referralCode: referralCode
      }, () => {
        AuthenticationService.logout()
                             .then(() => {
                               this.setAccessToken('');
                               this.toggleModal('registration');
                             })
                             .catch(() => {
                               this.setAccessToken('');
                               this.toggleModal('registration');
                             });
      });
    }
  }

  setAccessToken(accessToken) {
    cookies.remove('accessToken', {
      path: '/'
    });

    if (accessToken.length > 0) {
      let newState = {
        accessToken: accessToken,
        showAlerts: true,
        modalName: undefined
      };

      if (accessToken.length > 0) {
        cookies.set('accessToken', accessToken, {
          path: '/',
          secure: window.location.hostname !== 'localhost',
          maxAge: 86400 * 7
        });

        client.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
      }
      else {
        cookies.remove('accessToken', {
          path: '/'
        });
        delete client.defaults.headers.common['Authorization'];
      }

      this.setState(newState);
    }
    else {
      if (client.defaults.headers.common) {
        delete client.defaults.headers.common['Authorization'];
      }

      this.setState({
        accessToken: undefined
      });
    }
  }

  hideSearchResults() {
    this.setState({ searchLocations: [] });
  }

  changeCurrentUserRole() {
    let newRole = (this.state.currentUserRole === userRoles.renter) ? userRoles.owner : userRoles.renter;

    this.setState((prevState) => ({
      currentUserRole: newRole
    }), () => {
      cookies.set('currentUserRole', newRole);
    });
  }

  handleLogOut() {
    AuthenticationService.logout()
                         .then(() => { this.setAccessToken(''); })
                         .catch(() => { this.setAccessToken(''); });
                         this.setAccessToken('');
  }

  toggleModal(modal) {
    if (this.state.modalName === modal) {
      this.setState({ modalName: undefined });
    }
    else {
      this.setState({ modalName: modal });
    }
  }

  toggleWishListModal(listing) {
    if (listing) {
      let wishLists = listing.wish_lists;

      if (wishLists && wishLists.length > 0) {
        this.removeWishListFromListing({ listingID: listing.id, wishListID: listing.wish_lists[0] });
      }
      else {
        this.setState({ wishListModalOpen: true, wishListListing: listing });
      }
    }
    else {
      this.setState({ wishListModalOpen: false, wishListListing: undefined });
    }
  }

  renderHeaderTopMenu() {
    return (
      <HeaderTopMenu currentUserRole={ this.state.currentUserRole }
                     eventEmitter={ this.eventEmitter }
                     loggedIn={ typeof this.state.accessToken !== 'undefined' && this.state.accessToken.length > 0 } />
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

  handlePromotedLocationSelect(location) {
    this.setState({
      defaultLocation: location,
      location: location,
      locationName: location.address,
      customSearch: true,
      pages: 1,
      page: 0,
      boundingBox: undefined
    }, this.performSearch);
  }

  handleLocationSelect(location) {
    this.setState({
      locationName: location.address,
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
    let loadings = this.state.loadings;
    let location = this.state.location;
    let boundingBox = this.state.boundingBox;
    let filters = this.state.filters;
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;
    let searchParams = { sort: this.state.sort };

    loadings.homefeed = true;

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

    this.setState({ loadings: loadings }, () => {
      SearchService.create({
        search: searchParams,
        limit: this.state.limit,
        offset: this.state.page * this.state.limit
      }).then((response) => {
        loadings.homefeed = false;

        this.setState({
          loadings: loadings,
          listings: response.data.data.listings,
          pages: Math.ceil(response.data.data.total_count / this.state.limit)
        });
      })
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
    let term = event.target.value;
    let location = term !== '' ? this.state.location : this.state.defaultLocation;
    let latitude = location ? location.latitude : undefined;
    let longitude = location ? location.longitude : undefined;
    let locationTimeout = this.state.locationTimeout;

    if (locationTimeout) {
      clearTimeout(locationTimeout);
      locationTimeout = undefined;
    }

    if (Helpers.pageWidth() < 768 && (!term || term === '')) {
      this.setState({
        locationName: term,
        location: location,
        searchLocations: []
      })
    }
    else {
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
        location: location,
        locationTimeout: locationTimeout
      });
    }
  }

  render() {
    const alerts = this.state.showAlerts ? (<Alerts />) : '';
    const disableSearchButton = this.state.searchLocations.length > 0 && this.state.locationName !== '' && this.state.location === this.state.defaultLocation;
    let mainRouter = (<Redirect to="/" />);

    if (this.state.accessToken && this.state.accessToken.length > 0) {
      mainRouter = (
        <Switch>
          <Route exact path="/home" render={() => <Redirect to="/" /> } />
          <Route path="/messages" render={(props) => {
            return (<MessagingController {...props}
                                        changeCurrentUserRole={ this.changeCurrentUserRole }
                                        role={ this.state.currentUserRole } />)
          }} />
          <Route path="/listings" render={(props) => {
            return (<Listings {...props}
                              configurations={ this.state.configuration }
                              currentUserRole={ this.state.currentUserRole }
                              loggedIn={ typeof this.state.accessToken !== 'undefined' && this.state.accessToken.length > 0 } />)
          }} />
          <Route path="/settings" render={(props) => {
            return (<UserManagement {...props}
                                    currentUserRole={ this.state.currentUserRole} />)
          }} />
          <Route path="/calendar" render={(props) => {
            return ( <BookingsCalendar /> )
          }} />
          <Route path="/bookings" render={(props) => {
            return (<Bookings {...props}
                              configurations={ this.state.configuration }
                              currentUserRole={ this.state.currentUserRole}
                              changeCurrentUserRole={ this.changeCurrentUserRole } />)
          }} />
          <Route path='/profile' render={ (props) => {
            return <DashboardController {...props} configuration={ this.state.configuration } />
          }} />
          <Route path='/notifications' component={ NotificationsController } />
          <Route path="*" render={(props) => { return <Redirect to='/' /> }} />
        </Switch>
      );
    }

    return (
      <Route path="/" render={(props) => {
        return (
          <div className="App">
            <GoogleTagManager gtmID={ process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID } />
            <Alert {...ALERT_OPTIONS} />
            <Header loggedIn={ this.state.accessToken && this.state.accessToken.length > 0 }
                    currentUserRole={ this.state.currentUserRole }
                    toggleModal={ this.toggleModal }
                    handleChangeCurrentUserRole={ this.changeCurrentUserRole }
                    handleLocationChange={ this.handleLocationChange }
                    handleLocationFocus={ this.handleLocationFocus }
                    handleDatesChange={ this.handleDatesChange }
                    handleLocationSelect={ this.handleLocationSelect }
                    handleSearch={ this.performSearch }
                    startDate={ this.state.startDate }
                    endDate={ this.state.endDate }
                    eventEmitter={ this.eventEmitter }
                    locationName={ this.state.locationName }
                    hideSearchResults={ this.hideSearchResults }
                    searchLocations={ this.state.searchLocations }
                    hideSearchForm={ props.location.pathname === '/' }
                    disableSearchButton={ disableSearchButton }
                    showSearchButton={ true } />

            { this.renderHeaderTopMenu() }

            <div id="main_container" className="col-xs-12 no-side-padding">
              <Switch>
                <Route exact path="/" render={(props) => {
                  return <Homescreen {...props}
                                      handleReferral={ this.handleReferral }
                                      currentUserRole={ this.state.currentUserRole }
                                      handleLocationChange={ this.handleLocationChange }
                                      handleLocationFocus={ this.handleLocationFocus }
                                      handleDatesChange={ this.handleDatesChange }
                                      handleLocationSelect={ this.handleLocationSelect }
                                      handleSearch={ this.performSearch }
                                      clearFilters={ this.clearFilters }
                                      startDate={ this.state.startDate }
                                      endDate={ this.state.endDate }
                                      locationName={ this.state.locationName }
                                      hideSearchResults={ this.hideSearchResults }
                                      searchLocations={ this.state.searchLocations }
                                      showSearchButton={ true }
                                      disableSearchButton={ disableSearchButton }
                                      toggleWishListModal={ this.toggleWishListModal } />
                }} />

                <Route exact path='/renters' render={(props) => {
                  return <RenterInformation {...props} toggleModal={ this.toggleModal } />
                }  } />
                <Route exact path='/owners' render={(props) => {
                  return <OwnerInformation {...props} toggleModal={ this.toggleModal } />
                }  } />

                <Route exact path='/listings/new' render={(props) => {
                  if (!this.state.accessToken) {
                    let alertInterval = undefined;

                    alertInterval = setInterval(() => {
                      Alert.error(LocalizationService.formatMessage('application.must_be_logged_in'));
                      clearInterval(alertInterval);
                    }, 1000);

                    return <Redirect to='/' />;
                  }
                  else {
                    return mainRouter;
                  }
                }} />

                <Route path="/referral/:referral_code" render={(props) => {
                  return <Homescreen {...props}
                                      handleReferral={ this.handleReferral }
                                      currentUserRole={ this.state.currentUserRole }
                                      handleLocationChange={ this.handleLocationChange }
                                      handleLocationFocus={ this.handleLocationFocus }
                                      handleDatesChange={ this.handleDatesChange }
                                      handleLocationSelect={ this.handleLocationSelect }
                                      handleSearch={ this.performSearch }
                                      clearFilters={ this.clearFilters }
                                      startDate={ this.state.startDate }
                                      endDate={ this.state.endDate }
                                      locationName={ this.state.locationName }
                                      hideSearchResults={ this.hideSearchResults }
                                      searchLocations={ this.state.searchLocations }
                                      showSearchButton={ true }
                                      disableSearchButton={ disableSearchButton }
                                      toggleWishListModal={ this.toggleWishListModal } />
                }} />

                <Route path="/listings/:id" render={(props) => {
                  return (<Listings {...props}
                                    configurations={ this.state.configuration }
                                    currentUserRole={ this.state.currentUserRole }
                                    toggleModal={ this.toggleModal }
                                    loggedIn={ typeof this.state.accessToken !== 'undefined' && this.state.accessToken.length > 0 } />)
                }} />

                <Route path="/search" render={(props) => {
                  return (
                    <Homefeed {...props}
                              toggleWishListModal={ this.toggleWishListModal }
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
                              page={ this.state.page + 1 }
                              eventEmitter={ this.eventEmitter }
                              loading={ this.state.loadings.homefeed } />
                  )
                }} />
                <Route path='/users/:id' component={ UserController } />

                { mainRouter }

                <Route path="*" render={(props) => { return <Redirect to='/' /> }} />
              </Switch>
            </div>
            <Login setAccessToken={ this.setAccessToken } referralCode={ this.state.referralCode } toggleModal={ this.toggleModal } modalName={ this.state.modalName === navigationSections.logout ? undefined : this.state.modalName }/>
            <WishListModal open={ this.state.wishListModalOpen } listing={ this.state.wishListListing || {} } toggleModal={ this.toggleWishListModal } performSearch={ this.performSearch } eventEmitter={ this.eventEmitter } />
            <Footer loggedIn={ this.state.accessToken && this.state.accessToken.length > 0 } toggleModal={ this.toggleModal } search={ this.handlePromotedLocationSelect } />

            <ConfirmationModal open={ this.state.modalName === navigationSections.logout }
                               modalName={ navigationSections.logout }
                               toggleModal={ this.toggleModal }
                               confirmationAction={ this.handleLogOut }
                               title={ LocalizationService.formatMessage('authentication.confirm_log_out') } >
              { LocalizationService.formatMessage('authentication.confirm_log_out_text') }
            </ConfirmationModal>

            { alerts }
          </div>
        )
      }} />
    );
  }
}