import Service from '../service';

class TopSellersService extends Service {
  static get baseURL() {
    return '/api/v1/listings/top_sellers';
  }

  static get actions() {
    return {
      index: true
    }
  }
}

export default TopSellersService;
