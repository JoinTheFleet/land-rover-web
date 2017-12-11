export default class Helpers {
  static pageHeight() {
    let body = document.body,
        html = document.documentElement;

    return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  }

  static pageWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
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

  static detectObjectValue(object, possibleKeys) {
    let value;

    for(let i = 0; i < possibleKeys.length; i++) {
      if (!object[possibleKeys[i]]) {
        continue;
      }

      if (object[possibleKeys[i]].toString().length > 0) {
        value = object[possibleKeys[i]];
      }
    }

    return value;
  }

  static dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  }
}
