import client from '../libraries/client';
import Service from './service';

class IdentificationsService extends Service {
  static get baseURL() {
    return '/api/v1/users/me/identifications';
  }

  static create(license_number, issue_month, issue_year, drivers_license_type_id, country_of_issue, front_image_url, back_image_url) {
    let params = {
      license_number: license_number,
      issue_month: issue_month,
      issue_year: issue_year,
      drivers_license_type_id: drivers_license_type_id,
      country_of_issue: country_of_issue,
      front_image_url: front_image_url,
      back_image_url: back_image_url
    }

    if (country_of_issue) {
      params.country_of_issue = country_of_issue;
    }

    return client.post(this.baseURL, {
      identification: params
    });
  }

  static get actions() {
    return {
      create: true,
      destroy: true
    }
  }
}

export default IdentificationsService;
