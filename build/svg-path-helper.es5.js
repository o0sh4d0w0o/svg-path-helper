/*
 * svg-path-helper.js v1.0.0
 * Copyright © 2023 o0sh4d0w0o
 * Released under the MIT license
 * @copyright
*/
this["src/js/svg-path-helper"] = this["src/js/svg-path-helper"] || {};
this["src/js/svg-path-helper"].js = (function () {
  'use strict';

  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
        result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var SVG_NS = "http://www.w3.org/2000/svg";
  function createSVGElement(type) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var elem = document.createElementNS(SVG_NS, type);
    for (var _i = 0, _Object$entries = Object.entries(attributes); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];
      elem.setAttribute(key, value);
    }
    return elem;
  }
  function getRandomID() {
    var datePart = Date.now().toString(36);
    var pseudoRandomPart = Math.random().toString(36).replace(/0?\./g, "");
    var strongRandomPart = crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);
    return pseudoRandomPart + datePart + strongRandomPart;
  }
  function fixNumber(num) {
    var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
    return parseFloat(num.toFixed(decimal));
  }
  function getSvgParents(svg) {
    var svgParents = [];
    var currentElement = svg.parentElement;
    while (currentElement) {
      if (currentElement.tagName.toLowerCase() === "svg") {
        svgParents.push(currentElement);
      }
      currentElement = currentElement.parentElement;
    }
    return svgParents;
  }
  function calculateScaleAndOffset(element) {
    var style = window.getComputedStyle(element);
    var bounding = element.getBoundingClientRect();
    var viewBox = element.getAttribute("viewBox");
    var styleWidth = parseFloat(style.width);
    var styleHeight = parseFloat(style.height);
    if (!viewBox) {
      return {
        scale: {
          x: 1,
          y: 1
        },
        offset: {
          x: 0,
          y: 0
        },
        bounding: bounding
      };
    }
    var _viewBox$split$map = viewBox.split(" ").map(Number),
      _viewBox$split$map2 = _slicedToArray(_viewBox$split$map, 4),
      minX = _viewBox$split$map2[0],
      minY = _viewBox$split$map2[1],
      vbWidth = _viewBox$split$map2[2],
      vbHeight = _viewBox$split$map2[3];
    var aspectRatioAttr = element.getAttribute("preserveAspectRatio");
    var aspectRatio = aspectRatioAttr ? aspectRatioAttr.trim() : "xMidYMid meet";
    var width = element.width.baseVal.value;
    var height = element.height.baseVal.value;
    if (styleWidth !== width && style.width !== "auto" && style.width !== "") {
      width = styleWidth;
    }
    if (styleHeight !== height && style.height !== "auto" && style.height !== "") {
      height = styleHeight;
    }
    var noAspect = aspectRatio.includes("none");
    if (noAspect) {
      return {
        scale: {
          x: vbWidth / width,
          y: vbHeight / height
        },
        offset: {
          x: 0,
          y: 0
        },
        bounding: bounding
      };
    }
    var sliceScale = aspectRatio.includes("slice");
    var viewBoxRatio = vbWidth / vbHeight;
    var boundingRatio = width / height;
    var overflow = viewBoxRatio > boundingRatio;
    var defaultScale = overflow ? vbWidth / width : vbHeight / height;
    var altScale = overflow ? vbHeight / height : vbWidth / width;
    var scaleX = sliceScale ? altScale : defaultScale;
    var scaleY = sliceScale ? altScale : defaultScale;
    var alignments = {
      xMin: 0,
      xMid: (vbWidth - width * scaleX) / 2,
      xMax: vbWidth - width * scaleX,
      yMin: 0,
      yMid: (vbHeight - height * scaleY) / 2,
      yMax: vbHeight - height * scaleY
    };
    var match = aspectRatio.match(/x(Min|Mid|Max)Y(Min|Mid|Max)/);
    var xAlign = match[1] || "Mid";
    var yAlign = match[2] || "Mid";
    return {
      scale: {
        x: scaleX,
        y: scaleY
      },
      offset: {
        x: minX + alignments["x".concat(xAlign)],
        y: minY + alignments["y".concat(yAlign)]
      },
      bounding: bounding
    };
  }
  function rotatePoint(point, angle, distance) {
    var radAngle = (angle - 90) * (Math.PI / 180);
    return {
      x: point.x + distance * Math.cos(radAngle),
      y: point.y + distance * Math.sin(radAngle)
    };
  }
  function getAngle(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var angle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90) % 360;
    return angle < 0 ? angle + 360 : angle;
  }
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    } else {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        var successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      } catch (err) {
        document.body.removeChild(textarea);
        return Promise.reject(err);
      }
    }
  }

  var COMMANDS_REGEX = {
    GET: /[MLHVCSQTAZ]\s?(?:(?:-?[0-9]*\.?[0-9]+)?(?:\s|$)?)+/gi,
    RELATIVE: /[mlhvcsqtaz]/,
    PARAMS: /-?[0-9]*\.?[0-9]+/g
  };
  var PARAMS_MAP = {
    M: ["x", "y"],
    L: ["x", "y"],
    T: ["x", "y"],
    H: ["x"],
    V: ["y"],
    S: ["x1", "y1", "x", "y"],
    Q: ["x1", "y1", "x", "y"],
    C: ["x1", "y1", "x2", "y2", "x", "y"],
    A: ["rx", "ry", "angle", "large", "sweep", "x", "y"]
  };
  var PARAMS_EXPECTED = {
    M: 2,
    L: 2,
    T: 2,
    H: 1,
    V: 1,
    S: 4,
    Q: 4,
    C: 6,
    A: 7,
    Z: 0
  };
  function normalizePath(path) {
    return path.replace(/[^0-9A-Z-.]/gi, " ").trim().replace(/\s+/g, " ");
  }
  var SVGCommand = /*#__PURE__*/function () {
    function SVGCommand(options) {
      _classCallCheck(this, SVGCommand);
      this.options = _objectSpread2({
        name: "?",
        parameters: {},
        relative: false,
        implicit: false,
        lastCommand: null
      }, options);
      this.name = this.options.name;
      this.verticalOnly = this.name === "V";
      this.horizontalOnly = this.name === "H";
      this.parameters = _objectSpread2({}, this.options.parameters);
      this.relative = this.options.relative;
      this.implicit = this.options.implicit;
      this.lastCommand = this.options.lastCommand;
      this.update();
    }
    _createClass(SVGCommand, [{
      key: "endPosition",
      get: function get() {
        if (!this.lastCommand) {
          return {
            x: this.parameters.x,
            y: this.parameters.y
          };
        }
        var lastPos = this.lastCommand.endPosition;
        var x = this.relative === false ? 0 : lastPos.x;
        var y = this.relative === false ? 0 : lastPos.y;
        if (PARAMS_EXPECTED[this.name] > 1) {
          return {
            x: x + this.parameters.x,
            y: y + this.parameters.y
          };
        } else if (PARAMS_EXPECTED[this.name] === 1 && this.horizontalOnly) {
          return {
            x: x + this.parameters.x,
            y: y
          };
        } else if (PARAMS_EXPECTED[this.name] === 1 && this.verticalOnly) {
          return {
            x: x,
            y: y + this.parameters.y
          };
        } else {
          return lastPos;
        }
      }
    }, {
      key: "getEndPos",
      value: function getEndPos() {
        var _this$lastCommand;
        return ((_this$lastCommand = this.lastCommand) === null || _this$lastCommand === void 0 ? void 0 : _this$lastCommand.endPosition) || {
          x: 0,
          y: 0
        };
      }
    }, {
      key: "getAbsolute",
      value: function getAbsolute() {
        this.update();
        if (!this.relative) {
          return this.parameters;
        }
        var params = _objectSpread2({}, this.parameters);
        for (var paramName in params) {
          params[paramName] = this.getValue(params[paramName], paramName, true);
        }
        return params;
      }
    }, {
      key: "getRelative",
      value: function getRelative() {
        this.update();
        if (this.relative) {
          return this.parameters;
        }
        var params = _objectSpread2({}, this.parameters);
        for (var paramName in params) {
          params[paramName] = this.getValue(params[paramName], paramName, false);
        }
        return params;
      }
    }, {
      key: "getValue",
      value: function getValue(value, name) {
        var relative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.relative;
        var pos = this.getEndPos();
        var isX = name.includes("x");
        var isY = name.includes("y");
        var isR = name.includes("r");
        if (isR && isX || isR && isY) {
          return value;
        }
        if (relative) {
          if (isX) return value + pos.x;
          if (isY) return value + pos.y;
        } else {
          if (isX) return value - pos.x;
          if (isY) return value - pos.y;
        }
        return value;
      }
    }, {
      key: "setValue",
      value: function setValue(value, name) {
        var relative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (!name) {
          return;
        }
        var typeDiff = relative !== this.relative;
        this.parameters[name] = typeDiff ? this.getValue(value, name, relative) : value;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.verticalOnly) {
          this.setValue(this.getEndPos().x, "x");
        }
        if (this.horizontalOnly) {
          this.setValue(this.getEndPos().y, "y");
        }
      }
    }]);
    return SVGCommand;
  }();
  var SVGPathCommand = /*#__PURE__*/function () {
    function SVGPathCommand(path) {
      _classCallCheck(this, SVGPathCommand);
      this.path = path;
      this.list = [];
      this.parse();
    }
    _createClass(SVGPathCommand, [{
      key: "parse",
      value: function parse() {
        var _this = this;
        var commands = normalizePath(this.path).match(COMMANDS_REGEX.GET);
        var lastCommand = null;
        commands === null || commands === void 0 || commands.forEach(function (commandStr) {
          var _commandStr$match;
          var relative = COMMANDS_REGEX.RELATIVE.test(commandStr[0]);
          var commandName = commandStr[0].toUpperCase();
          var commandParams = ((_commandStr$match = commandStr.match(COMMANDS_REGEX.PARAMS)) === null || _commandStr$match === void 0 ? void 0 : _commandStr$match.map(parseFloat)) || [];
          var paramsToProcess = _toConsumableArray(commandParams);
          var firstPass = true;
          var _loop = function _loop() {
            var _PARAMS_MAP$commandNa;
            var params = paramsToProcess.splice(0, PARAMS_EXPECTED[commandName]);
            var parameters = {};
            (_PARAMS_MAP$commandNa = PARAMS_MAP[commandName]) === null || _PARAMS_MAP$commandNa === void 0 || _PARAMS_MAP$commandNa.forEach(function (param, idx) {
              parameters[param] = params[idx];
            });
            var command = new SVGCommand({
              name: commandName,
              parameters: parameters,
              relative: relative,
              implicit: !firstPass,
              lastCommand: lastCommand
            });
            lastCommand = command;
            _this.list.push(command);
            firstPass = false;
          };
          do {
            _loop();
          } while (paramsToProcess.length > 0);
        });
      }
    }, {
      key: "build",
      value: function build() {
        return this.list.map(function (command) {
          var _PARAMS_MAP$command$n;
          var commandName = command.relative ? command.name.toLowerCase() : command.name;
          var params = command.relative ? command.getRelative() : command.getAbsolute();
          var paramsStr = ((_PARAMS_MAP$command$n = PARAMS_MAP[command.name]) === null || _PARAMS_MAP$command$n === void 0 ? void 0 : _PARAMS_MAP$command$n.map(function (name) {
            return fixNumber(params[name]);
          }).join(" ")) || "";
          return "".concat(command.implicit ? "" : commandName).concat(paramsStr);
        }).join(" ");
      }
    }]);
    return SVGPathCommand;
  }();

  var SVGPathEditorPoint = /*#__PURE__*/function () {
    function SVGPathEditorPoint(x, y, size, commandData) {
      _classCallCheck(this, SVGPathEditorPoint);
      this.element = null;
      this.id = getRandomID();
      this.x = x;
      this.y = y;
      this.size = fixNumber(size);
      this.command = commandData.command;
      this.commandParams = commandData.params;
      this.isAngle = this.commandParams.angle;
      this.isHorizontal = this.command.name !== "V" && this.commandParams.x;
      this.isVertical = this.command.name !== "H" && this.commandParams.y;
      this.links = [];
      this.arcs = [];
      this.active = false;
      this.create();
      this.set();
    }
    _createClass(SVGPathEditorPoint, [{
      key: "x",
      get: function get() {
        return this._x;
      },
      set: function set(value) {
        this._x = fixNumber(value);
      }
    }, {
      key: "y",
      get: function get() {
        return this._y;
      },
      set: function set(value) {
        this._y = fixNumber(value);
      }
    }, {
      key: "addLink",
      value: function addLink(link) {
        this.links.push(link);
      }
    }, {
      key: "addArc",
      value: function addArc(arc) {
        this.arcs.push(arc);
      }
    }, {
      key: "create",
      value: function create() {
        this.element = createSVGElement("circle", {
          r: this.size,
          "stroke-width": fixNumber(this.size * 1.25)
        });
        this.element.classList.add("spe-point");
        this.applyClasses();
      }
    }, {
      key: "applyClasses",
      value: function applyClasses() {
        var classes = [];
        if (this.isAngle) {
          classes.push("angle");
        }
        if (this.isVertical && !this.isHorizontal && !this.isAngle) {
          classes.push("vertical");
        }
        if (this.isHorizontal && !this.isVertical && !this.isAngle) {
          classes.push("horizontal");
        }
        if (classes.length > 0) {
          var _this$element$classLi;
          (_this$element$classLi = this.element.classList).add.apply(_this$element$classLi, classes);
        }
        return classes;
      }
    }, {
      key: "set",
      value: function set() {
        this.element.setAttribute("cx", this.x);
        this.element.setAttribute("cy", this.y);
        this.update();
      }
    }, {
      key: "update",
      value: function update() {
        this.links.forEach(function (link) {
          link.set();
        });
        this.arcs.forEach(function (arc) {
          arc.set();
        });
        this.command.setValue(this.x, this.commandParams.x);
        this.command.setValue(this.y, this.commandParams.y);
        if (this.commandParams.angle) {
          this.command.setValue(this.angle, this.commandParams.angle);
        }
      }
    }, {
      key: "linkedTo",
      value: function linkedTo(point) {
        var checkedPoints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();
        if (checkedPoints.has(this)) {
          return false;
        }
        checkedPoints.add(this);
        var _iterator = _createForOfIteratorHelper(this.links),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var link = _step.value;
            if (link.p1 === point || link.p2 === point) {
              return true;
            }
            if (link.p1.linkedTo(point, checkedPoints)) {
              return true;
            }
            if (link.p2.linkedTo(point, checkedPoints)) {
              return true;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        var _iterator2 = _createForOfIteratorHelper(this.arcs),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var arc = _step2.value;
            if (arc.p1 === point || arc.p2 === point) {
              return true;
            }
            if (arc.p1.linkedTo(point, checkedPoints)) {
              return true;
            }
            if (arc.p2.linkedTo(point, checkedPoints)) {
              return true;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        return false;
      }
    }, {
      key: "select",
      value: function select() {
        if (this.active) {
          return;
        }
        this.active = true;
        this.element.classList.add("active");
        this.links.forEach(function (link) {
          link.select();
        });
        this.arcs.forEach(function (arc) {
          arc.select();
        });
      }
    }, {
      key: "unSelect",
      value: function unSelect() {
        if (!this.active) {
          return;
        }
        this.active = false;
        this.element.classList.remove("active");
        this.links.forEach(function (link) {
          link.unSelect();
        });
        this.arcs.forEach(function (arc) {
          arc.unSelect();
        });
      }
    }]);
    return SVGPathEditorPoint;
  }();

  var SVGPathEditorArcPoint = /*#__PURE__*/function (_SVGPathEditorPoint) {
    _inherits(SVGPathEditorArcPoint, _SVGPathEditorPoint);
    var _super = _createSuper(SVGPathEditorArcPoint);
    function SVGPathEditorArcPoint(point, size, commandData) {
      var _this;
      _classCallCheck(this, SVGPathEditorArcPoint);
      _this = _super.call(this, 0, 0, size, commandData);
      _this.angle = _this.command.parameters.angle;
      _this.x = _this.command.parameters.rx;
      _this.y = _this.command.parameters.ry;
      _this.centerPoint = point;
      _this.set();
      return _this;
    }
    _createClass(SVGPathEditorArcPoint, [{
      key: "getArcRx",
      value: function getArcRx() {
        if (this.isAngle) {
          return this.x;
        }
        if (this.isHorizontal) {
          return fixNumber(this.centerPoint.x + this.x);
        } else {
          return this.centerPoint.x;
        }
      }
    }, {
      key: "getArcRy",
      value: function getArcRy() {
        if (this.isAngle) {
          return this.y;
        }
        if (this.isVertical) {
          return fixNumber(this.centerPoint.y + this.y);
        } else {
          return this.centerPoint.y;
        }
      }
    }, {
      key: "create",
      value: function create() {
        this.element = createSVGElement("circle", {
          r: this.size
        });
        this.element.classList.add("spe-arc-point");
        this.applyClasses();
      }
    }, {
      key: "set",
      value: function set() {
        if (!this.centerPoint) {
          return;
        }
        if (this.isAngle) {
          var rotatedPoint = rotatePoint(this.centerPoint, this.angle, 10);
          this.x = rotatedPoint.x;
          this.y = rotatedPoint.y;
        }
        this.element.setAttribute("cx", this.getArcRx());
        this.element.setAttribute("cy", this.getArcRy());
        this.update();
      }
    }]);
    return SVGPathEditorArcPoint;
  }(SVGPathEditorPoint);

  var SVGPathEditorArc = /*#__PURE__*/function () {
    function SVGPathEditorArc(p1, p2, size, commandData) {
      _classCallCheck(this, SVGPathEditorArc);
      this.element = null;
      this.elements = {};
      this.id = getRandomID();
      this.p1 = p1;
      this.p2 = p2;
      this.size = fixNumber(size * 0.3);
      this.selectedSize = fixNumber(size);
      this.command = commandData.command;
      this.commandParams = commandData.params;
      this.active = false;
      p1.addArc(this);
      p2.addArc(this);
      this.create();
      this.set();
    }
    _createClass(SVGPathEditorArc, [{
      key: "triggerLarge",
      value: function triggerLarge() {
        this.command.parameters.large = Number(!this.command.parameters.large);
        this.set();
      }
    }, {
      key: "triggerSweep",
      value: function triggerSweep() {
        this.command.parameters.sweep = Number(!this.command.parameters.sweep);
        this.set();
      }
    }, {
      key: "create",
      value: function create() {
        var wrapper = createSVGElement("g");
        var arcSweepLarge = createSVGElement("path", {
          "stroke-width": this.size
        });
        var arcSweep = createSVGElement("path", {
          "stroke-width": this.size
        });
        var arc = createSVGElement("path", {
          "stroke-width": this.size
        });
        var arcLarge = createSVGElement("path", {
          "stroke-width": this.size
        });
        wrapper.classList.add("spe-arc-wrapper");
        arcSweepLarge.classList.add("spe-arc", "sweep", "large");
        arcSweepLarge.classList.add("spe-arc", "sweep", "large");
        arcSweep.classList.add("spe-arc", "sweep");
        arc.classList.add("spe-arc");
        arcLarge.classList.add("spe-arc", "large");
        wrapper.append(arcSweepLarge, arcSweep, arc, arcLarge);
        this.element = wrapper;
        this.elements.arcSweepLarge = arcSweepLarge;
        this.elements.arcSweep = arcSweep;
        this.elements.arc = arc;
        this.elements.arcLarge = arcLarge;
      }
    }, {
      key: "set",
      value: function set() {
        var _this$command$paramet = this.command.parameters,
          sweep = _this$command$paramet.sweep,
          large = _this$command$paramet.large;
        for (var name in this.elements) {
          this.elements[name].classList.remove("selected");
          this.elements[name].setAttribute("stroke-width", this.size);
        }
        var selected = null;
        if (sweep && large) {
          selected = this.elements.arcSweepLarge;
        }
        if (sweep && !large) {
          selected = this.elements.arcSweep;
        }
        if (!sweep && !large) {
          selected = this.elements.arc;
        }
        if (!sweep && large) {
          selected = this.elements.arcLarge;
        }
        selected.classList.add("selected");
        selected.setAttribute("stroke-width", this.selectedSize);
        this.element.append(selected);
        this.elements.arcSweepLarge.setAttribute("d", this.getArc(1, 1));
        this.elements.arcSweep.setAttribute("d", this.getArc(0, 1));
        this.elements.arc.setAttribute("d", this.getArc(0, 0));
        this.elements.arcLarge.setAttribute("d", this.getArc(1, 0));
      }
    }, {
      key: "getArc",
      value: function getArc(large, sweep) {
        var p1 = this.p1,
          p2 = this.p2;
        var _this$command$paramet2 = this.command.parameters,
          rx = _this$command$paramet2.rx,
          ry = _this$command$paramet2.ry,
          angle = _this$command$paramet2.angle;
        return "M".concat(p2.x, " ").concat(p2.y, " A").concat(rx, " ").concat(ry, " ").concat(angle, " ").concat(large, " ").concat(sweep, " ").concat(p1.x, " ").concat(p1.y);
      }
    }, {
      key: "select",
      value: function select() {
        if (this.active) {
          return;
        }
        this.active = true;
        this.element.classList.add("active");
        this.p1.select();
        this.p2.select();
      }
    }, {
      key: "unSelect",
      value: function unSelect() {
        if (!this.active) {
          return;
        }
        this.active = false;
        this.element.classList.remove("active");
        this.p1.unSelect();
        this.p2.unSelect();
      }
    }]);
    return SVGPathEditorArc;
  }();

  var SVGPathEditorCurvePoint = /*#__PURE__*/function (_SVGPathEditorPoint) {
    _inherits(SVGPathEditorCurvePoint, _SVGPathEditorPoint);
    var _super = _createSuper(SVGPathEditorCurvePoint);
    function SVGPathEditorCurvePoint() {
      _classCallCheck(this, SVGPathEditorCurvePoint);
      return _super.apply(this, arguments);
    }
    _createClass(SVGPathEditorCurvePoint, [{
      key: "create",
      value: function create() {
        this.element = createSVGElement("circle", {
          r: this.size
        });
        this.element.classList.add("spe-curve-point");
        this.applyClasses();
      }
    }]);
    return SVGPathEditorCurvePoint;
  }(SVGPathEditorPoint);

  var SVGPathEditorEndPoint = /*#__PURE__*/function (_SVGPathEditorPoint) {
    _inherits(SVGPathEditorEndPoint, _SVGPathEditorPoint);
    var _super = _createSuper(SVGPathEditorEndPoint);
    function SVGPathEditorEndPoint() {
      _classCallCheck(this, SVGPathEditorEndPoint);
      return _super.apply(this, arguments);
    }
    _createClass(SVGPathEditorEndPoint, [{
      key: "create",
      value: function create() {
        this.element = createSVGElement("rect", {
          width: this.size,
          height: this.size,
          "stroke-width": this.size * 0.5
        });
        this.element.classList.add("spe-end-point");
        this.applyClasses();
      }
    }, {
      key: "set",
      value: function set() {
        var midSize = fixNumber(this.size / 2);
        this.element.setAttribute("x", fixNumber(this.x - midSize));
        this.element.setAttribute("y", fixNumber(this.y - midSize));
        this.update();
      }
    }]);
    return SVGPathEditorEndPoint;
  }(SVGPathEditorPoint);

  var SVGPathEditorLink = /*#__PURE__*/function () {
    function SVGPathEditorLink(p1, p2, size) {
      _classCallCheck(this, SVGPathEditorLink);
      this.element = null;
      this.id = getRandomID();
      this.p1 = p1;
      this.p2 = p2;
      this.size = fixNumber(size);
      this.active = false;
      p1.addLink(this);
      p2.addLink(this);
      this.create();
      this.set();
    }
    _createClass(SVGPathEditorLink, [{
      key: "create",
      value: function create() {
        this.element = createSVGElement("line", {
          "stroke-width": this.size
        });
        this.element.classList.add("spe-link");
      }
    }, {
      key: "set",
      value: function set() {
        var p1x = this.p1.getArcRx ? this.p1.getArcRx() : this.p1.x;
        var p1y = this.p1.getArcRy ? this.p1.getArcRy() : this.p1.y;
        var p2x = this.p2.getArcRx ? this.p2.getArcRx() : this.p2.x;
        var p2y = this.p2.getArcRy ? this.p2.getArcRy() : this.p2.y;
        this.element.setAttribute("x1", p1x);
        this.element.setAttribute("y1", p1y);
        this.element.setAttribute("x2", p2x);
        this.element.setAttribute("y2", p2y);
      }
    }, {
      key: "select",
      value: function select() {
        if (this.active) {
          return;
        }
        this.active = true;
        this.element.classList.add("active");
        this.p1.select();
        this.p2.select();
      }
    }, {
      key: "unSelect",
      value: function unSelect() {
        if (!this.active) {
          return;
        }
        this.active = false;
        this.element.classList.remove("active");
        this.p1.unSelect();
        this.p2.unSelect();
      }
    }]);
    return SVGPathEditorLink;
  }();

  var SVGPathEditorPath = /*#__PURE__*/function () {
    function SVGPathEditorPath(path) {
      _classCallCheck(this, SVGPathEditorPath);
      this.element = null;
      this.id = getRandomID();
      this.x = 0;
      this.y = 0;
      this.size = 1;
      this.points = [];
      this.curvePoints = [];
      this.arcPoints = [];
      this.links = [];
      this.arcs = [];
      this.active = false;
      this.lastPoint = null;
      this.lastModifier = null;
      this.create(path);
      this.set();
    }
    _createClass(SVGPathEditorPath, [{
      key: "x",
      get: function get() {
        return this._x;
      },
      set: function set(value) {
        this._x = fixNumber(value);
      }
    }, {
      key: "y",
      get: function get() {
        return this._y;
      },
      set: function set(value) {
        this._y = fixNumber(value);
      }
    }, {
      key: "create",
      value: function create(basePath) {
        var basePathStyle = window.getComputedStyle(basePath);
        var path = basePath.cloneNode();
        var pathAttrs = path.getAttributeNames();
        var pathWidth = parseFloat(basePathStyle.strokeWidth);
        if (pathWidth) {
          this.size = fixNumber(pathWidth);
        }
        pathAttrs.forEach(function (attrName) {
          if (attrName !== "d") path.removeAttribute(attrName);
        });
        path.setAttribute("class", "spe-path");
        path.setAttribute("stroke-width", this.size);
        this.element = path;
      }
    }, {
      key: "addPoint",
      value: function addPoint(point) {
        if (point) {
          this.points.push(point);
          this.lastPoint = point;
        }
      }
    }, {
      key: "addCurvePoint",
      value: function addCurvePoint(curvePoint) {
        if (curvePoint) {
          this.curvePoints.push(curvePoint);
          this.lastModifier = curvePoint;
        }
      }
    }, {
      key: "addArcPoint",
      value: function addArcPoint(arcPoint) {
        if (arcPoint) {
          this.arcPoints.push(arcPoint);
          this.lastModifier = arcPoint;
        }
      }
    }, {
      key: "addArc",
      value: function addArc(arc) {
        if (arc) {
          this.arcs.push(arc);
        }
      }
    }, {
      key: "addLink",
      value: function addLink(link) {
        if (link) {
          this.links.push(link);
        }
      }
    }, {
      key: "getValue",
      value: function getValue() {
        return this.element.getAttribute("d");
      }
    }, {
      key: "getLastModifier",
      value: function getLastModifier() {
        return this.lastModifier;
      }
    }, {
      key: "getLastPoint",
      value: function getLastPoint() {
        return this.lastPoint;
      }
    }, {
      key: "getAllPoints",
      value: function getAllPoints() {
        return [].concat(_toConsumableArray(this.points), _toConsumableArray(this.curvePoints), _toConsumableArray(this.arcPoints));
      }
    }, {
      key: "getElements",
      value: function getElements() {
        return [].concat(_toConsumableArray(this.arcs), _toConsumableArray(this.links), _toConsumableArray(this.getAllPoints()));
      }
    }, {
      key: "setValue",
      value: function setValue(value) {
        this.element.setAttribute("d", value);
      }
    }, {
      key: "set",
      value: function set() {
        var _this = this;
        this.points.forEach(function (point) {
          point.x += _this.x;
          point.y += _this.y;
          point.set();
        });
        this.curvePoints.forEach(function (curvePoint) {
          curvePoint.x += _this.x;
          curvePoint.y += _this.y;
          curvePoint.set();
        });
      }
    }, {
      key: "select",
      value: function select() {
        if (this.active) {
          return;
        }
        this.active = true;
        this.element.classList.add("active");
      }
    }, {
      key: "unSelect",
      value: function unSelect() {
        if (!this.active) {
          return;
        }
        this.active = false;
        this.element.classList.remove("active");
      }
    }]);
    return SVGPathEditorPath;
  }();

  var SVGPathEditorStartPoint = /*#__PURE__*/function (_SVGPathEditorPoint) {
    _inherits(SVGPathEditorStartPoint, _SVGPathEditorPoint);
    var _super = _createSuper(SVGPathEditorStartPoint);
    function SVGPathEditorStartPoint() {
      _classCallCheck(this, SVGPathEditorStartPoint);
      return _super.apply(this, arguments);
    }
    _createClass(SVGPathEditorStartPoint, [{
      key: "create",
      value: function create() {
        this.element = createSVGElement("polygon", {
          "stroke-width": this.size * 0.5
        });
        this.element.classList.add("spe-start-point");
        this.applyClasses();
      }
    }, {
      key: "set",
      value: function set() {
        var midSize = fixNumber(this.size / 2);
        var p1 = "".concat(fixNumber(this.x - midSize), " ").concat(this.y);
        var p2 = "".concat(this.x, " ").concat(fixNumber(this.y + midSize));
        var p3 = "".concat(fixNumber(this.x + midSize), " ").concat(this.y);
        var p4 = "".concat(this.x, " ").concat(fixNumber(this.y - midSize));
        this.element.setAttribute("points", "".concat(p1, ", ").concat(p2, ", ").concat(p3, ", ").concat(p4));
        this.update();
      }
    }]);
    return SVGPathEditorStartPoint;
  }(SVGPathEditorPoint);

  var SVGPathEditorHistory = /*#__PURE__*/function () {
    function SVGPathEditorHistory() {
      _classCallCheck(this, SVGPathEditorHistory);
      this.history = {
        undo: [],
        redo: []
      };
      this.historyIndex = -1;
      this.current = null;
    }
    _createClass(SVGPathEditorHistory, [{
      key: "add",
      value: function add(target) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "undo";
        if (!target) return;
        var targetList = [];
        var datas = [];
        if (!Array.isArray(target)) {
          targetList.push(target);
        } else {
          targetList = target;
        }
        this.current = this.current || {};
        targetList.forEach(function (target) {
          var data = {
            target: target,
            position: {
              x: target.x || null,
              y: target.y || null
            },
            angle: target.angle,
            command: _objectSpread2({}, target.command.parameters)
          };
          datas.push(data);
        });
        this.current[type] = datas;
      }
    }, {
      key: "undo",
      value: function undo() {
        if (!this.canUndo()) return;
        this.restore(this.history.undo[this.historyIndex]);
        this.historyIndex--;
      }
    }, {
      key: "redo",
      value: function redo() {
        if (!this.canRedo()) return;
        this.historyIndex++;
        this.restore(this.history.redo[this.historyIndex]);
      }
    }, {
      key: "restore",
      value: function restore(datas) {
        if (!datas) return;
        datas.forEach(function (data) {
          var target = data.target;
          target.x = data.position.x;
          target.y = data.position.y;
          target.angle = data.angle;
          for (var paramName in target.command.parameters) {
            target.command.parameters[paramName] = data.command[paramName];
          }
          target.set();
        });
      }
    }, {
      key: "isDataChanged",
      value: function isDataChanged(data1, data2) {
        if (Array.isArray(data1) && Array.isArray(data2)) {
          if (data1.length !== data2.length) return true;
          for (var i = 0; i < data1.length; i++) {
            if (this.isDataChanged(data1[i], data2[i])) return true;
          }
          return false;
        }
        if (data1 && _typeof(data1) === "object" && data2 && _typeof(data2) === "object") {
          var keys1 = Object.keys(data1);
          var keys2 = Object.keys(data2);
          if (keys1.length !== keys2.length) return true;
          for (var _i = 0, _keys = keys1; _i < _keys.length; _i++) {
            var key = _keys[_i];
            if (key === "target") {
              continue;
            }
            if (this.isDataChanged(data1[key], data2[key])) return true;
          }
          return false;
        }
        return data1 !== data2;
      }
    }, {
      key: "save",
      value: function save() {
        if (!this.current) return;
        var targets = this.current.undo.map(function (data) {
          return data.target;
        });
        this.add(targets, "redo");
        var lastUndo = this.history.undo[this.historyIndex - 1];
        var lastUndoChanged = lastUndo ? this.isDataChanged(this.current.undo, lastUndo) : true;
        var redoChanged = this.isDataChanged(this.current.undo, this.current.redo);
        if (lastUndoChanged && redoChanged) {
          if (this.historyIndex < this.history.undo.length - 1) {
            this.history.undo = this.history.undo.slice(0, this.historyIndex + 1);
            this.history.redo = this.history.redo.slice(0, this.historyIndex + 1);
          }
          this.history.undo.push(this.current.undo);
          this.history.redo.push(this.current.redo);
          this.historyIndex++;
        }
        this.current = null;
      }
    }, {
      key: "canUndo",
      value: function canUndo() {
        return this.historyIndex >= 0;
      }
    }, {
      key: "canRedo",
      value: function canRedo() {
        return this.historyIndex < this.history.redo.length - 1;
      }
    }]);
    return SVGPathEditorHistory;
  }();

  var SVGPathEditor = /*#__PURE__*/function () {
    function SVGPathEditor(options) {
      _classCallCheck(this, SVGPathEditor);
      SVGPathEditor.instances.push(this);
      this.options = _objectSpread2({
        container: null,
        path: null
      }, options);
      this.path = this.options.path;
      this.container = this.options.container;
      this.keyModifierPressed = {};
      this.pointDragging = {
        active: false,
        target: null
      };
      this.pathDragging = {
        active: false
      };
      this.elements = {
        svgParents: getSvgParents(this.container)
      };
      this.history = new SVGPathEditorHistory();
      this.pathSize = 0;
      this.snapRotation = 90;
      this.snapDistance = 5;
      this.init();
    }
    _createClass(SVGPathEditor, [{
      key: "isActive",
      value: function isActive() {
        var path = this.elements.path;
        if (path.active) {
          return true;
        }
        var _iterator = _createForOfIteratorHelper(path.points),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var point = _step.value;
            if (point.active) {
              return true;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return false;
      }
    }, {
      key: "init",
      value: function init() {
        if (SVGPathEditor.instances.length === 1) {
          document.addEventListener("mousedown", SVGPathEditor.handleMouseDown);
          document.addEventListener("mousemove", SVGPathEditor.handleMouseMove);
          document.addEventListener("mouseup", SVGPathEditor.handleMouseUp);
          document.addEventListener("keydown", SVGPathEditor.handleKeyDown);
          document.addEventListener("keyup", SVGPathEditor.handleKeyUp);
        }
        var elements = this.createEditor();
        this.elements.element = elements.element;
        this.elements.path = elements.path;
      }
    }, {
      key: "createEditor",
      value: function createEditor() {
        var editor = createSVGElement("g");
        var editorPath = new SVGPathEditorPath(this.path);
        editor.classList.add(SVGPathEditor.CLASSNAME);
        editor.appendChild(editorPath.element);
        return {
          element: editor,
          path: editorPath
        };
      }
    }, {
      key: "setScaleAndOffset",
      value: function setScaleAndOffset() {
        var viewboxData = calculateScaleAndOffset(this.container);
        for (var i = this.elements.svgParents.length - 1; i === 0; i--) {
          var parentSVG = this.elements.svgParents[i];
          var parentViewboxData = calculateScaleAndOffset(parentSVG);
          viewboxData.scale.x *= parentViewboxData.scale.x;
          viewboxData.scale.y *= parentViewboxData.scale.y;
          viewboxData.offset.x = viewboxData.offset.x * parentViewboxData.scale.x + parentViewboxData.offset.x;
          viewboxData.offset.y = viewboxData.offset.y * parentViewboxData.scale.y + parentViewboxData.offset.y;
        }
        this.scale = viewboxData.scale;
        this.viewBoxOffset = viewboxData.offset;
        this.bounding = viewboxData.bounding;
      }
    }, {
      key: "getPoint",
      value: function getPoint(element) {
        var path = this.elements.path;
        var points = path.getAllPoints();
        var _iterator2 = _createForOfIteratorHelper(points),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var point = _step2.value;
            if (point.element === element) {
              return point;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        return false;
      }
    }, {
      key: "getPath",
      value: function getPath(element) {
        var path = this.elements.path;
        if (path.element === element) {
          return path;
        }
        return false;
      }
    }, {
      key: "snapAngle",
      value: function snapAngle(angle) {
        var remainder = angle % this.snapRotation;
        if (remainder < this.snapDistance) {
          return angle - remainder;
        } else if (this.snapRotation - remainder < this.snapDistance) {
          return angle + (this.snapRotation - remainder);
        }
        return angle;
      }
    }, {
      key: "getScaledPosition",
      value: function getScaledPosition(event) {
        var x = (event.clientX - this.bounding.left) * this.scale.x + this.viewBoxOffset.x;
        var y = (event.clientY - this.bounding.top) * this.scale.y + this.viewBoxOffset.y;
        return {
          x: x,
          y: y
        };
      }
    }, {
      key: "onMouseDown",
      value: function onMouseDown(event) {
        if (event.button === 2) return false;
        var point = this.getPoint(event.target);
        var path = this.getPath(event.target);
        this.elements.path.points.forEach(function (otherPoint) {
          if (point && (point === otherPoint || point.linkedTo(otherPoint))) {
            otherPoint.select();
          } else {
            otherPoint.unSelect();
          }
        });
        if (!path) {
          this.elements.path.unSelect();
        }
        if (!point && !path) return false;
        this.setScaleAndOffset();
        var scaledPos = this.getScaledPosition(event);
        if (path) {
          path.select();
          this.pathDragging = {
            active: true,
            target: path,
            offsetX: scaledPos.x,
            offsetY: scaledPos.y
          };
          this.history.add(path.points);
        } else {
          this.elements.path.unSelect();
          this.pointDragging = {
            active: true,
            target: point,
            offsetX: scaledPos.x - point.x,
            offsetY: scaledPos.y - point.y
          };
          this.history.add(point);
        }
      }
    }, {
      key: "onMouseMove",
      value: function onMouseMove(event) {
        var isPath = this.pathDragging.active;
        var dragData = isPath ? this.pathDragging : this.pointDragging;
        if (!dragData.active) return;
        var target = dragData.target;
        var scaledPos = this.getScaledPosition(event);
        var x = scaledPos.x - dragData.offsetX;
        var y = scaledPos.y - dragData.offsetY;
        if (isPath) {
          target.x = this.keyModifierPressed.alt ? 0 : x;
          target.y = this.keyModifierPressed.shift ? 0 : y;
          target.set();
          dragData.offsetX = scaledPos.x;
          dragData.offsetY = scaledPos.y;
        } else {
          if (target.isHorizontal && !this.keyModifierPressed.alt) {
            target.x = x;
          }
          if (target.isVertical && !this.keyModifierPressed.shift) {
            target.y = y;
          }
          if (target.isAngle) {
            target.angle = this.snapAngle(getAngle(target.centerPoint, {
              x: x,
              y: y
            }));
          }
          target.set();
        }
        this.updatePath();
      }
    }, {
      key: "onMouseUp",
      value: function onMouseUp(event) {
        var point = this.getPoint(event.target);
        if (event.button === 2) {
          this.onContextMenu(point);
        } else {
          this.pathDragging = {
            active: false,
            target: null,
            offsetX: 0,
            offsetY: 0
          };
          this.pointDragging = {
            active: false,
            target: null,
            offsetX: 0,
            offsetY: 0
          };
        }
        this.history.save();
      }
    }, {
      key: "onContextMenu",
      value: function onContextMenu(point) {
        var _this = this;
        if (!point || !point.active) return;
        if (this.keyModifierPressed.shift) {
          point.arcs.forEach(function (arc) {
            if (arc.p1 === point) {
              _this.history.add(arc);
              arc.triggerSweep();
            }
          });
        } else {
          this.history.add(point);
          point.arcs.forEach(function (arc) {
            if (arc.p1 === point) {
              _this.history.add(arc);
              arc.triggerLarge();
            }
          });
        }
        this.updatePath();
      }
    }, {
      key: "onKeyDown",
      value: function onKeyDown(event) {
        var ctrlKey = event.ctrlKey,
          shiftKey = event.shiftKey;
        var _this$keyModifierPres = this.keyModifierPressed,
          shift = _this$keyModifierPres.shift,
          z = _this$keyModifierPres.z,
          y = _this$keyModifierPres.y,
          c = _this$keyModifierPres.c;
        var path = this.elements.path;
        var key = event.key.toLowerCase();
        var active = this.isActive();
        this.updateKeyModifiers(event);
        if (ctrlKey && key === "c" && active && !c) {
          copyToClipboard(path.getValue());
        } else if (ctrlKey && key === "z" && active && !z) {
          this.history.undo();
          this.updatePath();
        } else if (ctrlKey && key === "y" && active && !y) {
          this.history.redo();
          this.updatePath();
        } else if (ctrlKey && shiftKey && !shift) {
          this.togglePointsSelection();
        }
      }
    }, {
      key: "onKeyUp",
      value: function onKeyUp(event) {
        this.updateKeyModifiers(event);
      }
    }, {
      key: "updateKeyModifiers",
      value: function updateKeyModifiers(event) {
        var ctrlKey = event.ctrlKey,
          shiftKey = event.shiftKey,
          altKey = event.altKey;
        var key = event.key.toLowerCase();
        if (altKey) {
          event.preventDefault();
        }
        this.keyModifierPressed = _objectSpread2(_objectSpread2({}, this.keyModifierPressed), {}, _defineProperty({
          ctrl: ctrlKey,
          shift: shiftKey,
          alt: altKey
        }, key, event.type === "keydown" ? true : false));
      }
    }, {
      key: "togglePointsSelection",
      value: function togglePointsSelection() {
        var path = this.elements.path;
        var selectedPoints = path.points.filter(function (point) {
          return point.active;
        });
        var allPointSelected = selectedPoints.length === path.points.length;
        path.points.forEach(function (point) {
          if (!allPointSelected) {
            path.unSelect();
            point.select();
          } else {
            point.unSelect();
          }
        });
      }
    }, {
      key: "updatePath",
      value: function updatePath() {
        var path = this.elements.path;
        var commands = this.options.commands;
        path.getAllPoints().forEach(function (point) {
          var params = point.command.getAbsolute();
          var pointParams = point.commandParams;
          if (pointParams.x) {
            point.x = params[pointParams.x];
          }
          if (pointParams.y) {
            point.y = params[pointParams.y];
          }
          point.set();
        });
        this.elements.path.setValue(commands.build());
      }
    }, {
      key: "addStartPoint",
      value: function addStartPoint(x, y, commandData) {
        var path = this.elements.path;
        var startPoint = new SVGPathEditorStartPoint(x, y, path.size * 1.5, commandData);
        path.addPoint(startPoint);
      }
    }, {
      key: "addEndPoint",
      value: function addEndPoint(x, y, commandData) {
        var path = this.elements.path;
        var endPoint = new SVGPathEditorEndPoint(x, y, path.size * 1.2, commandData);
        path.addPoint(endPoint);
      }
    }, {
      key: "addPoint",
      value: function addPoint(x, y, commandData) {
        var path = this.elements.path;
        var point = new SVGPathEditorPoint(x, y, path.size * 0.8, commandData);
        path.addPoint(point);
      }
    }, {
      key: "addCurvePoint",
      value: function addCurvePoint(x, y, commandData) {
        var path = this.elements.path;
        var curvePoint = new SVGPathEditorCurvePoint(x, y, path.size * 0.6, commandData);
        path.addCurvePoint(curvePoint);
      }
    }, {
      key: "addArcPoint",
      value: function addArcPoint(point, commandData) {
        var path = this.elements.path;
        var arcPoint = new SVGPathEditorArcPoint(point, path.size * 0.6, commandData);
        path.addArcPoint(arcPoint);
      }
    }, {
      key: "addArc",
      value: function addArc(p1, p2, commandData) {
        var path = this.elements.path;
        var arc = new SVGPathEditorArc(p1, p2, path.size, commandData);
        path.addArc(arc);
      }
    }, {
      key: "addLink",
      value: function addLink() {
        var path = this.elements.path;
        var _ref = [path.getLastModifier(), path.getLastPoint()],
          p1 = _ref[0],
          p2 = _ref[1];
        var link = new SVGPathEditorLink(p1, p2, path.size * 0.9);
        path.addLink(link);
      }
    }, {
      key: "build",
      value: function build() {
        var _this$elements = this.elements,
          element = _this$elements.element,
          path = _this$elements.path;
        path.getElements().forEach(function (pathElement) {
          element.append(pathElement.element);
        });
        this.container.append(element);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (SVGPathEditor.instances.length === 0) {
          document.removeEventListener("mousedown", SVGPathEditor.handleMouseDown);
          document.removeEventListener("mousemove", SVGPathEditor.handleMouseMove);
          document.removeEventListener("mouseup", SVGPathEditor.handleMouseUp);
          document.removeEventListener("keydown", SVGPathEditor.handleKeyDown);
          document.removeEventListener("keyup", SVGPathEditor.handleKeyUp);
        }
        this.elements.element.remove();
      }
    }], [{
      key: "handleMouseDown",
      value: function handleMouseDown(e) {
        SVGPathEditor.instances.forEach(function (instance) {
          return instance.onMouseDown(e);
        });
      }
    }, {
      key: "handleMouseMove",
      value: function handleMouseMove(e) {
        SVGPathEditor.instances.forEach(function (instance) {
          return instance.onMouseMove(e);
        });
      }
    }, {
      key: "handleMouseUp",
      value: function handleMouseUp(e) {
        SVGPathEditor.instances.forEach(function (instance) {
          return instance.onMouseUp(e);
        });
      }
    }, {
      key: "handleKeyDown",
      value: function handleKeyDown(e) {
        SVGPathEditor.instances.forEach(function (instance) {
          return instance.onKeyDown(e);
        });
      }
    }, {
      key: "handleKeyUp",
      value: function handleKeyUp(e) {
        SVGPathEditor.instances.forEach(function (instance) {
          return instance.onKeyUp(e);
        });
      }
    }]);
    return SVGPathEditor;
  }();
  _defineProperty(SVGPathEditor, "CLASSNAME", "svg-path-editor");
  _defineProperty(SVGPathEditor, "instances", []);

  var HELPER_CLASS = "svg-path-helper";
  var instance = null;
  var SVGPathHelper = /*#__PURE__*/function () {
    function SVGPathHelper() {
      _classCallCheck(this, SVGPathHelper);
      if (instance) {
        return instance;
      }
      this.commandHandlers = this.initCommandHandlers();
      this.list = [];
      this.current = {};
      instance = this;
    }
    _createClass(SVGPathHelper, [{
      key: "getPaths",
      value: function getPaths(element) {
        var _this = this;
        var paths = Array.from(element.querySelectorAll("path"));
        paths = paths.filter(function (path) {
          if (path.closest(".".concat(SVGPathEditor.CLASSNAME))) {
            return false;
          }
          if (path.closest("svg") !== element) {
            return false;
          }
          var _iterator = _createForOfIteratorHelper(_this.list),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var helper = _step.value;
              var matchPath = helper.paths.filter(function (pathData) {
                return pathData.element === path;
              });
              if (matchPath.length > 0) {
                return false;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          return true;
        });
        return paths.map(parsePath).filter(Boolean);
      }
    }, {
      key: "add",
      value: function add(container) {
        var _this2 = this,
          _this$list;
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getRandomID();
        var helpers = [];
        if (container instanceof SVGElement && container.classList.contains(HELPER_CLASS)) {
          helpers.push({
            name: name,
            container: container,
            element: container,
            paths: this.getPaths(container)
          });
        } else {
          container.querySelectorAll("svg.".concat(HELPER_CLASS, ", svg.").concat(HELPER_CLASS, " svg")).forEach(function (svg) {
            helpers.push({
              name: name,
              container: container,
              element: svg,
              paths: _this2.getPaths(svg)
            });
          });
        }
        helpers = helpers.filter(function (helper) {
          return helper.element && helper.paths.length > 0;
        });
        (_this$list = this.list).push.apply(_this$list, _toConsumableArray(helpers));
        this.draw(helpers);
      }
    }, {
      key: "remove",
      value: function remove(container) {
        var _this3 = this;
        this.list.forEach(function (helper) {
          if (helper.container === container) {
            _this3.removeByHelper(helper);
          }
        });
      }
    }, {
      key: "removeByName",
      value: function removeByName(name) {
        var _this4 = this;
        this.list.forEach(function (helper) {
          if (helper.name === name) {
            _this4.removeByHelper(helper);
          }
        });
      }
    }, {
      key: "removeByPath",
      value: function removeByPath(path) {
        this.list.forEach(function (helper) {
          helper.paths.forEach(function (pathData) {
            if (pathData.element === path) {
              pathData.editor.destroy();
            }
          });
        });
      }
    }, {
      key: "removeByHelper",
      value: function removeByHelper(helper) {
        var index = this.list.indexOf(helper);
        if (index > -1) {
          helper.paths.forEach(function (pathData) {
            return pathData.editor.destroy();
          });
          this.list.splice(index, 1);
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        var _this5 = this;
        this.list.forEach(function (helper) {
          return _this5.removeByHelper(helper);
        });
        this.list.length = 0;
      }
    }, {
      key: "initCommandHandlers",
      value: function initCommandHandlers() {
        return {
          M: this.pointHandler,
          L: this.pointHandler,
          T: this.pointHandler,
          H: this.pointHandler,
          V: this.pointHandler,
          S: this.curveHandler,
          Q: this.curveHandler,
          C: this.cubicBezierHandler,
          A: this.arcHandler
        };
      }
    }, {
      key: "draw",
      value: function draw(helpers) {
        var _this6 = this;
        helpers.forEach(function (helper) {
          helper.paths.forEach(function (pathData) {
            return _this6.drawPath(pathData);
          });
        });
      }
    }, {
      key: "drawPath",
      value: function drawPath(pathData) {
        var _this7 = this;
        var path = pathData.element;
        var editor = new SVGPathEditor({
          container: path.parentNode,
          path: path,
          commands: pathData.commands
        });
        var commandLength = pathData.commands.list.length;
        pathData.commands.list.forEach(function (command, index) {
          var handler = _this7.commandHandlers[command.name];
          _this7.current = {
            command: command,
            index: index,
            editor: editor,
            length: commandLength
          };
          if (handler) {
            handler.call(_this7);
          }
        });
        editor.build();
        pathData.editor = editor;
      }
    }, {
      key: "pointHandler",
      value: function pointHandler() {
        var command = this.current.command;
        var _command$getAbsolute = command.getAbsolute(),
          x = _command$getAbsolute.x,
          y = _command$getAbsolute.y;
        this.addPoint(x, y, {
          command: command,
          params: {
            x: "x",
            y: "y"
          }
        });
      }
    }, {
      key: "curveHandler",
      value: function curveHandler() {
        var _this$current = this.current,
          command = _this$current.command,
          editor = _this$current.editor;
        var _command$getAbsolute2 = command.getAbsolute(),
          x = _command$getAbsolute2.x,
          y = _command$getAbsolute2.y,
          x1 = _command$getAbsolute2.x1,
          y1 = _command$getAbsolute2.y1;
        editor.addCurvePoint(x1, y1, {
          command: command,
          params: {
            x: "x1",
            y: "y1"
          }
        });
        this.addPoint(x, y, {
          command: command,
          params: {
            x: "x",
            y: "y"
          }
        });
        editor.addLink();
      }
    }, {
      key: "cubicBezierHandler",
      value: function cubicBezierHandler() {
        var _this$current2 = this.current,
          command = _this$current2.command,
          editor = _this$current2.editor;
        var _command$getAbsolute3 = command.getAbsolute(),
          x = _command$getAbsolute3.x,
          y = _command$getAbsolute3.y,
          x1 = _command$getAbsolute3.x1,
          y1 = _command$getAbsolute3.y1,
          x2 = _command$getAbsolute3.x2,
          y2 = _command$getAbsolute3.y2;
        editor.addCurvePoint(x1, y1, {
          command: command,
          params: {
            x: "x1",
            y: "y1"
          }
        });
        editor.addLink();
        editor.addCurvePoint(x2, y2, {
          command: command,
          params: {
            x: "x2",
            y: "y2"
          }
        });
        this.addPoint(x, y, {
          command: command,
          params: {
            x: "x",
            y: "y"
          }
        });
        editor.addLink();
      }
    }, {
      key: "arcHandler",
      value: function arcHandler() {
        var _this$current3 = this.current,
          command = _this$current3.command,
          editor = _this$current3.editor;
        var _command$getAbsolute4 = command.getAbsolute(),
          x = _command$getAbsolute4.x,
          y = _command$getAbsolute4.y;
        var path = editor.elements.path;
        var p2 = path.getLastPoint();
        this.addPoint(x, y, {
          command: command,
          params: {
            x: "x",
            y: "y"
          }
        });
        var p1 = path.getLastPoint();
        editor.addArc(p1, p2, {
          command: command,
          params: {
            x: "rx",
            y: "ry"
          }
        });
        editor.addArcPoint(p1, {
          command: command,
          params: {
            x: "rx"
          }
        });
        editor.addLink();
        editor.addArcPoint(p1, {
          command: command,
          params: {
            y: "ry"
          }
        });
        editor.addLink();
        editor.addArcPoint(p1, {
          command: command,
          params: {
            angle: "angle"
          }
        });
        editor.addLink();
      }
    }, {
      key: "addPoint",
      value: function addPoint(x, y, commandData) {
        var _this$current4 = this.current,
          editor = _this$current4.editor,
          index = _this$current4.index,
          length = _this$current4.length;
        if (index === 0) {
          editor.addStartPoint(x, y, commandData);
        } else if (index === length - 1) {
          editor.addEndPoint(x, y, commandData);
        } else {
          editor.addPoint(x, y, commandData);
        }
      }
    }]);
    return SVGPathHelper;
  }();
  function parsePath(svgPath) {
    var pathCommand = svgPath.getAttribute("d");
    if (!pathCommand || !pathCommand.trim()) return null;
    return {
      element: svgPath,
      commands: new SVGPathCommand(pathCommand)
    };
  }

  return SVGPathHelper;

})();
