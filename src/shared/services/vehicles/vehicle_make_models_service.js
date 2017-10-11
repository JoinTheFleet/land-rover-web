import client from '../../libraries/client';
import Service from '../service';

class VehicleMakeModelsService extends Service {
  static get baseURL() {
    return '/api/v1/vehicles/makes/:make_id/models';
  }

  static index(id, params) {
    return client.get(this.baseURL.replace(':make_id', id), {
      params: params
    });
  }
}

export default VehicleMakeModelsService;
