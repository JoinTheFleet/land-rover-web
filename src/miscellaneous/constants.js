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
      signup: 'signup'
    };
  }

  static userRoles() {
    return {
      renter: 'renter',
      owner: 'owner'
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

  static types(){
    return {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      array: 'array'
    };
  }
}
