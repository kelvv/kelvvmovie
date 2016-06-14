'use strict'
String.prototype.UnicoToUtf8  = function() {
    let str = this.toString();
    var result = str.replace(/\\/g, "%");
    return unescape(result);
}