import client from '../../libraries/client';
import Service from '../service';

class BookingSurveyIssuesService extends Service {
  static get baseURL() {
    return '/api/v1/bookings/:booking_id/surveys/:survey_id/issues/';
  }

  static surveyURL(booking_id, survey_id, id) {
    let url = this.baseURL.replace(':booking_id', booking_id).replace(':survey_id', survey_id);

    if (id) {
      url += id;
    }

    return url;
  }

  static index(booking_id, survey_id, params) {
    return client.get(this.surveyURL(booking_id, survey_id), {
      params: params
    });
  }

  static create(booking_id, survey_id, title, caption, image_url) {
    return client.post(this.surveyURL(booking_id, survey_id), {
      title: title,
      caption: caption,
      image_url: image_url
    });
  }

  static destroy(booking_id, survey_id, id) {
    return client.delete(this.surveyURL(booking_id, survey_id, id));
  }
}

export default BookingSurveyIssuesService;
