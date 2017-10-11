export default class Constants {
  static navigationSections() {
    return {
      home: 'home',
      listings: 'listings',
      profile: 'profile',
      bookings: 'bookings',
      messages: 'messages',
      account: 'account',
      logout: 'logout',
      login: 'login',
      signup: 'signup',
      calendar: 'calendar',
      dashboard: 'dashboard'
    };
  }

  static userRoles() {
    return {
      renter: 'renter',
      owner: 'owner'
    };
  }

  static listingViews() {
    return {
      index: 'index',
      view: 'view',
      new: 'new',
      edit: 'edit'
    };
  }

  static listingSteps() {
    return {
      registration: 'registration',
      details: 'details',
      location: 'location',
      images: 'images',
      pricing: 'pricing'
    };
  }

  static listingFiltersTypes() {
    let types = Constants.types();

    return {
      type: types.string,
      make: types.string,
      model: types.string,
      year: types.number,
      fuel: types.string,
      transmission: types.string,
      passengers: types.number,
      doors: types.number,
      amenities: types.array
    };
  }

  static types() {
    return {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      array: 'array'
    };
  }

  static stepDirections() {
    return {
      next: 'next',
      previous: 'previous'
    };
  }
}
