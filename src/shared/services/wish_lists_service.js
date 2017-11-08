import client from '../libraries/client';
import Service from './service';

class WishListsService extends Service {
  static get baseURL() {
    return '/api/v1/wish_lists/';
  }

  static get wishListURL() {
    return this.baseURL + ':id/listings/'
  }

  static create(name) {
    return client.post(this.baseURL, {
      wish_list: {
        name: name
      }
    });
  }

  static getListings(id, params) {
    return client.get(this.wishListURL.replace(':id', id), {
      params: params
    });
  }

  static addListing(id, listing_id) {
    return client.post(this.wishListURL.replace(':id', id), {
      listing_id: listing_id
    });
  }

  static destroyListing(id, listing_id) {
    return client.delete(this.wishListURL.replace(':id', id) + listing_id);
  }

  static get actions() {
    return {
      show: true,
      index: true,
      create: true,
      destroy: true
    }
  }
}

export default WishListsService;
