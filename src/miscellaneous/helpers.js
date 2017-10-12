export default class Helpers {
  static pageHeight() {
    let body = document.body,
        html = document.documentElement;

    return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  }

  static windowHeight() {
    return window.innerHeight;
  }

  static windowWidth() {
    return window.innerWidth;
  }

  static extendObject(source, object) {
    let newObject = JSON.parse(JSON.stringify(source));

    Object.keys(object).forEach((key) => ( newObject[key] = object[key] ));

    return newObject;
  }

  static capitalizeString(string) {
    return string[0].toUpperCase() + string.substr(1);
  }
}
