export default class Errors {
  static extractErrorMessage(error) {
    if (error && error.response) {
      let response = error.response;

      if (response && response.data && response.data.message) {
        return response.data.message;
      }
    }

    return error;
  }
}
