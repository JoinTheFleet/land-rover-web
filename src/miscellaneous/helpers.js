export default class Helpers {
  static pageHeight(){
    let body = document.body,
        html = document.documentElement;

    return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  }

  static windowHeight(){
    return window.innerHeight;
  }

  static windowWidth(){
    return window.innerWidth;
  }

  static extendObject(source, object) {
    Object.keys(object).forEach((key) => { source[key] = object[key]; });
    return source;
  }

  static capitalizeString(string) {
    return string[0].toUpperCase() + string.substr(1);
  }
}
