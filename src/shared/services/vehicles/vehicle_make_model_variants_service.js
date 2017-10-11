import client from '../../libraries/client';
import Service from '../service';

class VehicleMakeModelVariantsService extends Service {
  static get baseURL() {
    return '/api/v1/vehicles/makes/:make_id/models/:model_id/variants/';
  }

  static index(make_id, model_id, params) {
    return client.get(this.baseURL.replace(':make_id', make_id).replace(':model_id', model_id), {
      params: params
    });
  }
}

export default VehicleMakeModelVariantsService;
