import Service from '../service';

class ListingPreviewService extends Service {
  static get baseURL() {
    return '/api/v1/listings/preview/';
  }

  static get actions() {
    return {
      create: true
    };
  }
}

export default ListingPreviewService;
