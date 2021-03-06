/* */ 
"format cjs";
"use strict";

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _path = require("./path");

var _path2 = _interopRequireDefault(_path);

var _lodashArrayCompact = require("lodash/array/compact");

var _lodashArrayCompact2 = _interopRequireDefault(_lodashArrayCompact);

var _types = require("../types");

var t = _interopRequireWildcard(_types);

var TraversalContext = (function () {
  function TraversalContext(scope, opts, state, parentPath) {
    _classCallCheck(this, TraversalContext);

    this.parentPath = parentPath;
    this.scope = scope;
    this.state = state;
    this.opts = opts;
  }

  TraversalContext.prototype.shouldVisit = function shouldVisit(node) {
    var keys = t.VISITOR_KEYS[node.type];
    return !!(this.opts.enter || this.opts.exit || this.opts[node.type] || keys && keys.length);
  };

  TraversalContext.prototype.create = function create(node, obj, key) {
    return _path2["default"].get(this.parentPath, this, node, obj, key);
  };

  TraversalContext.prototype.visitMultiple = function visitMultiple(nodes, node, key) {
    // nothing to traverse!
    if (nodes.length === 0) return false;

    var visited = [];

    var queue = this.queue = [];
    var stop = false;

    // build up initial queue
    for (var i = 0; i < nodes.length; i++) {
      var self = nodes[i];
      if (self && this.shouldVisit(self)) {
        queue.push(this.create(node, nodes, i));
      }
    }

    // visit the queue
    for (var i = 0; i < queue.length; i++) {
      var path = queue[i];
      if (visited.indexOf(path.node) >= 0) continue;
      visited.push(path.node);

      path.setContext(this.parentPath, this, path.key);

      if (path.visit()) {
        stop = true;
        break;
      }
    }

    return stop;
  };

  TraversalContext.prototype.visitSingle = function visitSingle(node, key) {
    if (this.shouldVisit(node[key])) {
      return this.create(node, node, key).visit();
    }
  };

  TraversalContext.prototype.visit = function visit(node, key) {
    var nodes = node[key];
    if (!nodes) return;

    if (Array.isArray(nodes)) {
      return this.visitMultiple(nodes, node, key);
    } else {
      return this.visitSingle(node, key);
    }
  };

  return TraversalContext;
})();

exports["default"] = TraversalContext;
module.exports = exports["default"];