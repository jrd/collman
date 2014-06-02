'use strict';

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    if (args.length === 1 && args[0] !== null && typeof args[0] === 'object') {
      args = args[0];
    }
    return this.replace(/{([^}]+)}/g, function(match, key) {
      return (typeof args[key] !== 'undefined' ? args[key] : match);
    });
  };
}

