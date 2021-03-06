/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.Flow = Flow;
exports.ClassProperty = ClassProperty;
exports.Class = Class;
exports.Func = Func;
exports.TypeCastExpression = TypeCastExpression;
exports.ImportDeclaration = ImportDeclaration;
exports.ExportDeclaration = ExportDeclaration;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _types = require("../../../types");

var t = _interopRequireWildcard(_types);

function Flow(node) {
  this.remove();
}

function ClassProperty(node) {
  node.typeAnnotation = null;
}

function Class(node) {
  node["implements"] = null;
}

function Func(node) {
  for (var i = 0; i < node.params.length; i++) {
    var param = node.params[i];
    param.optional = false;
  }
}

function TypeCastExpression(node) {
  return node.expression;
}

function ImportDeclaration(node) {
  if (node.isType) this.remove();
}

function ExportDeclaration(node) {
  if (this.get("declaration").isTypeAlias()) this.remove();
}