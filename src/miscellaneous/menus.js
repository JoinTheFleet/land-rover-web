import Constants from './constants';

const navigationSections = Constants.navigationSections();

export default class Menus {
  static getTopMenuForUserRole(role, user) {
    let menu = [
      navigationSections.profile,
      navigationSections.listings,
      navigationSections.calendar,
      navigationSections.bookings,
      navigationSections.messages,
      navigationSections.notifications,
      navigationSections.account
    ];

    if (user && user.listing_count === 0) {
      menu.splice(2, 1);
    }

    return menu;
  }
}
