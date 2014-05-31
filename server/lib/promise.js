var P = require('promised-io/promise');

exports.promiseme = function(fnWithCallback, thisVar, withErrorOnFirstArg) {
  if (typeof thisVar === 'undefined') {
    thisVar = this;
  }
  if (typeof withErrorOnFirstArg === 'undefined' || withErrorOnFirstArg === null) {
    withErrorOnFirstArg = true;
  }
  return function() {
    var args = Array.prototype.slice.call(arguments);
    var deffered = new P.Deferred();
    args.push(function() {
      var args2 = Array.prototype.slice.call(arguments);
      if (withErrorOnFirstArg && args2.length > 0 && args2[0] !== null) {
        deffered.reject(args2[0]);
      } else {
        deffered.resolve(args2);
      }
    });
    fnWithCallback.apply(thisVar, args);
    return deffered.promise;
  };
};
