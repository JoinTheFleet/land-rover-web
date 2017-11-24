import Constants from './constants';

const navigationSections = Constants.navigationSections();

export default class Menus {
  static getTopMenuForUserRole(role, user) {
    let menu = [
      navigationSections.profile,
      navigationSections.bookings,
      navigationSections.messages,
      navigationSections.notifications,
      navigationSections.account,
      navigationSections.listings
    ];

    if (user && user.listing_count > 0) {
      menu.push(navigationSections.calendar);
    }

    return menu;
  }

  static getTopMenuDividers() {
    return [ navigationSections.account ];
  }
}
