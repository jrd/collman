// vim:et:sta:sw=2:sts=2:ts=2:tw=0:
/**
 * @param base baseClass, could be null or skipped
 * @param proto object to use as a prototype. A function (with the base constructor and base classs as arguments) that returns an object could be used. This object may have a '__init__' method as a constructor. You can use these arguments to refer to the parent constructor or a parent method.
 */
exports.Class = function(base, proto) {
  if (arguments.length == 1) {
    proto = base;
    base = null;
  }
  var baseProto = base ? base.prototype : null;
  var baseConstructor = baseProto ? baseProto.constructor : null;
  if (typeof(proto) == 'function') {
    proto = proto(baseConstructor, baseProto);
  }
  if ('__init__' in proto) {
    initMethod = proto.__init__;
    delete proto.__init__;
  } else {
    initMethod = function() {};
  }
  if (base) {
    var baseNoConstructor = function() {};  // no op function that can be used as a constructor
    baseNoConstructor.prototype = baseProto;  // inheritence
    initMethod.prototype = new baseNoConstructor();  // new instance of prototype base that can be modified
    initMethod.prototype.constructor = initMethod;  // remove reference to baseNoConstructor
  }
  for (var fnProto in proto) {
    initMethod.prototype[fnProto] = proto[fnProto];
  }
  initMethod.prototype.__parent__ = baseProto;
  return initMethod;
};
