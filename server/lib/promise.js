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
      var argsCallback = Array.prototype.slice.call(arguments);
      if (withErrorOnFirstArg && argsCallback.length > 0 && argsCallback[0] !== null) {
        deffered.reject(argsCallback[0]);
      } else {
        deffered.resolve(argsCallback);
      }
    });
    fnWithCallback.apply(thisVar, args);
    return deffered.promise;
  };
};

exports.promisemeOnComplete = function(fnWithCallback, thisVar, withErrorOnFirstArg) {
  if (typeof thisVar === 'undefined') {
    thisVar = this;
  }
  if (typeof withErrorOnFirstArg === 'undefined' || withErrorOnFirstArg === null) {
    withErrorOnFirstArg = true;
  }
  return function() {
    var args = Array.prototype.slice.call(arguments);
    var defferedEach = new P.Deferred();
    var defferedOnComplete = new P.Deferred();
    args.push(function() {
      var argsCallback = Array.prototype.slice.call(arguments);
      if (withErrorOnFirstArg && argsCallback.length > 0 && argsCallback[0] !== null) {
        defferedEach.reject(argsCallback[0]);
      } else {
        defferedEach.resolve(argsCallback);
      }
    });
    args.push(function() {
      var argsOnComplete = Array.prototype.slice.call(arguments);
      if (withErrorOnFirstArg && argsOnComplete.length > 0 && argsOnComplete[0] !== null) {
        defferedOnComplete.reject(argsOnComplete[0]);
      } else {
        defferedOnComplete.resolve(argsOnComplete);
      }
    });
    fnWithCallback.apply(thisVar, args);
    return {
      eachTime: defferedEach.promise,
      onComplete: defferedOnComplete.promise
    };
  };
};
