import Service from '../service';

class ListingPreviewService extends Service {
  static get baseURL() {
    return '/api/v1/listings/preview/';
  }

  static get actions() {
    return {
      // NOTE: Provide full listing hash for this
      create: true
    };
  }
}

export default ListingPreviewService;
