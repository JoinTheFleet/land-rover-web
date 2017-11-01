import Constants from './constants';

const navigationSections = Constants.navigationSections();

export default class Menus {
  static getTopMenuForUserRole(role) {
    let menu = [
      navigationSections.dashboard,
      navigationSections.bookings,
      navigationSections.messages,
      navigationSections.account
    ];

    if (role === 'owner') {
      menu.push(navigationSections.listings);
      menu.push(navigationSections.calendar);
    }

    return menu;
  }

  static getTopMenuDividers() {
    return [ navigationSections.account ];
  }
}
