import Constants from './constants';

const navigationSections = Constants.navigationSections();
const userRoles = Constants.userRoles;

export default class Menus {
  static getTopMenuForUserRole(role) {
    let menu = [
      navigationSections.dashboard,
      navigationSections.bookings,
      navigationSections.messages,
      navigationSections.account,
      navigationSections.listings,
      navigationSections.calendar
    ];

    if (role === userRoles.owner) {
      menu.push(navigationSections.calendar);
    }

    return menu;
  }

  static getTopMenuDividers() {
    return [ navigationSections.account ];
  }
}
