/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/bezier-easing/src/index.js":
/*!*************************************************!*\
  !*** ./node_modules/bezier-easing/src/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * https://github.com/gre/bezier-easing\n * BezierEasing - use bezier curve for transition easing function\n * by Gaëtan Renaudeau 2014 - 2015 – MIT License\n */\n\n// These values are established by empiricism with tests (tradeoff: performance VS precision)\nvar NEWTON_ITERATIONS = 4;\nvar NEWTON_MIN_SLOPE = 0.001;\nvar SUBDIVISION_PRECISION = 0.0000001;\nvar SUBDIVISION_MAX_ITERATIONS = 10;\n\nvar kSplineTableSize = 11;\nvar kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);\n\nvar float32ArraySupported = typeof Float32Array === 'function';\n\nfunction A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }\nfunction B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }\nfunction C (aA1)      { return 3.0 * aA1; }\n\n// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.\nfunction calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }\n\n// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.\nfunction getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }\n\nfunction binarySubdivide (aX, aA, aB, mX1, mX2) {\n  var currentX, currentT, i = 0;\n  do {\n    currentT = aA + (aB - aA) / 2.0;\n    currentX = calcBezier(currentT, mX1, mX2) - aX;\n    if (currentX > 0.0) {\n      aB = currentT;\n    } else {\n      aA = currentT;\n    }\n  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);\n  return currentT;\n}\n\nfunction newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {\n for (var i = 0; i < NEWTON_ITERATIONS; ++i) {\n   var currentSlope = getSlope(aGuessT, mX1, mX2);\n   if (currentSlope === 0.0) {\n     return aGuessT;\n   }\n   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;\n   aGuessT -= currentX / currentSlope;\n }\n return aGuessT;\n}\n\nfunction LinearEasing (x) {\n  return x;\n}\n\nmodule.exports = function bezier (mX1, mY1, mX2, mY2) {\n  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {\n    throw new Error('bezier x values must be in [0, 1] range');\n  }\n\n  if (mX1 === mY1 && mX2 === mY2) {\n    return LinearEasing;\n  }\n\n  // Precompute samples table\n  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);\n  for (var i = 0; i < kSplineTableSize; ++i) {\n    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);\n  }\n\n  function getTForX (aX) {\n    var intervalStart = 0.0;\n    var currentSample = 1;\n    var lastSample = kSplineTableSize - 1;\n\n    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {\n      intervalStart += kSampleStepSize;\n    }\n    --currentSample;\n\n    // Interpolate to provide an initial guess for t\n    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);\n    var guessForT = intervalStart + dist * kSampleStepSize;\n\n    var initialSlope = getSlope(guessForT, mX1, mX2);\n    if (initialSlope >= NEWTON_MIN_SLOPE) {\n      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);\n    } else if (initialSlope === 0.0) {\n      return guessForT;\n    } else {\n      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);\n    }\n  }\n\n  return function BezierEasing (x) {\n    // Because JavaScript number are imprecise, we should guarantee the extremes are right.\n    if (x === 0) {\n      return 0;\n    }\n    if (x === 1) {\n      return 1;\n    }\n    return calcBezier(getTForX(x), mY1, mY2);\n  };\n};\n\n\n//# sourceURL=webpack:///./node_modules/bezier-easing/src/index.js?");

/***/ }),

/***/ "./node_modules/light-trails-inspector/dist/light-trails-inspector.esm.js":
/*!********************************************************************************!*\
  !*** ./node_modules/light-trails-inspector/dist/light-trails-inspector.esm.js ***!
  \********************************************************************************/
/*! exports provided: inspector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"inspector\", function() { return inspector; });\nfunction _defineProperty(obj, key, value) {\n  if (key in obj) {\n    Object.defineProperty(obj, key, {\n      value: value,\n      enumerable: true,\n      configurable: true,\n      writable: true\n    });\n  } else {\n    obj[key] = value;\n  }\n\n  return obj;\n}\n\nvar FrameType;\n\n(function (FrameType) {\n  FrameType[\"Pause\"] = \"Pause\";\n  FrameType[\"Delay\"] = \"Delay\";\n  FrameType[\"Set\"] = \"Set\";\n  FrameType[\"Tween\"] = \"Tween\";\n})(FrameType || (FrameType = {}));\n\nvar shouldSkipFrame = (currentTime, currentTimeIndex, frame) => {\n  if (frame.startAt > currentTime) return true;\n  if (frame.startAt === currentTime && frame.startIndex > currentTimeIndex) return true;\n  return false;\n};\n\nvar bg = {\n  [FrameType.Tween]: '#4d7a16',\n  [FrameType.Set]: 'lightgray',\n  [FrameType.Delay]: '#666',\n  [FrameType.Pause]: 'lightgray'\n};\nvar createBarEl = (frame, options, skipped) => {\n  var _frame$renderer;\n\n  var el = document.createElement('div');\n  var htmlPayload = 'renderer' in frame && ((_frame$renderer = frame.renderer) === null || _frame$renderer === void 0 ? void 0 : _frame$renderer.__EL) || undefined;\n\n  if (htmlPayload) {\n    el.textContent = \"[\".concat(htmlPayload.tagName, \"] \");\n  } else {\n    el.textContent = \"\".concat(frame.type);\n  }\n\n  el.title = \"[\".concat(frame.startAt, \" - \").concat(frame.startAt + frame.duration, \"] \").concat(frame.type);\n\n  if ('values' in frame) {\n    var values = \" (\".concat(Object.keys(frame.values).join(', '), \")\");\n    el.textContent += values;\n    el.title += values;\n  }\n\n  el.onclick = () => {\n    // eslint-disable-next-line no-console\n    console.log(frame);\n  };\n\n  if (htmlPayload) {\n    el.onmouseover = () => {\n      htmlPayload.style.outline = '2px solid red';\n      htmlPayload.style.outlineOffset = '2px';\n    };\n\n    el.onmouseout = () => {\n      htmlPayload.style.outline = '';\n      htmlPayload.style.outlineOffset = '';\n    };\n  }\n\n  el.style.opacity = skipped ? '0.3' : '1';\n  el.style.height = '14px';\n  el.style.lineHeight = '14px';\n  el.style.fontSize = '10px';\n  el.style.textIndent = '5px'; // el.style.overflow = 'hidden'\n\n  el.style.whiteSpace = 'nowrap';\n  el.style.marginBottom = '1px';\n  el.style.color = 'white';\n  el.style.marginLeft = frame.startAt / options.scale + 'px';\n\n  switch (frame.type) {\n    case FrameType.Pause:\n    case FrameType.Set:\n      el.style.width = 'auto';\n      el.style.color = bg[frame.type];\n      el.style.borderLeft = \"2px solid \".concat(bg[frame.type]);\n      break;\n\n    default:\n      el.style.backgroundColor = bg[frame.type];\n      el.style.width = frame.duration / options.scale + 'px';\n      el.style.borderRadius = '3px';\n      break;\n  }\n\n  return el;\n};\n\nvar createLineEl = options => {\n  var el = document.createElement('div');\n  el.style.position = 'absolute';\n  el.style.left = '0px';\n  el.style.top = '0';\n  el.style.bottom = '0';\n  el.style.backgroundColor = 'white';\n  el.style.width = '1px';\n  el.style.pointerEvents = 'none';\n  el.style.opacity = '0.7';\n\n  var update = timeOffset => {\n    el.style.left = \"\".concat(timeOffset / options.scale, \"px\");\n  };\n\n  return {\n    el,\n    update\n  };\n};\n\nvar createRootEl = options => {\n  var el = document.createElement('div');\n  el.style.zIndex = '10000';\n  el.style.position = 'absolute';\n  el.style.fontFamily = 'monospace';\n  el.style.overflow = 'auto';\n  el.style.left = '10px';\n  el.style.bottom = '110px';\n  el.style.backgroundColor = 'rgba(0,0,0,.1)';\n  el.style.width = options.width + 'px';\n  el.style.display = 'grid';\n  el.style.gridTemplateRows = '1fr';\n  el.style.gridGap = '10px';\n  return el;\n};\n\nvar createSeekEl = (options, onSeek) => {\n  var el = document.createElement('div');\n  el.style.backgroundColor = 'rgba(0,0,0,.5)';\n  el.style.height = '50px';\n  el.style.webkitUserSelect = null;\n  el.style.cursor = 'col-resize';\n  var seeking = false;\n\n  el.onmousedown = event => {\n    seeking = true;\n    onSeek(event.offsetX * options.scale);\n  };\n\n  el.onmouseup = () => {\n    seeking = false;\n  };\n\n  el.onmousemove = event => {\n    if (seeking) {\n      onSeek(event.offsetX * options.scale);\n    }\n  };\n\n  return el;\n};\n\nvar round = Math.round;\nvar createStatusEl = () => {\n  var el = document.createElement('div');\n  el.style.padding = '10px 10px 0';\n  el.style.color = 'white';\n\n  var update = status => {\n    var textStatus = status.playing ? 'Playing' : status.ended ? 'End' : \"Paused (\".concat(status.currentTimeIndex, \")\");\n    el.innerText = \"\".concat(round(status.currentTime), \"/\").concat(status.total, \" [\").concat(textStatus, \"]\");\n  };\n\n  return {\n    el,\n    update\n  };\n};\n\nvar inspectorOptions = {\n  width: window.innerWidth - 20,\n  scale: 4\n};\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\nvar inspector = anim => {\n  var status = anim.getStatus();\n  var rootEl = createRootEl(inspectorOptions);\n  var barsWrapperEl = document.createElement('div');\n  var statusEl = createStatusEl();\n  var lineEl = createLineEl(inspectorOptions);\n  var seekEl = createSeekEl(inspectorOptions, off => anim.seek(off));\n\n  var userOptions = _objectSpread({}, anim.__dev.options);\n\n  inspectorOptions.scale = anim.total / (inspectorOptions.width - 200);\n\n  anim.__dev.options.onUpdate = () => {\n    var _userOptions$onUpdate;\n\n    status = anim.getStatus();\n    (_userOptions$onUpdate = userOptions.onUpdate) === null || _userOptions$onUpdate === void 0 ? void 0 : _userOptions$onUpdate.call(userOptions);\n    render();\n  };\n\n  anim.__dev.options.onPause = () => {\n    var _userOptions$onPause;\n\n    status = anim.getStatus();\n    (_userOptions$onPause = userOptions.onPause) === null || _userOptions$onPause === void 0 ? void 0 : _userOptions$onPause.call(userOptions);\n    render();\n  };\n\n  anim.__dev.options.onComplete = () => {\n    var _userOptions$onComple;\n\n    status = anim.getStatus();\n    (_userOptions$onComple = userOptions.onComplete) === null || _userOptions$onComple === void 0 ? void 0 : _userOptions$onComple.call(userOptions);\n    render();\n  };\n\n  barsWrapperEl.style.maxHeight = '70vh';\n  barsWrapperEl.style.overflow = 'auto';\n\n  var render = () => {\n    barsWrapperEl.innerHTML = '';\n\n    anim.__dev.frames.forEach(frame => {\n      barsWrapperEl.appendChild(createBarEl(frame, inspectorOptions, shouldSkipFrame(status.currentTime, status.currentTimeIndex, frame)));\n    });\n\n    lineEl.update(status.currentTime);\n    lineEl.el.scrollIntoView({\n      behavior: 'auto',\n      inline: 'center',\n      block: 'center'\n    });\n    statusEl.update(status);\n  };\n\n  render();\n  rootEl.appendChild(statusEl.el);\n  rootEl.appendChild(seekEl);\n  rootEl.appendChild(barsWrapperEl);\n  rootEl.appendChild(lineEl.el);\n  document.body.appendChild(rootEl);\n};\n\n\n\n\n//# sourceURL=webpack:///./node_modules/light-trails-inspector/dist/light-trails-inspector.esm.js?");

/***/ }),

/***/ "./node_modules/light-trails/dist/light-trails.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/light-trails/dist/light-trails.esm.js ***!
  \************************************************************/
/*! exports provided: FrameType, cascade, color, colorChain, delay, easeIn, easeInOut, easeOut, fromTo, htmlElementRenderer, lightTrails, linear, parallel, pause, sequence, set, setCssValue, shouldSkipFrame, text, trail, val, valChain */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FrameType\", function() { return FrameType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cascade\", function() { return cascade; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"color\", function() { return color; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"colorChain\", function() { return colorChain; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"delay\", function() { return delay; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"easeIn\", function() { return easeIn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"easeInOut\", function() { return easeInOut; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"easeOut\", function() { return easeOut; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fromTo\", function() { return fromTo; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"htmlElementRenderer\", function() { return htmlElementRenderer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"lightTrails\", function() { return lightTrails; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"linear\", function() { return linear; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"parallel\", function() { return parallel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"pause\", function() { return pause; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"sequence\", function() { return sequence; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"set\", function() { return set; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setCssValue\", function() { return setCssValue; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"shouldSkipFrame\", function() { return shouldSkipFrame; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"text\", function() { return text; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"trail\", function() { return trail; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"val\", function() { return val; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"valChain\", function() { return valChain; });\nvar FrameType;\n\n(function (FrameType) {\n  FrameType[\"Pause\"] = \"Pause\";\n  FrameType[\"Delay\"] = \"Delay\";\n  FrameType[\"Set\"] = \"Set\";\n  FrameType[\"Tween\"] = \"Tween\";\n})(FrameType || (FrameType = {}));\n\nvar totalDuration = frames => Math.max(...frames.map(frame => frame.startAt + frame.duration));\n\nfunction _arrayWithHoles(arr) {\n  if (Array.isArray(arr)) return arr;\n}\n\nfunction _iterableToArrayLimit(arr, i) {\n  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === \"[object Arguments]\")) {\n    return;\n  }\n\n  var _arr = [];\n  var _n = true;\n  var _d = false;\n  var _e = undefined;\n\n  try {\n    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {\n      _arr.push(_s.value);\n\n      if (i && _arr.length === i) break;\n    }\n  } catch (err) {\n    _d = true;\n    _e = err;\n  } finally {\n    try {\n      if (!_n && _i[\"return\"] != null) _i[\"return\"]();\n    } finally {\n      if (_d) throw _e;\n    }\n  }\n\n  return _arr;\n}\n\nfunction _nonIterableRest() {\n  throw new TypeError(\"Invalid attempt to destructure non-iterable instance\");\n}\n\nfunction _slicedToArray(arr, i) {\n  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();\n}\n\nvar mapValues = (object, mapFunction) => Object.fromEntries(Object.entries(object).map((_ref) => {\n  var _ref2 = _slicedToArray(_ref, 2),\n      key = _ref2[0],\n      value = _ref2[1];\n\n  return [key, mapFunction(value)];\n}));\nvar limit = function limit(value) {\n  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;\n  return Math.min(Math.max(value, min), max);\n};\n\nvar shouldSkipFrame = (currentTime, currentTimeIndex, frame) => {\n  if (frame.startAt > currentTime) return true;\n  if (frame.startAt === currentTime && frame.startIndex > currentTimeIndex) return true;\n  return false;\n};\n\nvar render = (currentTime, currentTimeIndex, frames) => {\n  for (var i = frames.length - 1; i >= 0; i--) {\n    var frame = frames[i];\n\n    switch (frame.type) {\n      case FrameType.Tween:\n        frame.renderer(mapValues(frame.values, val => val(0)));\n        break;\n\n      case FrameType.Set:\n        frame.renderer(mapValues(frame.values, val => val[0]));\n        break;\n    }\n  }\n\n  var _iteratorNormalCompletion = true;\n  var _didIteratorError = false;\n  var _iteratorError = undefined;\n\n  try {\n    var _loop = function _loop() {\n      var frame = _step.value;\n      if (shouldSkipFrame(currentTime, currentTimeIndex, frame)) return \"continue\";\n\n      switch (frame.type) {\n        case FrameType.Tween:\n          frame.renderer(mapValues(frame.values, val => {\n            var n = limit((currentTime - frame.startAt) / frame.duration);\n            return val(frame.easing(n));\n          }));\n          break;\n\n        case FrameType.Set:\n          frame.renderer(mapValues(frame.values, val => {\n            var _val = _slicedToArray(val, 2),\n                off = _val[0],\n                on = _val[1];\n\n            return currentTime >= frame.startAt + frame.duration ? on : off;\n          }));\n          break;\n      }\n    };\n\n    for (var _iterator = frames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n      var _ret = _loop();\n\n      if (_ret === \"continue\") continue;\n    }\n  } catch (err) {\n    _didIteratorError = true;\n    _iteratorError = err;\n  } finally {\n    try {\n      if (!_iteratorNormalCompletion && _iterator.return != null) {\n        _iterator.return();\n      }\n    } finally {\n      if (_didIteratorError) {\n        throw _iteratorError;\n      }\n    }\n  }\n};\n\nvar findTextStepTime = (prevTime, prevTimeIndex, nextTime, total, frames) => {\n  var _iteratorNormalCompletion = true;\n  var _didIteratorError = false;\n  var _iteratorError = undefined;\n\n  try {\n    for (var _iterator = frames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n      var frame = _step.value;\n\n      if (frame.type === FrameType.Pause && frame.startAt >= prevTime && frame.startAt <= nextTime && frame.startIndex > prevTimeIndex) {\n        return {\n          nextTime: frame.startAt,\n          nextTimeIndex: frame.startIndex,\n          pause: true,\n          end: false\n        };\n      }\n    }\n  } catch (err) {\n    _didIteratorError = true;\n    _iteratorError = err;\n  } finally {\n    try {\n      if (!_iteratorNormalCompletion && _iterator.return != null) {\n        _iterator.return();\n      }\n    } finally {\n      if (_didIteratorError) {\n        throw _iteratorError;\n      }\n    }\n  }\n\n  if (nextTime > total) {\n    return {\n      nextTime: total,\n      nextTimeIndex: 0,\n      pause: true,\n      end: true\n    };\n  }\n\n  return {\n    nextTime,\n    nextTimeIndex: 0,\n    pause: false,\n    end: false\n  };\n};\n\n// @TODO make this immutable\nvar prepareFrames = frames => {\n  frames.sort((a, b) => a.startAt - b.startAt);\n\n  for (var i = 0; i < frames.length; i++) {\n    var frame = frames[i];\n    var prevFrame = frames[i - 1];\n    var nextFrame = frames[i + 1];\n\n    if (prevFrame && prevFrame.startAt === frame.startAt) {\n      frame.startIndex = prevFrame.startIndex + 1;\n    } else if (nextFrame && nextFrame.startAt === frame.startAt) {\n      frame.startIndex = 1;\n    }\n  }\n\n  return frames;\n};\n\nvar lightTrails = function lightTrails(trailFunction) {\n  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n  var currentTime = 0;\n  var currentTimeIndex = 0;\n  var playing = false;\n  var frames = prepareFrames(trailFunction(0));\n  var total = totalDuration(frames);\n\n  var prepare = () => {\n    render(currentTime, currentTimeIndex, frames);\n  };\n\n  var seek = function seek(time) {\n    var offsetIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n    currentTime = time;\n    currentTimeIndex = offsetIndex;\n    updateOnCurrent();\n  };\n\n  var updateOnCurrent = () => {\n    var _options$onUpdate;\n\n    render(currentTime, currentTimeIndex, frames);\n    (_options$onUpdate = options.onUpdate) === null || _options$onUpdate === void 0 ? void 0 : _options$onUpdate.call(options);\n  };\n\n  var play = () => {\n    var _options$onPlay;\n\n    var start = 0;\n    playing = true;\n    (_options$onPlay = options.onPlay) === null || _options$onPlay === void 0 ? void 0 : _options$onPlay.call(options);\n\n    var step = time => {\n      if (!start) {\n        start = time; // skip first frame\n\n        requestAnimationFrame(step);\n        return;\n      }\n\n      var diff = time - start;\n      start = time;\n\n      var _findTextStepTime = findTextStepTime(currentTime, currentTimeIndex, currentTime + diff, total, frames),\n          nextTime = _findTextStepTime.nextTime,\n          nextTimeIndex = _findTextStepTime.nextTimeIndex,\n          pause = _findTextStepTime.pause,\n          end = _findTextStepTime.end;\n\n      currentTime = nextTime;\n      currentTimeIndex = nextTimeIndex;\n      updateOnCurrent();\n\n      if (end) {\n        var _options$onComplete;\n\n        playing = false;\n        (_options$onComplete = options.onComplete) === null || _options$onComplete === void 0 ? void 0 : _options$onComplete.call(options);\n        return;\n      }\n\n      if (!playing || pause) {\n        var _options$onPause;\n\n        playing = false;\n        (_options$onPause = options.onPause) === null || _options$onPause === void 0 ? void 0 : _options$onPause.call(options);\n        return;\n      }\n\n      requestAnimationFrame(step);\n    };\n\n    requestAnimationFrame(step);\n  };\n\n  var pause = () => {\n    playing = false;\n  };\n\n  var getStatus = () => ({\n    playing,\n    ended: currentTime === total,\n    started: currentTime > 0,\n    currentTime,\n    currentTimeIndex,\n    total\n  });\n\n  return {\n    prepare,\n    play,\n    pause,\n    seek,\n    total,\n    getStatus,\n    __dev: {\n      options,\n      frames\n    }\n  };\n};\n\nfunction _objectWithoutPropertiesLoose(source, excluded) {\n  if (source == null) return {};\n  var target = {};\n  var sourceKeys = Object.keys(source);\n  var key, i;\n\n  for (i = 0; i < sourceKeys.length; i++) {\n    key = sourceKeys[i];\n    if (excluded.indexOf(key) >= 0) continue;\n    target[key] = source[key];\n  }\n\n  return target;\n}\n\nfunction _objectWithoutProperties(source, excluded) {\n  if (source == null) return {};\n  var target = _objectWithoutPropertiesLoose(source, excluded);\n  var key, i;\n\n  if (Object.getOwnPropertySymbols) {\n    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);\n\n    for (i = 0; i < sourceSymbolKeys.length; i++) {\n      key = sourceSymbolKeys[i];\n      if (excluded.indexOf(key) >= 0) continue;\n      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;\n      target[key] = source[key];\n    }\n  }\n\n  return target;\n}\n\nvar selectElement = selector => {\n  if (typeof selector === 'string') {\n    var element = document.querySelector(selector);\n\n    if (!element) {\n      throw new Error(\"[lighting] Element (\".concat(selector, \") not found\"));\n    }\n\n    return element;\n  }\n\n  return selector;\n};\n\nvar htmlElementRenderer = selector => {\n  var element = selectElement(selector);\n\n  var renderer = values => {\n    var text = values.text,\n        x = values.x,\n        y = values.y,\n        scale = values.scale,\n        skewX = values.skewX,\n        skewY = values.skewY,\n        rotate = values.rotate,\n        styles = _objectWithoutProperties(values, [\"text\", \"x\", \"y\", \"scale\", \"skewX\", \"skewY\", \"rotate\"]);\n\n    setCssValue(element, styles);\n\n    if (text !== undefined) {\n      element.textContent = text;\n    }\n\n    var transform = getTransform({\n      x,\n      y,\n      scale,\n      skewX,\n      skewY,\n      rotate\n    });\n\n    if (transform) {\n      setCssValue(element, {\n        transform\n      });\n    }\n  }; // @ts-ignore\n\n\n  renderer.__EL = element;\n  return renderer;\n};\n\nvar getTransform = values => {\n  var val = [];\n\n  if (values.x !== undefined || values.y !== undefined) {\n    var _values$x = values.x,\n        x = _values$x === void 0 ? 0 : _values$x,\n        _values$y = values.y,\n        y = _values$y === void 0 ? 0 : _values$y;\n    val.push(\"translate(\".concat(x, \", \").concat(y, \")\"));\n  }\n\n  if (values.rotate !== undefined) {\n    val.push(\"rotate(\".concat(values.rotate, \")\"));\n  }\n\n  if (values.scale !== undefined) {\n    val.push(\"scale(\".concat(values.scale, \")\"));\n  }\n\n  if (values.skewX !== undefined) {\n    val.push(\"skewX(\".concat(values.skewX, \")\"));\n  }\n\n  if (values.skewY !== undefined) {\n    val.push(\"skewY(\".concat(values.skewY, \")\"));\n  }\n\n  if (!val.length) {\n    return undefined;\n  }\n\n  return val.join(' ');\n};\n\nvar setCssValue = (el, value) => {\n  Object.assign(el.style, value);\n};\n\nvar trail = (target, operators) => {\n  var renderer = findRenderer(target);\n  return startAt => {\n    var offset = startAt;\n    var frames = operators.map(operator => {\n      var frame = operator(offset);\n\n      if (typeof frame === 'function') {\n        frame = frame(renderer);\n      }\n\n      offset += Math.max(...frame.map(frame => frame.duration));\n      return frame;\n    }).flat();\n    return frames;\n  };\n};\n\nvar findRenderer = target => {\n  if (typeof target === 'function') {\n    return target;\n  }\n\n  if (typeof target === 'string' || target instanceof HTMLElement) {\n    return htmlElementRenderer(target);\n  }\n\n  throw new Error(\"[lighting:animate] Invalid renderer (\".concat(target.toString(), \")\"));\n};\n\nvar cascade = (frames, options) => startAt => frames.flatMap((frameFn, index) => {\n  var offset = options.offset(index) + startAt;\n  return frameFn(offset);\n});\n\nvar parallel = frames => startAt => frames.flatMap(frameFn => frameFn(startAt));\n\nvar sequence = frames => startAt => {\n  var offset = startAt;\n  return frames.flatMap(frameFn => {\n    var frame = frameFn(offset);\n    offset = totalDuration(frame);\n    return frame;\n  });\n};\n\nvar pow = Math.pow,\n    sin = Math.sin;\nvar PI = Math.PI;\nvar easeInOut = n => 0.5 * (sin((n - 0.5) * PI) + 1);\nvar easeIn = n => pow(n, 1.675);\nvar easeOut = n => 1 - pow(1 - n, 1.675);\nvar linear = x => x;\n\nvar fromTo = function fromTo(values, duration) {\n  var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : easeInOut;\n  return startAt => renderer => [{\n    type: FrameType.Tween,\n    startAt,\n    startIndex: 0,\n    duration,\n    values,\n    renderer,\n    easing\n  }];\n};\nvar set = values => startAt => renderer => [{\n  type: FrameType.Set,\n  startAt,\n  startIndex: 0,\n  duration: 0,\n  values,\n  renderer\n}];\nvar delay = duration => startAt => [{\n  type: FrameType.Delay,\n  startAt,\n  startIndex: 0,\n  duration\n}];\nvar pause = () => startAt => [{\n  type: FrameType.Pause,\n  startAt,\n  startIndex: 0,\n  duration: 0\n}];\n\nvar colorToString = color => \"rgba(\".concat(color.join(', '), \")\");\n\nvar colorFromHEX = color => {\n  var r = parseInt(color.substring(1, 3), 16);\n  var g = parseInt(color.substring(3, 5), 16);\n  var b = parseInt(color.substring(5, 7), 16);\n  return [r, g, b, 1];\n};\n\nvar colorFromRGB = color => {\n  var _color$match$map = color.match(/(\\d|\\.)+/g).map(Number),\n      _color$match$map2 = _slicedToArray(_color$match$map, 4),\n      r = _color$match$map2[0],\n      g = _color$match$map2[1],\n      b = _color$match$map2[2],\n      _color$match$map2$ = _color$match$map2[3],\n      a = _color$match$map2$ === void 0 ? 1 : _color$match$map2$;\n\n  return [r, g, b, a];\n};\n\nvar getColor = color => {\n  if (color.startsWith('#')) {\n    if (color.length === 4) {\n      var _color = _slicedToArray(color, 4),\n          r = _color[1],\n          g = _color[2],\n          b = _color[3];\n\n      var longHex = '#' + r + r + g + g + b + b;\n      return colorFromHEX(longHex);\n    }\n\n    return colorFromHEX(color);\n  }\n\n  if (color.startsWith('rgb')) {\n    return colorFromRGB(color);\n  }\n\n  throw new Error(\"[lighting:color] Unknown color \\\"\".concat(color, \"\\\", use hex, rgb or rgba\"));\n};\n\nvar color = (a, b) => {\n  var c1 = getColor(a);\n  var c2 = getColor(b);\n  return p => {\n    var n = limit(p);\n    var c = [];\n\n    for (var i = 0; i < 3; i++) {\n      var ce1 = c1[i] * c1[i];\n      var ce2 = c2[i] * c2[i];\n      c[i] = Math.sqrt(n * (ce2 - ce1) + ce1) >> 0;\n    }\n\n    c[3] = (c2[3] - c1[3]) * n + c1[3];\n    return colorToString(c);\n  };\n};\nvar colorChain = a => {\n  var pref = a;\n  return b => {\n    var newVal = color(pref, b);\n    pref = b;\n    return newVal;\n  };\n};\n\nvar text = txt => n => {\n  return txt.substr(0, txt.length * n);\n};\n\nvar val = (a, b, suffix) => n => {\n  var val = (b - a) * n + a;\n  return suffix ? val + suffix : val;\n};\nvar valChain = (a, suffix) => {\n  var pref = a;\n  return b => {\n    var newVal = val(pref, b, suffix);\n    pref = b;\n    return newVal;\n  };\n};\n\n\n\n\n//# sourceURL=webpack:///./node_modules/light-trails/dist/light-trails.esm.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var light_trails__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! light-trails */ \"./node_modules/light-trails/dist/light-trails.esm.js\");\n/* harmony import */ var light_trails_inspector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! light-trails-inspector */ \"./node_modules/light-trails-inspector/dist/light-trails-inspector.esm.js\");\n/* harmony import */ var bezier_easing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bezier-easing */ \"./node_modules/bezier-easing/src/index.js\");\n/* harmony import */ var bezier_easing__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bezier_easing__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\n// const easeFlip = BezierEasing(0.36, 1.7, 0.3, 0.95);\nconst easeFlip = bezier_easing__WEBPACK_IMPORTED_MODULE_2___default()(0.34, 1.4, 0.5, 1);\nconst easeFlip2 = bezier_easing__WEBPACK_IMPORTED_MODULE_2___default()(0.34, 1.8, 0.5, 1);\nconst easeOut = bezier_easing__WEBPACK_IMPORTED_MODULE_2___default()(0.1, 0.85, 0.31, 0.99);\nconst glassLeft = Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"trail\"])('#Glass', [\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"fromTo\"])(\n        {\n            rotate: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(180, 0, 'deg'),\n            x: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(150, 0, 'px'),\n            opacity: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(0, 1)\n        },\n        1600,\n        easeFlip\n    )\n]);\n\nconst liquidLeft = Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"trail\"])('#liquid', [\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"fromTo\"])(\n        {\n            rotate: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(-240, 0, 'deg')\n        },\n        2000,\n        easeFlip\n    )\n]);\nconst text1 = Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"trail\"])('#Front', [\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"delay\"])(150),\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"fromTo\"])(\n        {\n            x: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(50, 0, 'px'),\n            opacity: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(0, 1)\n        },\n        1800,\n        easeFlip2\n    )\n]);\nconst text2 = Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"trail\"])('#Cooking', [\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"delay\"])(150),\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"fromTo\"])(\n        {\n            x: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(50, 0, 'px'),\n            opacity: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(0, 1)\n        },\n        2000,\n        easeFlip2\n    )\n]);\nconst text3 = Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"trail\"])('#dot', [\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"delay\"])(500),\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"fromTo\"])(\n        {\n            scale: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(0, 1),\n            x: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(20, 0, 'px'),\n            opacity: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(0, 1)\n        },\n        1000,\n        easeFlip2\n    )\n]);\nconst bubbles = Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"trail\"])('#bubbles', [\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"delay\"])(900),\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"fromTo\"])(\n        {\n            opacity: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(0, 1),\n            rotate: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(-25, 0, 'deg'),\n            scale: Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"val\"])(0.6, 1)\n        },\n        2000,\n        easeFlip\n    )\n]);\nconst animation = Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"lightTrails\"])(\n    Object(light_trails__WEBPACK_IMPORTED_MODULE_0__[\"parallel\"])([glassLeft, liquidLeft, text1, text2, text3, bubbles])\n);\n\nanimation.play();\n\ndocument.getElementById('logo').onclick = () => {\n    animation.seek(0);\n    animation.play();\n};\n\nObject(light_trails_inspector__WEBPACK_IMPORTED_MODULE_1__[\"inspector\"])(animation);\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });