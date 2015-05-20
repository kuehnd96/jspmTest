/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports["default"] = {
  //- builtin-setup
  _explode: require("./internal/explode"),
  _validation: require("./internal/validation"),
  _hoistDirectives: require("./internal/hoist-directives"),
  "minification.removeDebugger": require("./minification/remove-debugger"),
  "minification.removeConsole": require("./minification/remove-console"),
  "utility.inlineEnvironmentVariables": require("./utility/inline-environment-variables"),
  "minification.inlineExpressions": require("./minification/inline-expressions"),
  "minification.deadCodeElimination": require("./minification/dead-code-elimination"),
  _modules: require("./internal/modules"),
  "spec.functionName": require("./spec/function-name"),

  //- builtin-basic
  // this is where the bulk of the ES6 transformations take place, none of them require traversal state
  // so they can all be concatenated together for performance
  "es7.classProperties": require("./es7/class-properties"),
  "es7.trailingFunctionCommas": require("./es7/trailing-function-commas"),
  "es7.asyncFunctions": require("./es7/async-functions"),
  "es7.decorators": require("./es7/decorators"),
  strict: require("./other/strict"),
  "validation.undeclaredVariableCheck": require("./validation/undeclared-variable-check"),
  "validation.react": require("./validation/react"),
  "es6.arrowFunctions": require("./es6/arrow-functions"),
  "spec.blockScopedFunctions": require("./spec/block-scoped-functions"),
  "optimisation.react.constantElements": require("./optimisation/react.constant-elements"),
  "optimisation.react.inlineElements": require("./optimisation/react.inline-elements"),
  reactCompat: require("./other/react-compat"),
  react: require("./other/react"),
  "es7.comprehensions": require("./es7/comprehensions"),
  "es6.classes": require("./es6/classes"),
  asyncToGenerator: require("./other/async-to-generator"),
  bluebirdCoroutines: require("./other/bluebird-coroutines"),
  "es6.objectSuper": require("./es6/object-super"),
  "es7.objectRestSpread": require("./es7/object-rest-spread"),
  "es7.exponentiationOperator": require("./es7/exponentiation-operator"),
  "es6.spec.templateLiterals": require("./es6/spec.template-literals"),
  "es6.templateLiterals": require("./es6/template-literals"),
  "es5.properties.mutators": require("./es5/properties.mutators"),
  "es6.properties.shorthand": require("./es6/properties.shorthand"),
  "es6.properties.computed": require("./es6/properties.computed"),
  "optimisation.flow.forOf": require("./optimisation/flow.for-of"),
  "es6.forOf": require("./es6/for-of"),
  "es6.regex.sticky": require("./es6/regex.sticky"),
  "es6.regex.unicode": require("./es6/regex.unicode"),
  "es6.constants": require("./es6/constants"),
  "es6.parameters.rest": require("./es6/parameters.rest"),
  "es6.spread": require("./es6/spread"),
  "es6.parameters.default": require("./es6/parameters.default"),
  "es7.exportExtensions": require("./es7/export-extensions"),
  "spec.protoToAssign": require("./spec/proto-to-assign"),
  "es7.doExpressions": require("./es7/do-expressions"),
  "es6.spec.symbols": require("./es6/spec.symbols"),
  "spec.undefinedToVoid": require("./spec/undefined-to-void"),
  jscript: require("./other/jscript"),
  flow: require("./other/flow"),

  //- builtin-advanced
  "es6.destructuring": require("./es6/destructuring"),
  "es6.blockScoping": require("./es6/block-scoping"),
  "es6.spec.blockScoping": require("./es6/spec.block-scoping"),

  // es6 syntax transformation is **forbidden** past this point since regenerator will chuck a massive
  // hissy fit

  //- regenerator
  regenerator: require("./other/regenerator"),

  //- builtin-modules
  runtime: require("./other/runtime"),
  "es6.modules": require("./es6/modules"),
  _moduleFormatter: require("./internal/module-formatter"),

  //- builtin-trailing
  // these clean up the output and do finishing up transformations, it's important to note that by this
  // stage you can't import any new modules or insert new ES6 as all those transformers have already
  // been ran
  "es6.tailCall": require("./es6/tail-call"),
  _shadowFunctions: require("./internal/shadow-functions"),
  "es3.propertyLiterals": require("./es3/property-literals"),
  "es3.memberExpressionLiterals": require("./es3/member-expression-literals"),
  "minification.memberExpressionLiterals": require("./minification/member-expression-literals"),
  "minification.propertyLiterals": require("./minification/property-literals"),
  _blockHoist: require("./internal/block-hoist") };
module.exports = exports["default"];