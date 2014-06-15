var P = require('promised-io/promise');

/**
 * @param fnWithCallback function with a callback as last argument
 * @param thisVar 'this' context for the function call
 * @param withErrorOnFirstArg true if the first argument of the callback is the error message/object (true by default)
 * @return a Promise function that will be resolved when the initial callback has been called.
 */
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
        argsCallback.push(this);
        deffered.resolve(argsCallback);
      }
    });
    fnWithCallback.apply(thisVar, args);
    return deffered.promise;
  };
};

/**
 * @param fnWithCallback function with two callbacks as last arguments. The first one is called for each iteration, the last one when the iteration completes. Both are expected to have the error message/object as the first argument. The last callback should have the number of iterations realized in the second argument.
 * @param thisVar 'this' context for the function call
 * @return a Promise function with the callback for each iteration on the last argument. This iteration callback will be called with a fnIterationDone as last argument that should be called when the iteration is fully realized. The promise will be realized when all iterations have been realized and the iteration loop has also been completed. The promise is resolved with the total number of iterations.
 */
exports.promiseEach = function(fnWithCallback, thisVar) {
  if (typeof thisVar === 'undefined') {
    thisVar = this;
  }
  return function() {
    var args = Array.prototype.slice.call(arguments);
    var deffered = new P.Deferred();
    var defferedAll = new P.Deferred();
    defferedAll.promise.then(function(val) {
      deffered.resolve(nbTotal);
    }, function(err) {
      deffered.reject(err);
    });
    var nbTotal = null;
    var nbPassed = 0;
    var fnCheck = function() {
      if (nbTotal !== null && nbPassed === nbTotal) {
        defferedAll.resolve(true);
      }
    };
    var fnIncAndCheck = function() {
      nbPassed++;
      fnCheck();
    };
    var fnEach = args[args.length - 1];
    args[args.length - 1] = function() {
      var argsEach = Array.prototype.slice.call(arguments);
      argsEach.push(fnIncAndCheck);
      if (argsEach[0] !== null) {
        defferedAll.reject(argsEach[0]);
      }
      fnEach.apply(this, argsEach);
    };
    args.push(function() {
      var argsCallback = Array.prototype.slice.call(arguments);
      if (argsCallback[0] !== null) {
        defferedAll.reject(argsCallback[0]);
      } else {
        nbTotal = argsCallback[1];
        fnCheck();
      }
    });
    fnWithCallback.apply(thisVar, args);
    return deffered.promise;
  };
};
