/* */ 
"format cjs";
"use strict";

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _types = require("../../../types");

var t = _interopRequireWildcard(_types);

function loose(node, body, objId) {
  for (var i = 0; i < node.properties.length; i++) {
    var prop = node.properties[i];

    body.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(objId, prop.key, prop.computed || t.isLiteral(prop.key)), prop.value)));
  }
}

function spec(node, body, objId, initProps, file) {
  var props = node.properties;

  // add all non-computed properties and `__proto__` properties to the initializer

  var broken = false;

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];

    if (prop.computed) {
      broken = true;
    }

    if (prop.kind !== "init" || !broken || t.isLiteral(t.toComputedKey(prop, prop.key), { value: "__proto__" })) {
      initProps.push(prop);
      props[i] = null;
    }
  }

  // add a simple assignment for all Symbol member expressions due to symbol polyfill limitations
  // otherwise use Object.defineProperty

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    if (!prop) continue;

    var key = prop.key;
    if (t.isIdentifier(key) && !prop.computed) {
      key = t.literal(key.name);
    }

    var bodyNode = t.callExpression(file.addHelper("define-property"), [objId, key, prop.value]);

    body.push(t.expressionStatement(bodyNode));
  }

  // only one node and it's a Object.defineProperty that returns the object

  if (body.length === 1) {
    var first = body[0].expression;

    if (t.isCallExpression(first)) {
      first.arguments[0] = t.objectExpression(initProps);
      return first;
    }
  }
}

var ObjectExpression = {
  exit: function exit(node, parent, scope, file) {
    var hasComputed = false;

    var _arr = node.properties;
    for (var _i = 0; _i < _arr.length; _i++) {
      var prop = _arr[_i];
      hasComputed = t.isProperty(prop, { computed: true, kind: "init" });
      if (hasComputed) break;
    }

    if (!hasComputed) return;

    var initProps = [];
    var objId = scope.generateUidBasedOnNode(parent);

    //

    var body = [];

    //

    var callback = spec;
    if (file.isLoose("es6.properties.computed")) callback = loose;

    var result = callback(node, body, objId, initProps, file);
    if (result) return result;

    //

    body.unshift(t.variableDeclaration("var", [t.variableDeclarator(objId, t.objectExpression(initProps))]));

    body.push(t.expressionStatement(objId));

    return body;
  }
};
exports.ObjectExpression = ObjectExpression;