import Constants from './constants';

const userRoles = Constants.userRoles();

export default class Roles {
  static nextRole(role) {
    return role === userRoles.renter ? userRoles.owner : userRoles.renter;
  }
}
