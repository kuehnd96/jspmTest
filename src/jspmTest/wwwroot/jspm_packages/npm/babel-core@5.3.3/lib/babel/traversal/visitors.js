/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.explode = explode;
exports.verify = verify;
exports.merge = merge;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _pathVirtualTypes = require("./path/virtual-types");

var virtualTypes = _interopRequireWildcard(_pathVirtualTypes);

var _messages = require("../messages");

var messages = _interopRequireWildcard(_messages);

var _types = require("../types");

var t = _interopRequireWildcard(_types);

var _esquery = require("esquery");

var _esquery2 = _interopRequireDefault(_esquery);

function explode(visitor, mergeConflicts) {
  if (visitor._exploded) return visitor;
  visitor._exploded = true;

  // make sure there's no __esModule type since this is because we're using loose mode
  // and it sets __esModule to be enumerable on all modules :(
  delete visitor.__esModule;

  if (visitor.queries) {
    ensureEntranceObjects(visitor.queries);
    addQueries(visitor);
    delete visitor.queries;
  }

  // ensure visitors are objects
  ensureEntranceObjects(visitor);

  // add type wrappers
  for (var nodeType in visitor) {
    if (shouldIgnoreKey(nodeType)) continue;

    var wrapper = virtualTypes[nodeType];
    if (!wrapper) continue;

    // wrap all the functions
    var fns = visitor[nodeType];
    for (var type in fns) {
      fns[type] = wrapCheck(wrapper, fns[type]);
    }

    // clear it from the visitor
    delete visitor[nodeType];

    if (wrapper.type) {
      // merge the visitor if necessary or just put it back in
      if (visitor[wrapper.type]) {
        mergePair(visitor[wrapper.type], fns);
      } else {
        visitor[wrapper.type] = fns;
      }
    } else {
      mergePair(visitor, fns);
    }
  }

  // add aliases
  for (var nodeType in visitor) {
    if (shouldIgnoreKey(nodeType)) continue;

    var fns = visitor[nodeType];

    var aliases = t.FLIPPED_ALIAS_KEYS[nodeType];
    if (!aliases) continue;

    // clear it form the visitor
    delete visitor[nodeType];

    var _arr = aliases;
    for (var _i = 0; _i < _arr.length; _i++) {
      var alias = _arr[_i];
      var existing = visitor[alias];
      if (existing) {
        if (mergeConflicts) {
          mergePair(existing, fns);
        }
      } else {
        visitor[alias] = fns;
      }
    }
  }

  return visitor;
}

function verify(visitor) {
  if (visitor._verified) return;

  if (typeof visitor === "function") {
    throw new Error(messages.get("traverseVerifyRootFunction"));
  }

  for (var nodeType in visitor) {
    if (shouldIgnoreKey(nodeType)) continue;

    if (t.TYPES.indexOf(nodeType) < 0 && !virtualTypes[nodeType]) {
      throw new Error(messages.get("traverseVerifyNodeType", nodeType));
    }

    var visitors = visitor[nodeType];
    if (typeof visitors === "object") {
      for (var visitorKey in visitors) {
        if (visitorKey === "enter" || visitorKey === "exit") continue;
        throw new Error(messages.get("traverseVerifyVisitorProperty", nodeType, visitorKey));
      }
    }
  }

  visitor._verified = true;
}

function merge(visitors) {
  var rootVisitor = {};

  var _arr2 = visitors;
  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    var visitor = _arr2[_i2];
    for (var type in visitor) {
      var nodeVisitor = rootVisitor[type] = rootVisitor[type] || {};
      mergePair(nodeVisitor, visitor[type]);
    }
  }

  return rootVisitor;
}

function ensureEntranceObjects(obj) {
  for (var key in obj) {
    if (shouldIgnoreKey(key)) continue;

    var fns = obj[key];
    if (typeof fns === "function") {
      obj[key] = { enter: fns };
    }
  }
}

function addQueries(visitor) {
  for (var selector in visitor.queries) {
    var fns = visitor.queries[selector];
    addSelector(visitor, selector, fns);
  }
}

function addSelector(visitor, selector, fns) {
  selector = _esquery2["default"].parse(selector);

  var _loop = function () {
    var fn = fns[key];
    fns[key] = function (node) {
      if (_esquery2["default"].matches(node, selector, this.getAncestry())) {
        return fn.apply(this, arguments);
      }
    };
  };

  for (var key in fns) {
    _loop();
  }

  mergePair(visitor, fns);
}

function wrapCheck(wrapper, fn) {
  return function () {
    if (wrapper.checkPath(this)) {
      return fn.apply(this, arguments);
    }
  };
}

function shouldIgnoreKey(key) {
  // internal/hidden key
  if (key[0] === "_") return true;

  // ignore function keys
  if (key === "enter" || key === "exit" || key === "shouldSkip") return true;

  // ignore other options
  if (key === "blacklist" || key === "noScope") return true;

  return false;
}

function mergePair(dest, src) {
  for (var key in src) {
    dest[key] = (dest[key] || []).concat(src[key]);
  }
}