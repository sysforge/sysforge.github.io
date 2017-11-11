/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getAiMove = __webpack_require__(1);
	
	var _getAiMove2 = _interopRequireDefault(_getAiMove);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// eslint-disable-next-line
	onmessage = function onmessage(e) {
	  var oldGame = e.data;
	  var position = (0, _getAiMove2.default)(oldGame);
	
	  postMessage({
	    oldGame: oldGame,
	    position: position
	  });
	};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _getBestPositions = __webpack_require__(2);
	
	var _getBestPositions2 = _interopRequireDefault(_getBestPositions);
	
	var _getNetwork = __webpack_require__(333);
	
	var _getNetwork2 = _interopRequireDefault(_getNetwork);
	
	var _getPositionIndex = __webpack_require__(335);
	
	var _getPositionIndex2 = _interopRequireDefault(_getPositionIndex);
	
	var _move = __webpack_require__(328);
	
	var _move2 = _interopRequireDefault(_move);
	
	var _ramda = __webpack_require__(5);
	
	var _ptzMath = __webpack_require__(336);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var net = (0, _getNetwork2.default)();
	
	var learningRates = {
	  invalidMove: 0.1,
	  validMove: 0.6,
	  win: 1,
	  lost: 0
	};
	
	/**
	 * Get ai move index position
	 * @param {*} oldGame game
	 * @return {Number} position index
	 */
	var getAiMove = function getAiMove(oldGame) {
	  if ((0, _ramda.isNil)(oldGame)) {
	    return oldGame;
	  }
	
	  var output = net.activate([oldGame.board]);
	
	  var index = (0, _getPositionIndex2.default)(output);
	
	  var newGame = (0, _move2.default)(oldGame, index);
	
	  if (newGame && newGame.ended) {
	    net.propagate(learningRates.win, newGame.board);
	    return index;
	  } else {
	
	    var bestPositions = (0, _getBestPositions2.default)(oldGame);
	
	    if ((0, _ramda.any)(function (p) {
	      return index === p;
	    }, bestPositions)) {
	      net.propagate(learningRates.validMove, newGame.board);
	      return index;
	    } else {
	      var bestPosition = (0, _ptzMath.getRandomItem)(bestPositions);
	      var gameAfterBestMove = (0, _move2.default)(oldGame, bestPosition);
	      net.propagate(learningRates.invalidMove, gameAfterBestMove.board);
	
	      return bestPosition;
	    }
	  }
	};
	
	exports.default = getAiMove;
	module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _getEmptyPositions = __webpack_require__(3);
	
	var _getEmptyPositions2 = _interopRequireDefault(_getEmptyPositions);
	
	var _move = __webpack_require__(328);
	
	var _move2 = _interopRequireDefault(_move);
	
	var _ramda = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Get another item from the list
	 * 
	 * #TODO: Move to ptz-fp
	 * 
	 * @param {*} item item to be excluded
	 * @param {*} list list to get a different item
	 * @return {*} another item
	 */
	var getOther = function getOther(item, list) {
	  return (0, _ramda.pipe)((0, _ramda.filter)(function (i) {
	    return i !== item;
	  }), _ramda.head)(list);
	};
	
	/**
	 * Get Win Positions or Empty Positions
	 * @func
	 * @param {[Number]} oldGame old game
	 * @return {Number} random empty position
	 */
	var getBestPositions = function getBestPositions(oldGame) {
	  var emptyPositions = (0, _getEmptyPositions2.default)(oldGame.board);
	
	  var winPositions = emptyPositions.filter(function (position) {
	    var testGame = (0, _move2.default)(oldGame, position);
	    return testGame.ended;
	  });
	
	  if (winPositions.length > 0) {
	    return winPositions;
	  }
	
	  var losePositions = emptyPositions.filter(function (position) {
	    var testGame = (0, _move2.default)(oldGame, getOther(position, emptyPositions));
	    var testGame2 = (0, _move2.default)(testGame, position);
	    return testGame2.ended;
	  });
	
	  return losePositions.length > 0 ? losePositions : emptyPositions;
	};
	
	exports.default = getBestPositions;
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _constants = __webpack_require__(4);
	
	var _isPositionEmpty = __webpack_require__(323);
	
	var _isPositionEmpty2 = _interopRequireDefault(_isPositionEmpty);
	
	var _ramda = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Get all empty positions indexes
	 * @param {Number} board board bits
	 * @return {[Number]} indexes array
	 */
	var getEmptyPositions = function getEmptyPositions(board) {
	  return (0, _ramda.filter)(function (i) {
	    return (0, _isPositionEmpty2.default)(board, i);
	  }, _constants.boardIndexes);
	};
	
	exports.default = getEmptyPositions;
	module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.initialScore = exports.O = exports.X = exports._ = exports.emptyValue = exports.boardLength = exports.boardIndexes = undefined;
	
	var _ramda = __webpack_require__(5);
	
	var emptyValue = 0;
	
	/**
	 * Empty value alias
	 */
	var _ = emptyValue;
	
	var X = 1;
	
	var O = 2;
	
	/**
	 * Use it to map the positions
	 */
	var boardIndexes = (0, _ramda.range)(0, 9);
	var boardLength = (0, _ramda.length)(boardIndexes);
	
	var initialScore = {
	  x: 0,
	  o: 0
	};
	
	exports.boardIndexes = boardIndexes;
	exports.boardLength = boardLength;
	exports.emptyValue = emptyValue;
	exports._ = _;
	exports.X = X;
	exports.O = O;
	exports.initialScore = initialScore;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = {
	  F: __webpack_require__(6),
	  T: __webpack_require__(10),
	  __: __webpack_require__(11),
	  add: __webpack_require__(12),
	  addIndex: __webpack_require__(14),
	  adjust: __webpack_require__(19),
	  all: __webpack_require__(21),
	  allPass: __webpack_require__(28),
	  always: __webpack_require__(7),
	  and: __webpack_require__(44),
	  any: __webpack_require__(45),
	  anyPass: __webpack_require__(47),
	  ap: __webpack_require__(48),
	  aperture: __webpack_require__(49),
	  append: __webpack_require__(52),
	  apply: __webpack_require__(53),
	  applySpec: __webpack_require__(54),
	  ascend: __webpack_require__(56),
	  assoc: __webpack_require__(57),
	  assocPath: __webpack_require__(58),
	  binary: __webpack_require__(61),
	  bind: __webpack_require__(37),
	  both: __webpack_require__(63),
	  call: __webpack_require__(67),
	  chain: __webpack_require__(69),
	  clamp: __webpack_require__(74),
	  clone: __webpack_require__(75),
	  comparator: __webpack_require__(79),
	  complement: __webpack_require__(80),
	  compose: __webpack_require__(82),
	  composeK: __webpack_require__(89),
	  composeP: __webpack_require__(90),
	  concat: __webpack_require__(93),
	  cond: __webpack_require__(111),
	  construct: __webpack_require__(112),
	  constructN: __webpack_require__(113),
	  contains: __webpack_require__(114),
	  converge: __webpack_require__(115),
	  countBy: __webpack_require__(116),
	  curry: __webpack_require__(68),
	  curryN: __webpack_require__(16),
	  dec: __webpack_require__(119),
	  defaultTo: __webpack_require__(120),
	  descend: __webpack_require__(121),
	  difference: __webpack_require__(122),
	  differenceWith: __webpack_require__(123),
	  dissoc: __webpack_require__(125),
	  dissocPath: __webpack_require__(126),
	  divide: __webpack_require__(129),
	  drop: __webpack_require__(130),
	  dropLast: __webpack_require__(132),
	  dropLastWhile: __webpack_require__(137),
	  dropRepeats: __webpack_require__(140),
	  dropRepeatsWith: __webpack_require__(142),
	  dropWhile: __webpack_require__(145),
	  either: __webpack_require__(147),
	  empty: __webpack_require__(149),
	  endsWith: __webpack_require__(150),
	  eqBy: __webpack_require__(152),
	  eqProps: __webpack_require__(153),
	  equals: __webpack_require__(98),
	  evolve: __webpack_require__(154),
	  filter: __webpack_require__(107),
	  find: __webpack_require__(155),
	  findIndex: __webpack_require__(157),
	  findLast: __webpack_require__(159),
	  findLastIndex: __webpack_require__(161),
	  flatten: __webpack_require__(163),
	  flip: __webpack_require__(164),
	  forEach: __webpack_require__(165),
	  forEachObjIndexed: __webpack_require__(166),
	  fromPairs: __webpack_require__(167),
	  groupBy: __webpack_require__(168),
	  groupWith: __webpack_require__(169),
	  gt: __webpack_require__(170),
	  gte: __webpack_require__(171),
	  has: __webpack_require__(172),
	  hasIn: __webpack_require__(173),
	  head: __webpack_require__(174),
	  identical: __webpack_require__(102),
	  identity: __webpack_require__(175),
	  ifElse: __webpack_require__(177),
	  inc: __webpack_require__(178),
	  indexBy: __webpack_require__(179),
	  indexOf: __webpack_require__(180),
	  init: __webpack_require__(181),
	  innerJoin: __webpack_require__(182),
	  insert: __webpack_require__(183),
	  insertAll: __webpack_require__(184),
	  intersection: __webpack_require__(185),
	  intersectionWith: __webpack_require__(189),
	  intersperse: __webpack_require__(191),
	  into: __webpack_require__(192),
	  invert: __webpack_require__(197),
	  invertObj: __webpack_require__(198),
	  invoker: __webpack_require__(199),
	  is: __webpack_require__(200),
	  isEmpty: __webpack_require__(201),
	  isNil: __webpack_require__(60),
	  join: __webpack_require__(202),
	  juxt: __webpack_require__(203),
	  keys: __webpack_require__(39),
	  keysIn: __webpack_require__(204),
	  last: __webpack_require__(143),
	  lastIndexOf: __webpack_require__(205),
	  length: __webpack_require__(206),
	  lens: __webpack_require__(208),
	  lensIndex: __webpack_require__(209),
	  lensPath: __webpack_require__(210),
	  lensProp: __webpack_require__(212),
	  lift: __webpack_require__(65),
	  liftN: __webpack_require__(66),
	  lt: __webpack_require__(213),
	  lte: __webpack_require__(214),
	  map: __webpack_require__(31),
	  mapAccum: __webpack_require__(215),
	  mapAccumRight: __webpack_require__(216),
	  mapObjIndexed: __webpack_require__(217),
	  match: __webpack_require__(218),
	  mathMod: __webpack_require__(219),
	  max: __webpack_require__(29),
	  maxBy: __webpack_require__(220),
	  mean: __webpack_require__(221),
	  median: __webpack_require__(223),
	  memoize: __webpack_require__(224),
	  memoizeWith: __webpack_require__(225),
	  merge: __webpack_require__(226),
	  mergeAll: __webpack_require__(227),
	  mergeDeepLeft: __webpack_require__(228),
	  mergeDeepRight: __webpack_require__(231),
	  mergeDeepWith: __webpack_require__(232),
	  mergeDeepWithKey: __webpack_require__(229),
	  mergeWith: __webpack_require__(233),
	  mergeWithKey: __webpack_require__(230),
	  min: __webpack_require__(234),
	  minBy: __webpack_require__(235),
	  modulo: __webpack_require__(236),
	  multiply: __webpack_require__(237),
	  nAry: __webpack_require__(62),
	  negate: __webpack_require__(238),
	  none: __webpack_require__(239),
	  not: __webpack_require__(81),
	  nth: __webpack_require__(144),
	  nthArg: __webpack_require__(240),
	  o: __webpack_require__(241),
	  objOf: __webpack_require__(196),
	  of: __webpack_require__(242),
	  omit: __webpack_require__(244),
	  once: __webpack_require__(245),
	  or: __webpack_require__(148),
	  over: __webpack_require__(246),
	  pair: __webpack_require__(247),
	  partial: __webpack_require__(248),
	  partialRight: __webpack_require__(250),
	  partition: __webpack_require__(251),
	  path: __webpack_require__(211),
	  pathEq: __webpack_require__(252),
	  pathOr: __webpack_require__(253),
	  pathSatisfies: __webpack_require__(254),
	  pick: __webpack_require__(255),
	  pickAll: __webpack_require__(256),
	  pickBy: __webpack_require__(257),
	  pipe: __webpack_require__(83),
	  pipeK: __webpack_require__(258),
	  pipeP: __webpack_require__(91),
	  pluck: __webpack_require__(30),
	  prepend: __webpack_require__(259),
	  product: __webpack_require__(260),
	  project: __webpack_require__(261),
	  prop: __webpack_require__(42),
	  propEq: __webpack_require__(263),
	  propIs: __webpack_require__(264),
	  propOr: __webpack_require__(265),
	  propSatisfies: __webpack_require__(266),
	  props: __webpack_require__(267),
	  range: __webpack_require__(268),
	  reduce: __webpack_require__(43),
	  reduceBy: __webpack_require__(117),
	  reduceRight: __webpack_require__(269),
	  reduceWhile: __webpack_require__(270),
	  reduced: __webpack_require__(271),
	  reject: __webpack_require__(105),
	  remove: __webpack_require__(127),
	  repeat: __webpack_require__(272),
	  replace: __webpack_require__(274),
	  reverse: __webpack_require__(88),
	  scan: __webpack_require__(275),
	  sequence: __webpack_require__(276),
	  set: __webpack_require__(277),
	  slice: __webpack_require__(87),
	  sort: __webpack_require__(278),
	  sortBy: __webpack_require__(279),
	  sortWith: __webpack_require__(280),
	  split: __webpack_require__(281),
	  splitAt: __webpack_require__(282),
	  splitEvery: __webpack_require__(283),
	  splitWhen: __webpack_require__(284),
	  startsWith: __webpack_require__(285),
	  subtract: __webpack_require__(286),
	  sum: __webpack_require__(222),
	  symmetricDifference: __webpack_require__(287),
	  symmetricDifferenceWith: __webpack_require__(288),
	  tail: __webpack_require__(85),
	  take: __webpack_require__(134),
	  takeLast: __webpack_require__(151),
	  takeLastWhile: __webpack_require__(289),
	  takeWhile: __webpack_require__(290),
	  tap: __webpack_require__(292),
	  test: __webpack_require__(293),
	  times: __webpack_require__(273),
	  toLower: __webpack_require__(295),
	  toPairs: __webpack_require__(296),
	  toPairsIn: __webpack_require__(297),
	  toString: __webpack_require__(94),
	  toUpper: __webpack_require__(298),
	  transduce: __webpack_require__(299),
	  transpose: __webpack_require__(300),
	  traverse: __webpack_require__(301),
	  trim: __webpack_require__(302),
	  tryCatch: __webpack_require__(303),
	  type: __webpack_require__(78),
	  unapply: __webpack_require__(304),
	  unary: __webpack_require__(305),
	  uncurryN: __webpack_require__(306),
	  unfold: __webpack_require__(307),
	  union: __webpack_require__(308),
	  unionWith: __webpack_require__(309),
	  uniq: __webpack_require__(186),
	  uniqBy: __webpack_require__(187),
	  uniqWith: __webpack_require__(190),
	  unless: __webpack_require__(310),
	  unnest: __webpack_require__(311),
	  until: __webpack_require__(312),
	  update: __webpack_require__(128),
	  useWith: __webpack_require__(262),
	  values: __webpack_require__(55),
	  valuesIn: __webpack_require__(313),
	  view: __webpack_require__(314),
	  when: __webpack_require__(315),
	  where: __webpack_require__(316),
	  whereEq: __webpack_require__(317),
	  without: __webpack_require__(318),
	  xprod: __webpack_require__(319),
	  zip: __webpack_require__(320),
	  zipObj: __webpack_require__(321),
	  zipWith: __webpack_require__(322)
	};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var always = __webpack_require__(7);
	
	
	/**
	 * A function that always returns `false`. Any passed in parameters are ignored.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Function
	 * @sig * -> Boolean
	 * @param {*}
	 * @return {Boolean}
	 * @see R.always, R.T
	 * @example
	 *
	 *      R.F(); //=> false
	 */
	module.exports = always(false);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Returns a function that always returns the given value. Note that for
	 * non-primitives the value returned is a reference to the original value.
	 *
	 * This function is known as `const`, `constant`, or `K` (for K combinator) in
	 * other languages and libraries.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig a -> (* -> a)
	 * @param {*} val The value to wrap in a function
	 * @return {Function} A Function :: * -> val.
	 * @example
	 *
	 *      var t = R.always('Tee');
	 *      t(); //=> 'Tee'
	 */
	module.exports = _curry1(function always(val) {
	  return function() {
	    return val;
	  };
	});


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var _isPlaceholder = __webpack_require__(9);
	
	
	/**
	 * Optimized internal one-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry1(fn) {
	  return function f1(a) {
	    if (arguments.length === 0 || _isPlaceholder(a)) {
	      return f1;
	    } else {
	      return fn.apply(this, arguments);
	    }
	  };
	};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	module.exports = function _isPlaceholder(a) {
	  return a != null &&
	         typeof a === 'object' &&
	         a['@@functional/placeholder'] === true;
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var always = __webpack_require__(7);
	
	
	/**
	 * A function that always returns `true`. Any passed in parameters are ignored.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Function
	 * @sig * -> Boolean
	 * @param {*}
	 * @return {Boolean}
	 * @see R.always, R.F
	 * @example
	 *
	 *      R.T(); //=> true
	 */
	module.exports = always(true);


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	/**
	 * A special placeholder value used to specify "gaps" within curried functions,
	 * allowing partial application of any combination of arguments, regardless of
	 * their positions.
	 *
	 * If `g` is a curried ternary function and `_` is `R.__`, the following are
	 * equivalent:
	 *
	 *   - `g(1, 2, 3)`
	 *   - `g(_, 2, 3)(1)`
	 *   - `g(_, _, 3)(1)(2)`
	 *   - `g(_, _, 3)(1, 2)`
	 *   - `g(_, 2, _)(1, 3)`
	 *   - `g(_, 2)(1)(3)`
	 *   - `g(_, 2)(1, 3)`
	 *   - `g(_, 2)(_, 3)(1)`
	 *
	 * @constant
	 * @memberOf R
	 * @since v0.6.0
	 * @category Function
	 * @example
	 *
	 *      var greet = R.replace('{name}', R.__, 'Hello, {name}!');
	 *      greet('Alice'); //=> 'Hello, Alice!'
	 */
	module.exports = {'@@functional/placeholder': true};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Adds two values.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Math
	 * @sig Number -> Number -> Number
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 * @see R.subtract
	 * @example
	 *
	 *      R.add(2, 3);       //=>  5
	 *      R.add(7)(10);      //=> 17
	 */
	module.exports = _curry2(function add(a, b) {
	  return Number(a) + Number(b);
	});


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _isPlaceholder = __webpack_require__(9);
	
	
	/**
	 * Optimized internal two-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry2(fn) {
	  return function f2(a, b) {
	    switch (arguments.length) {
	      case 0:
	        return f2;
	      case 1:
	        return _isPlaceholder(a) ? f2
	             : _curry1(function(_b) { return fn(a, _b); });
	      default:
	        return _isPlaceholder(a) && _isPlaceholder(b) ? f2
	             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b); })
	             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b); })
	             : fn(a, b);
	    }
	  };
	};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(15);
	var _curry1 = __webpack_require__(8);
	var curryN = __webpack_require__(16);
	
	
	/**
	 * Creates a new list iteration function from an existing one by adding two new
	 * parameters to its callback function: the current index, and the entire list.
	 *
	 * This would turn, for instance, [`R.map`](#map) function into one that
	 * more closely resembles `Array.prototype.map`. Note that this will only work
	 * for functions in which the iteration callback function is the first
	 * parameter, and where the list is the last parameter. (This latter might be
	 * unimportant if the list parameter is not used.)
	 *
	 * @func
	 * @memberOf R
	 * @since v0.15.0
	 * @category Function
	 * @category List
	 * @sig ((a ... -> b) ... -> [a] -> *) -> (a ..., Int, [a] -> b) ... -> [a] -> *)
	 * @param {Function} fn A list iteration function that does not pass index or list to its callback
	 * @return {Function} An altered list iteration function that passes (item, index, list) to its callback
	 * @example
	 *
	 *      var mapIndexed = R.addIndex(R.map);
	 *      mapIndexed((val, idx) => idx + '-' + val, ['f', 'o', 'o', 'b', 'a', 'r']);
	 *      //=> ['0-f', '1-o', '2-o', '3-b', '4-a', '5-r']
	 */
	module.exports = _curry1(function addIndex(fn) {
	  return curryN(fn.length, function() {
	    var idx = 0;
	    var origFn = arguments[0];
	    var list = arguments[arguments.length - 1];
	    var args = Array.prototype.slice.call(arguments, 0);
	    args[0] = function() {
	      var result = origFn.apply(this, _concat(arguments, [idx, list]));
	      idx += 1;
	      return result;
	    };
	    return fn.apply(this, args);
	  });
	});


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	/**
	 * Private `concat` function to merge two array-like objects.
	 *
	 * @private
	 * @param {Array|Arguments} [set1=[]] An array-like object.
	 * @param {Array|Arguments} [set2=[]] An array-like object.
	 * @return {Array} A new, merged array.
	 * @example
	 *
	 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
	 */
	module.exports = function _concat(set1, set2) {
	  set1 = set1 || [];
	  set2 = set2 || [];
	  var idx;
	  var len1 = set1.length;
	  var len2 = set2.length;
	  var result = [];
	
	  idx = 0;
	  while (idx < len1) {
	    result[result.length] = set1[idx];
	    idx += 1;
	  }
	  idx = 0;
	  while (idx < len2) {
	    result[result.length] = set2[idx];
	    idx += 1;
	  }
	  return result;
	};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(17);
	var _curry1 = __webpack_require__(8);
	var _curry2 = __webpack_require__(13);
	var _curryN = __webpack_require__(18);
	
	
	/**
	 * Returns a curried equivalent of the provided function, with the specified
	 * arity. The curried function has two unusual capabilities. First, its
	 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
	 * following are equivalent:
	 *
	 *   - `g(1)(2)(3)`
	 *   - `g(1)(2, 3)`
	 *   - `g(1, 2)(3)`
	 *   - `g(1, 2, 3)`
	 *
	 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
	 * "gaps", allowing partial application of any combination of arguments,
	 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
	 * the following are equivalent:
	 *
	 *   - `g(1, 2, 3)`
	 *   - `g(_, 2, 3)(1)`
	 *   - `g(_, _, 3)(1)(2)`
	 *   - `g(_, _, 3)(1, 2)`
	 *   - `g(_, 2)(1)(3)`
	 *   - `g(_, 2)(1, 3)`
	 *   - `g(_, 2)(_, 3)(1)`
	 *
	 * @func
	 * @memberOf R
	 * @since v0.5.0
	 * @category Function
	 * @sig Number -> (* -> a) -> (* -> a)
	 * @param {Number} length The arity for the returned function.
	 * @param {Function} fn The function to curry.
	 * @return {Function} A new, curried function.
	 * @see R.curry
	 * @example
	 *
	 *      var sumArgs = (...args) => R.sum(args);
	 *
	 *      var curriedAddFourNumbers = R.curryN(4, sumArgs);
	 *      var f = curriedAddFourNumbers(1, 2);
	 *      var g = f(3);
	 *      g(4); //=> 10
	 */
	module.exports = _curry2(function curryN(length, fn) {
	  if (length === 1) {
	    return _curry1(fn);
	  }
	  return _arity(length, _curryN(length, [], fn));
	});


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = function _arity(n, fn) {
	  /* eslint-disable no-unused-vars */
	  switch (n) {
	    case 0: return function() { return fn.apply(this, arguments); };
	    case 1: return function(a0) { return fn.apply(this, arguments); };
	    case 2: return function(a0, a1) { return fn.apply(this, arguments); };
	    case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
	    case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
	    case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
	    case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
	    case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
	    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
	    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
	    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
	    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
	  }
	};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(17);
	var _isPlaceholder = __webpack_require__(9);
	
	
	/**
	 * Internal curryN function.
	 *
	 * @private
	 * @category Function
	 * @param {Number} length The arity of the curried function.
	 * @param {Array} received An array of arguments received thus far.
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curryN(length, received, fn) {
	  return function() {
	    var combined = [];
	    var argsIdx = 0;
	    var left = length;
	    var combinedIdx = 0;
	    while (combinedIdx < received.length || argsIdx < arguments.length) {
	      var result;
	      if (combinedIdx < received.length &&
	          (!_isPlaceholder(received[combinedIdx]) ||
	           argsIdx >= arguments.length)) {
	        result = received[combinedIdx];
	      } else {
	        result = arguments[argsIdx];
	        argsIdx += 1;
	      }
	      combined[combinedIdx] = result;
	      if (!_isPlaceholder(result)) {
	        left -= 1;
	      }
	      combinedIdx += 1;
	    }
	    return left <= 0 ? fn.apply(this, combined)
	                     : _arity(left, _curryN(length, combined, fn));
	  };
	};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(15);
	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Applies a function to the value at the given index of an array, returning a
	 * new copy of the array with the element at the given index replaced with the
	 * result of the function application.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category List
	 * @sig (a -> a) -> Number -> [a] -> [a]
	 * @param {Function} fn The function to apply.
	 * @param {Number} idx The index.
	 * @param {Array|Arguments} list An array-like object whose value
	 *        at the supplied index will be replaced.
	 * @return {Array} A copy of the supplied array-like object with
	 *         the element at index `idx` replaced with the value
	 *         returned by applying `fn` to the existing element.
	 * @see R.update
	 * @example
	 *
	 *      R.adjust(R.add(10), 1, [1, 2, 3]);     //=> [1, 12, 3]
	 *      R.adjust(R.add(10))(1)([1, 2, 3]);     //=> [1, 12, 3]
	 * @symb R.adjust(f, -1, [a, b]) = [a, f(b)]
	 * @symb R.adjust(f, 0, [a, b]) = [f(a), b]
	 */
	module.exports = _curry3(function adjust(fn, idx, list) {
	  if (idx >= list.length || idx < -list.length) {
	    return list;
	  }
	  var start = idx < 0 ? list.length : 0;
	  var _idx = start + idx;
	  var _list = _concat(list);
	  _list[_idx] = fn(list[_idx]);
	  return _list;
	});


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _curry2 = __webpack_require__(13);
	var _isPlaceholder = __webpack_require__(9);
	
	
	/**
	 * Optimized internal three-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry3(fn) {
	  return function f3(a, b, c) {
	    switch (arguments.length) {
	      case 0:
	        return f3;
	      case 1:
	        return _isPlaceholder(a) ? f3
	             : _curry2(function(_b, _c) { return fn(a, _b, _c); });
	      case 2:
	        return _isPlaceholder(a) && _isPlaceholder(b) ? f3
	             : _isPlaceholder(a) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
	             : _isPlaceholder(b) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
	             : _curry1(function(_c) { return fn(a, b, _c); });
	      default:
	        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3
	             : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) { return fn(_a, _b, c); })
	             : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
	             : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
	             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b, c); })
	             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b, c); })
	             : _isPlaceholder(c) ? _curry1(function(_c) { return fn(a, b, _c); })
	             : fn(a, b, c);
	    }
	  };
	};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xall = __webpack_require__(25);
	
	
	/**
	 * Returns `true` if all elements of the list match the predicate, `false` if
	 * there are any that don't.
	 *
	 * Dispatches to the `all` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> Boolean
	 * @param {Function} fn The predicate function.
	 * @param {Array} list The array to consider.
	 * @return {Boolean} `true` if the predicate is satisfied by every element, `false`
	 *         otherwise.
	 * @see R.any, R.none, R.transduce
	 * @example
	 *
	 *      var equals3 = R.equals(3);
	 *      R.all(equals3)([3, 3, 3, 3]); //=> true
	 *      R.all(equals3)([3, 3, 1, 3]); //=> false
	 */
	module.exports = _curry2(_dispatchable(['all'], _xall, function all(fn, list) {
	  var idx = 0;
	  while (idx < list.length) {
	    if (!fn(list[idx])) {
	      return false;
	    }
	    idx += 1;
	  }
	  return true;
	}));


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var _isArray = __webpack_require__(23);
	var _isTransformer = __webpack_require__(24);
	
	
	/**
	 * Returns a function that dispatches with different strategies based on the
	 * object in list position (last argument). If it is an array, executes [fn].
	 * Otherwise, if it has a function with one of the given method names, it will
	 * execute that function (functor case). Otherwise, if it is a transformer,
	 * uses transducer [xf] to return a new transformer (transducer case).
	 * Otherwise, it will default to executing [fn].
	 *
	 * @private
	 * @param {Array} methodNames properties to check for a custom implementation
	 * @param {Function} xf transducer to initialize if object is transformer
	 * @param {Function} fn default ramda implementation
	 * @return {Function} A function that dispatches on object in list position
	 */
	module.exports = function _dispatchable(methodNames, xf, fn) {
	  return function() {
	    if (arguments.length === 0) {
	      return fn();
	    }
	    var args = Array.prototype.slice.call(arguments, 0);
	    var obj = args.pop();
	    if (!_isArray(obj)) {
	      var idx = 0;
	      while (idx < methodNames.length) {
	        if (typeof obj[methodNames[idx]] === 'function') {
	          return obj[methodNames[idx]].apply(obj, args);
	        }
	        idx += 1;
	      }
	      if (_isTransformer(obj)) {
	        var transducer = xf.apply(null, args);
	        return transducer(obj);
	      }
	    }
	    return fn.apply(this, arguments);
	  };
	};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

	/**
	 * Tests whether or not an object is an array.
	 *
	 * @private
	 * @param {*} val The object to test.
	 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
	 * @example
	 *
	 *      _isArray([]); //=> true
	 *      _isArray(null); //=> false
	 *      _isArray({}); //=> false
	 */
	module.exports = Array.isArray || function _isArray(val) {
	  return (val != null &&
	          val.length >= 0 &&
	          Object.prototype.toString.call(val) === '[object Array]');
	};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	module.exports = function _isTransformer(obj) {
	  return typeof obj['@@transducer/step'] === 'function';
	};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _reduced = __webpack_require__(26);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XAll(f, xf) {
	    this.xf = xf;
	    this.f = f;
	    this.all = true;
	  }
	  XAll.prototype['@@transducer/init'] = _xfBase.init;
	  XAll.prototype['@@transducer/result'] = function(result) {
	    if (this.all) {
	      result = this.xf['@@transducer/step'](result, true);
	    }
	    return this.xf['@@transducer/result'](result);
	  };
	  XAll.prototype['@@transducer/step'] = function(result, input) {
	    if (!this.f(input)) {
	      this.all = false;
	      result = _reduced(this.xf['@@transducer/step'](result, false));
	    }
	    return result;
	  };
	
	  return _curry2(function _xall(f, xf) { return new XAll(f, xf); });
	}());


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	module.exports = function _reduced(x) {
	  return x && x['@@transducer/reduced'] ? x :
	    {
	      '@@transducer/value': x,
	      '@@transducer/reduced': true
	    };
	};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = {
	  init: function() {
	    return this.xf['@@transducer/init']();
	  },
	  result: function(result) {
	    return this.xf['@@transducer/result'](result);
	  }
	};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var curryN = __webpack_require__(16);
	var max = __webpack_require__(29);
	var pluck = __webpack_require__(30);
	var reduce = __webpack_require__(43);
	
	
	/**
	 * Takes a list of predicates and returns a predicate that returns true for a
	 * given list of arguments if every one of the provided predicates is satisfied
	 * by those arguments.
	 *
	 * The function returned is a curried function whose arity matches that of the
	 * highest-arity predicate.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Logic
	 * @sig [(*... -> Boolean)] -> (*... -> Boolean)
	 * @param {Array} predicates An array of predicates to check
	 * @return {Function} The combined predicate
	 * @see R.anyPass
	 * @example
	 *
	 *      var isQueen = R.propEq('rank', 'Q');
	 *      var isSpade = R.propEq('suit', '♠︎');
	 *      var isQueenOfSpades = R.allPass([isQueen, isSpade]);
	 *
	 *      isQueenOfSpades({rank: 'Q', suit: '♣︎'}); //=> false
	 *      isQueenOfSpades({rank: 'Q', suit: '♠︎'}); //=> true
	 */
	module.exports = _curry1(function allPass(preds) {
	  return curryN(reduce(max, 0, pluck('length', preds)), function() {
	    var idx = 0;
	    var len = preds.length;
	    while (idx < len) {
	      if (!preds[idx].apply(this, arguments)) {
	        return false;
	      }
	      idx += 1;
	    }
	    return true;
	  });
	});


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns the larger of its two arguments.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig Ord a => a -> a -> a
	 * @param {*} a
	 * @param {*} b
	 * @return {*}
	 * @see R.maxBy, R.min
	 * @example
	 *
	 *      R.max(789, 123); //=> 789
	 *      R.max('a', 'b'); //=> 'b'
	 */
	module.exports = _curry2(function max(a, b) { return b > a ? b : a; });


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var map = __webpack_require__(31);
	var prop = __webpack_require__(42);
	
	
	/**
	 * Returns a new list by plucking the same named property off all objects in
	 * the list supplied.
	 *
	 * `pluck` will work on
	 * any [functor](https://github.com/fantasyland/fantasy-land#functor) in
	 * addition to arrays, as it is equivalent to `R.map(R.prop(k), f)`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Functor f => k -> f {k: v} -> f v
	 * @param {Number|String} key The key name to pluck off of each object.
	 * @param {Array} f The array or functor to consider.
	 * @return {Array} The list of values for the given key.
	 * @see R.props
	 * @example
	 *
	 *      R.pluck('a')([{a: 1}, {a: 2}]); //=> [1, 2]
	 *      R.pluck(0)([[1, 2], [3, 4]]);   //=> [1, 3]
	 *      R.pluck('val', {a: {val: 3}, b: {val: 5}}); //=> {a: 3, b: 5}
	 * @symb R.pluck('x', [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}]) = [1, 3, 5]
	 * @symb R.pluck(0, [[1, 2], [3, 4], [5, 6]]) = [1, 3, 5]
	 */
	module.exports = _curry2(function pluck(p, list) {
	  return map(prop(p), list);
	});


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _map = __webpack_require__(32);
	var _reduce = __webpack_require__(33);
	var _xmap = __webpack_require__(38);
	var curryN = __webpack_require__(16);
	var keys = __webpack_require__(39);
	
	
	/**
	 * Takes a function and
	 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
	 * applies the function to each of the functor's values, and returns
	 * a functor of the same shape.
	 *
	 * Ramda provides suitable `map` implementations for `Array` and `Object`,
	 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
	 *
	 * Dispatches to the `map` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * Also treats functions as functors and will compose them together.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Functor f => (a -> b) -> f a -> f b
	 * @param {Function} fn The function to be called on every element of the input `list`.
	 * @param {Array} list The list to be iterated over.
	 * @return {Array} The new list.
	 * @see R.transduce, R.addIndex
	 * @example
	 *
	 *      var double = x => x * 2;
	 *
	 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
	 *
	 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
	 * @symb R.map(f, [a, b]) = [f(a), f(b)]
	 * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
	 * @symb R.map(f, functor_o) = functor_o.map(f)
	 */
	module.exports = _curry2(_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
	  switch (Object.prototype.toString.call(functor)) {
	    case '[object Function]':
	      return curryN(functor.length, function() {
	        return fn.call(this, functor.apply(this, arguments));
	      });
	    case '[object Object]':
	      return _reduce(function(acc, key) {
	        acc[key] = fn(functor[key]);
	        return acc;
	      }, {}, keys(functor));
	    default:
	      return _map(fn, functor);
	  }
	}));


/***/ }),
/* 32 */
/***/ (function(module, exports) {

	module.exports = function _map(fn, functor) {
	  var idx = 0;
	  var len = functor.length;
	  var result = Array(len);
	  while (idx < len) {
	    result[idx] = fn(functor[idx]);
	    idx += 1;
	  }
	  return result;
	};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var _isArrayLike = __webpack_require__(34);
	var _xwrap = __webpack_require__(36);
	var bind = __webpack_require__(37);
	
	
	module.exports = (function() {
	  function _arrayReduce(xf, acc, list) {
	    var idx = 0;
	    var len = list.length;
	    while (idx < len) {
	      acc = xf['@@transducer/step'](acc, list[idx]);
	      if (acc && acc['@@transducer/reduced']) {
	        acc = acc['@@transducer/value'];
	        break;
	      }
	      idx += 1;
	    }
	    return xf['@@transducer/result'](acc);
	  }
	
	  function _iterableReduce(xf, acc, iter) {
	    var step = iter.next();
	    while (!step.done) {
	      acc = xf['@@transducer/step'](acc, step.value);
	      if (acc && acc['@@transducer/reduced']) {
	        acc = acc['@@transducer/value'];
	        break;
	      }
	      step = iter.next();
	    }
	    return xf['@@transducer/result'](acc);
	  }
	
	  function _methodReduce(xf, acc, obj, methodName) {
	    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
	  }
	
	  var symIterator = (typeof Symbol !== 'undefined') ? Symbol.iterator : '@@iterator';
	  return function _reduce(fn, acc, list) {
	    if (typeof fn === 'function') {
	      fn = _xwrap(fn);
	    }
	    if (_isArrayLike(list)) {
	      return _arrayReduce(fn, acc, list);
	    }
	    if (typeof list['fantasy-land/reduce'] === 'function') {
	      return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
	    }
	    if (list[symIterator] != null) {
	      return _iterableReduce(fn, acc, list[symIterator]());
	    }
	    if (typeof list.next === 'function') {
	      return _iterableReduce(fn, acc, list);
	    }
	    if (typeof list.reduce === 'function') {
	      return _methodReduce(fn, acc, list, 'reduce');
	    }
	
	    throw new TypeError('reduce: list must be array or iterable');
	  };
	}());


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _isArray = __webpack_require__(23);
	var _isString = __webpack_require__(35);
	
	
	/**
	 * Tests whether or not an object is similar to an array.
	 *
	 * @private
	 * @category Type
	 * @category List
	 * @sig * -> Boolean
	 * @param {*} x The object to test.
	 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
	 * @example
	 *
	 *      _isArrayLike([]); //=> true
	 *      _isArrayLike(true); //=> false
	 *      _isArrayLike({}); //=> false
	 *      _isArrayLike({length: 10}); //=> false
	 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
	 */
	module.exports = _curry1(function isArrayLike(x) {
	  if (_isArray(x)) { return true; }
	  if (!x) { return false; }
	  if (typeof x !== 'object') { return false; }
	  if (_isString(x)) { return false; }
	  if (x.nodeType === 1) { return !!x.length; }
	  if (x.length === 0) { return true; }
	  if (x.length > 0) {
	    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
	  }
	  return false;
	});


/***/ }),
/* 35 */
/***/ (function(module, exports) {

	module.exports = function _isString(x) {
	  return Object.prototype.toString.call(x) === '[object String]';
	};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

	module.exports = (function() {
	  function XWrap(fn) {
	    this.f = fn;
	  }
	  XWrap.prototype['@@transducer/init'] = function() {
	    throw new Error('init not implemented on XWrap');
	  };
	  XWrap.prototype['@@transducer/result'] = function(acc) { return acc; };
	  XWrap.prototype['@@transducer/step'] = function(acc, x) {
	    return this.f(acc, x);
	  };
	
	  return function _xwrap(fn) { return new XWrap(fn); };
	}());


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(17);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Creates a function that is bound to a context.
	 * Note: `R.bind` does not provide the additional argument-binding capabilities of
	 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.6.0
	 * @category Function
	 * @category Object
	 * @sig (* -> *) -> {*} -> (* -> *)
	 * @param {Function} fn The function to bind to context
	 * @param {Object} thisObj The context to bind `fn` to
	 * @return {Function} A function that will execute in the context of `thisObj`.
	 * @see R.partial
	 * @example
	 *
	 *      var log = R.bind(console.log, console);
	 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
	 *      // logs {a: 2}
	 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
	 */
	module.exports = _curry2(function bind(fn, thisObj) {
	  return _arity(fn.length, function() {
	    return fn.apply(thisObj, arguments);
	  });
	});


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XMap(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }
	  XMap.prototype['@@transducer/init'] = _xfBase.init;
	  XMap.prototype['@@transducer/result'] = _xfBase.result;
	  XMap.prototype['@@transducer/step'] = function(result, input) {
	    return this.xf['@@transducer/step'](result, this.f(input));
	  };
	
	  return _curry2(function _xmap(f, xf) { return new XMap(f, xf); });
	}());


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _has = __webpack_require__(40);
	var _isArguments = __webpack_require__(41);
	
	
	/**
	 * Returns a list containing the names of all the enumerable own properties of
	 * the supplied object.
	 * Note that the order of the output array is not guaranteed to be consistent
	 * across different JS platforms.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig {k: v} -> [k]
	 * @param {Object} obj The object to extract properties from
	 * @return {Array} An array of the object's own properties.
	 * @see R.keysIn, R.values
	 * @example
	 *
	 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
	 */
	module.exports = (function() {
	  // cover IE < 9 keys issues
	  var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString',
	                            'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	  // Safari bug
	  var hasArgsEnumBug = (function() {
	    'use strict';
	    return arguments.propertyIsEnumerable('length');
	  }());
	
	  var contains = function contains(list, item) {
	    var idx = 0;
	    while (idx < list.length) {
	      if (list[idx] === item) {
	        return true;
	      }
	      idx += 1;
	    }
	    return false;
	  };
	
	  return typeof Object.keys === 'function' && !hasArgsEnumBug ?
	    _curry1(function keys(obj) {
	      return Object(obj) !== obj ? [] : Object.keys(obj);
	    }) :
	    _curry1(function keys(obj) {
	      if (Object(obj) !== obj) {
	        return [];
	      }
	      var prop, nIdx;
	      var ks = [];
	      var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
	      for (prop in obj) {
	        if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
	          ks[ks.length] = prop;
	        }
	      }
	      if (hasEnumBug) {
	        nIdx = nonEnumerableProps.length - 1;
	        while (nIdx >= 0) {
	          prop = nonEnumerableProps[nIdx];
	          if (_has(prop, obj) && !contains(ks, prop)) {
	            ks[ks.length] = prop;
	          }
	          nIdx -= 1;
	        }
	      }
	      return ks;
	    });
	}());


/***/ }),
/* 40 */
/***/ (function(module, exports) {

	module.exports = function _has(prop, obj) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	var _has = __webpack_require__(40);
	
	
	module.exports = (function() {
	  var toString = Object.prototype.toString;
	  return toString.call(arguments) === '[object Arguments]' ?
	    function _isArguments(x) { return toString.call(x) === '[object Arguments]'; } :
	    function _isArguments(x) { return _has('callee', x); };
	}());


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a function that when supplied an object returns the indicated
	 * property of that object, if it exists.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig s -> {s: a} -> a | Undefined
	 * @param {String} p The property name
	 * @param {Object} obj The object to query
	 * @return {*} The value at `obj.p`.
	 * @see R.path
	 * @example
	 *
	 *      R.prop('x', {x: 100}); //=> 100
	 *      R.prop('x', {}); //=> undefined
	 */
	module.exports = _curry2(function prop(p, obj) { return obj[p]; });


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var _reduce = __webpack_require__(33);
	
	
	/**
	 * Returns a single item by iterating through the list, successively calling
	 * the iterator function and passing it an accumulator value and the current
	 * value from the array, and then passing the result to the next call.
	 *
	 * The iterator function receives two values: *(acc, value)*. It may use
	 * [`R.reduced`](#reduced) to shortcut the iteration.
	 *
	 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
	 * is *(value, acc)*.
	 *
	 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
	 * arrays), unlike the native `Array.prototype.reduce` method. For more details
	 * on this behavior, see:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
	 *
	 * Dispatches to the `reduce` method of the third argument, if present. When
	 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
	 * shortcuting, as this is not implemented by `reduce`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig ((a, b) -> a) -> a -> [b] -> a
	 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	 *        current element from the array.
	 * @param {*} acc The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @see R.reduced, R.addIndex, R.reduceRight
	 * @example
	 *
	 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
	 *                -               -10
	 *               / \              / \
	 *              -   4           -6   4
	 *             / \              / \
	 *            -   3   ==>     -3   3
	 *           / \              / \
	 *          -   2           -1   2
	 *         / \              / \
	 *        0   1            0   1
	 *
	 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
	 */
	module.exports = _curry3(_reduce);


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns `true` if both arguments are `true`; `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Logic
	 * @sig a -> b -> a | b
	 * @param {Any} a
	 * @param {Any} b
	 * @return {Any} the first argument if it is falsy, otherwise the second argument.
	 * @see R.both
	 * @example
	 *
	 *      R.and(true, true); //=> true
	 *      R.and(true, false); //=> false
	 *      R.and(false, true); //=> false
	 *      R.and(false, false); //=> false
	 */
	module.exports = _curry2(function and(a, b) {
	  return a && b;
	});


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xany = __webpack_require__(46);
	
	
	/**
	 * Returns `true` if at least one of elements of the list match the predicate,
	 * `false` otherwise.
	 *
	 * Dispatches to the `any` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> Boolean
	 * @param {Function} fn The predicate function.
	 * @param {Array} list The array to consider.
	 * @return {Boolean} `true` if the predicate is satisfied by at least one element, `false`
	 *         otherwise.
	 * @see R.all, R.none, R.transduce
	 * @example
	 *
	 *      var lessThan0 = R.flip(R.lt)(0);
	 *      var lessThan2 = R.flip(R.lt)(2);
	 *      R.any(lessThan0)([1, 2]); //=> false
	 *      R.any(lessThan2)([1, 2]); //=> true
	 */
	module.exports = _curry2(_dispatchable(['any'], _xany, function any(fn, list) {
	  var idx = 0;
	  while (idx < list.length) {
	    if (fn(list[idx])) {
	      return true;
	    }
	    idx += 1;
	  }
	  return false;
	}));


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _reduced = __webpack_require__(26);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XAny(f, xf) {
	    this.xf = xf;
	    this.f = f;
	    this.any = false;
	  }
	  XAny.prototype['@@transducer/init'] = _xfBase.init;
	  XAny.prototype['@@transducer/result'] = function(result) {
	    if (!this.any) {
	      result = this.xf['@@transducer/step'](result, false);
	    }
	    return this.xf['@@transducer/result'](result);
	  };
	  XAny.prototype['@@transducer/step'] = function(result, input) {
	    if (this.f(input)) {
	      this.any = true;
	      result = _reduced(this.xf['@@transducer/step'](result, true));
	    }
	    return result;
	  };
	
	  return _curry2(function _xany(f, xf) { return new XAny(f, xf); });
	}());


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var curryN = __webpack_require__(16);
	var max = __webpack_require__(29);
	var pluck = __webpack_require__(30);
	var reduce = __webpack_require__(43);
	
	
	/**
	 * Takes a list of predicates and returns a predicate that returns true for a
	 * given list of arguments if at least one of the provided predicates is
	 * satisfied by those arguments.
	 *
	 * The function returned is a curried function whose arity matches that of the
	 * highest-arity predicate.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Logic
	 * @sig [(*... -> Boolean)] -> (*... -> Boolean)
	 * @param {Array} predicates An array of predicates to check
	 * @return {Function} The combined predicate
	 * @see R.allPass
	 * @example
	 *
	 *      var isClub = R.propEq('suit', '♣');
	 *      var isSpade = R.propEq('suit', '♠');
	 *      var isBlackCard = R.anyPass([isClub, isSpade]);
	 *
	 *      isBlackCard({rank: '10', suit: '♣'}); //=> true
	 *      isBlackCard({rank: 'Q', suit: '♠'}); //=> true
	 *      isBlackCard({rank: 'Q', suit: '♦'}); //=> false
	 */
	module.exports = _curry1(function anyPass(preds) {
	  return curryN(reduce(max, 0, pluck('length', preds)), function() {
	    var idx = 0;
	    var len = preds.length;
	    while (idx < len) {
	      if (preds[idx].apply(this, arguments)) {
	        return true;
	      }
	      idx += 1;
	    }
	    return false;
	  });
	});


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(15);
	var _curry2 = __webpack_require__(13);
	var _reduce = __webpack_require__(33);
	var map = __webpack_require__(31);
	
	
	/**
	 * ap applies a list of functions to a list of values.
	 *
	 * Dispatches to the `ap` method of the second argument, if present. Also
	 * treats curried functions as applicatives.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category Function
	 * @sig [a -> b] -> [a] -> [b]
	 * @sig Apply f => f (a -> b) -> f a -> f b
	 * @param {*} applyF
	 * @param {*} applyX
	 * @return {*}
	 * @example
	 *
	 *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
	 *      R.ap([R.concat('tasty '), R.toUpper], ['pizza', 'salad']); //=> ["tasty pizza", "tasty salad", "PIZZA", "SALAD"]
	 * @symb R.ap([f, g], [a, b]) = [f(a), f(b), g(a), g(b)]
	 */
	module.exports = _curry2(function ap(applyF, applyX) {
	  return (
	    typeof applyX['fantasy-land/ap'] === 'function' ?
	      applyX['fantasy-land/ap'](applyF) :
	    typeof applyF.ap === 'function' ?
	      applyF.ap(applyX) :
	    typeof applyF === 'function' ?
	      function(x) { return applyF(x)(applyX(x)); } :
	    // else
	      _reduce(function(acc, f) { return _concat(acc, map(f, applyX)); }, [], applyF)
	  );
	});


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	var _aperture = __webpack_require__(50);
	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xaperture = __webpack_require__(51);
	
	
	/**
	 * Returns a new list, composed of n-tuples of consecutive elements. If `n` is
	 * greater than the length of the list, an empty list is returned.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.12.0
	 * @category List
	 * @sig Number -> [a] -> [[a]]
	 * @param {Number} n The size of the tuples to create
	 * @param {Array} list The list to split into `n`-length tuples
	 * @return {Array} The resulting list of `n`-length tuples
	 * @see R.transduce
	 * @example
	 *
	 *      R.aperture(2, [1, 2, 3, 4, 5]); //=> [[1, 2], [2, 3], [3, 4], [4, 5]]
	 *      R.aperture(3, [1, 2, 3, 4, 5]); //=> [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
	 *      R.aperture(7, [1, 2, 3, 4, 5]); //=> []
	 */
	module.exports = _curry2(_dispatchable([], _xaperture, _aperture));


/***/ }),
/* 50 */
/***/ (function(module, exports) {

	module.exports = function _aperture(n, list) {
	  var idx = 0;
	  var limit = list.length - (n - 1);
	  var acc = new Array(limit >= 0 ? limit : 0);
	  while (idx < limit) {
	    acc[idx] = Array.prototype.slice.call(list, idx, idx + n);
	    idx += 1;
	  }
	  return acc;
	};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(15);
	var _curry2 = __webpack_require__(13);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XAperture(n, xf) {
	    this.xf = xf;
	    this.pos = 0;
	    this.full = false;
	    this.acc = new Array(n);
	  }
	  XAperture.prototype['@@transducer/init'] = _xfBase.init;
	  XAperture.prototype['@@transducer/result'] = function(result) {
	    this.acc = null;
	    return this.xf['@@transducer/result'](result);
	  };
	  XAperture.prototype['@@transducer/step'] = function(result, input) {
	    this.store(input);
	    return this.full ? this.xf['@@transducer/step'](result, this.getCopy()) : result;
	  };
	  XAperture.prototype.store = function(input) {
	    this.acc[this.pos] = input;
	    this.pos += 1;
	    if (this.pos === this.acc.length) {
	      this.pos = 0;
	      this.full = true;
	    }
	  };
	  XAperture.prototype.getCopy = function() {
	    return _concat(Array.prototype.slice.call(this.acc, this.pos),
	                   Array.prototype.slice.call(this.acc, 0, this.pos));
	  };
	
	  return _curry2(function _xaperture(n, xf) { return new XAperture(n, xf); });
	}());


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(15);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a new list containing the contents of the given list, followed by
	 * the given element.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig a -> [a] -> [a]
	 * @param {*} el The element to add to the end of the new list.
	 * @param {Array} list The list of elements to add a new item to.
	 *        list.
	 * @return {Array} A new list containing the elements of the old list followed by `el`.
	 * @see R.prepend
	 * @example
	 *
	 *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
	 *      R.append('tests', []); //=> ['tests']
	 *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
	 */
	module.exports = _curry2(function append(el, list) {
	  return _concat(list, [el]);
	});


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Applies function `fn` to the argument list `args`. This is useful for
	 * creating a fixed-arity function from a variadic function. `fn` should be a
	 * bound function if context is significant.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.7.0
	 * @category Function
	 * @sig (*... -> a) -> [*] -> a
	 * @param {Function} fn The function which will be called with `args`
	 * @param {Array} args The arguments to call `fn` with
	 * @return {*} result The result, equivalent to `fn(...args)`
	 * @see R.call, R.unapply
	 * @example
	 *
	 *      var nums = [1, 2, 3, -99, 42, 6, 7];
	 *      R.apply(Math.max, nums); //=> 42
	 * @symb R.apply(f, [a, b, c]) = f(a, b, c)
	 */
	module.exports = _curry2(function apply(fn, args) {
	  return fn.apply(this, args);
	});


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var apply = __webpack_require__(53);
	var curryN = __webpack_require__(16);
	var map = __webpack_require__(31);
	var max = __webpack_require__(29);
	var pluck = __webpack_require__(30);
	var reduce = __webpack_require__(43);
	var values = __webpack_require__(55);
	
	
	/**
	 * Given a spec object recursively mapping properties to functions, creates a
	 * function producing an object of the same structure, by mapping each property
	 * to the result of calling its associated function with the supplied arguments.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.20.0
	 * @category Function
	 * @sig {k: ((a, b, ..., m) -> v)} -> ((a, b, ..., m) -> {k: v})
	 * @param {Object} spec an object recursively mapping properties to functions for
	 *        producing the values for these properties.
	 * @return {Function} A function that returns an object of the same structure
	 * as `spec', with each property set to the value returned by calling its
	 * associated function with the supplied arguments.
	 * @see R.converge, R.juxt
	 * @example
	 *
	 *      var getMetrics = R.applySpec({
	 *                                      sum: R.add,
	 *                                      nested: { mul: R.multiply }
	 *                                   });
	 *      getMetrics(2, 4); // => { sum: 6, nested: { mul: 8 } }
	 * @symb R.applySpec({ x: f, y: { z: g } })(a, b) = { x: f(a, b), y: { z: g(a, b) } }
	 */
	module.exports = _curry1(function applySpec(spec) {
	  spec = map(function(v) { return typeof v == 'function' ? v : applySpec(v); },
	             spec);
	  return curryN(reduce(max, 0, pluck('length', values(spec))),
	                function() {
	                  var args = arguments;
	                  return map(function(f) { return apply(f, args); }, spec);
	                });
	});


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var keys = __webpack_require__(39);
	
	
	/**
	 * Returns a list of all the enumerable own properties of the supplied object.
	 * Note that the order of the output array is not guaranteed across different
	 * JS platforms.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig {k: v} -> [v]
	 * @param {Object} obj The object to extract values from
	 * @return {Array} An array of the values of the object's own properties.
	 * @see R.valuesIn, R.keys
	 * @example
	 *
	 *      R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
	 */
	module.exports = _curry1(function values(obj) {
	  var props = keys(obj);
	  var len = props.length;
	  var vals = [];
	  var idx = 0;
	  while (idx < len) {
	    vals[idx] = obj[props[idx]];
	    idx += 1;
	  }
	  return vals;
	});


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Makes an ascending comparator function out of a function that returns a value
	 * that can be compared with `<` and `>`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.23.0
	 * @category Function
	 * @sig Ord b => (a -> b) -> a -> a -> Number
	 * @param {Function} fn A function of arity one that returns a value that can be compared
	 * @param {*} a The first item to be compared.
	 * @param {*} b The second item to be compared.
	 * @return {Number} `-1` if fn(a) < fn(b), `1` if fn(b) < fn(a), otherwise `0`
	 * @see R.descend
	 * @example
	 *
	 *      var byAge = R.ascend(R.prop('age'));
	 *      var people = [
	 *        // ...
	 *      ];
	 *      var peopleByYoungestFirst = R.sort(byAge, people);
	 */
	module.exports = _curry3(function ascend(fn, a, b) {
	  var aa = fn(a);
	  var bb = fn(b);
	  return aa < bb ? -1 : aa > bb ? 1 : 0;
	});


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Makes a shallow clone of an object, setting or overriding the specified
	 * property with the given value. Note that this copies and flattens prototype
	 * properties onto the new object as well. All non-primitive properties are
	 * copied by reference.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Object
	 * @sig String -> a -> {k: v} -> {k: v}
	 * @param {String} prop The property name to set
	 * @param {*} val The new value
	 * @param {Object} obj The object to clone
	 * @return {Object} A new object equivalent to the original except for the changed property.
	 * @see R.dissoc
	 * @example
	 *
	 *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
	 */
	module.exports = _curry3(function assoc(prop, val, obj) {
	  var result = {};
	  for (var p in obj) {
	    result[p] = obj[p];
	  }
	  result[prop] = val;
	  return result;
	});


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var _has = __webpack_require__(40);
	var _isArray = __webpack_require__(23);
	var _isInteger = __webpack_require__(59);
	var assoc = __webpack_require__(57);
	var isNil = __webpack_require__(60);
	
	
	/**
	 * Makes a shallow clone of an object, setting or overriding the nodes required
	 * to create the given path, and placing the specific value at the tail end of
	 * that path. Note that this copies and flattens prototype properties onto the
	 * new object as well. All non-primitive properties are copied by reference.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Object
	 * @typedefn Idx = String | Int
	 * @sig [Idx] -> a -> {a} -> {a}
	 * @param {Array} path the path to set
	 * @param {*} val The new value
	 * @param {Object} obj The object to clone
	 * @return {Object} A new object equivalent to the original except along the specified path.
	 * @see R.dissocPath
	 * @example
	 *
	 *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
	 *
	 *      // Any missing or non-object keys in path will be overridden
	 *      R.assocPath(['a', 'b', 'c'], 42, {a: 5}); //=> {a: {b: {c: 42}}}
	 */
	module.exports = _curry3(function assocPath(path, val, obj) {
	  if (path.length === 0) {
	    return val;
	  }
	  var idx = path[0];
	  if (path.length > 1) {
	    var nextObj = (!isNil(obj) && _has(idx, obj)) ? obj[idx] : _isInteger(path[1]) ? [] : {};
	    val = assocPath(Array.prototype.slice.call(path, 1), val, nextObj);
	  }
	  if (_isInteger(idx) && _isArray(obj)) {
	    var arr = [].concat(obj);
	    arr[idx] = val;
	    return arr;
	  } else {
	    return assoc(idx, val, obj);
	  }
	});


/***/ }),
/* 59 */
/***/ (function(module, exports) {

	/**
	 * Determine if the passed argument is an integer.
	 *
	 * @private
	 * @param {*} n
	 * @category Type
	 * @return {Boolean}
	 */
	module.exports = Number.isInteger || function _isInteger(n) {
	  return (n << 0) === n;
	};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Checks if the input value is `null` or `undefined`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Type
	 * @sig * -> Boolean
	 * @param {*} x The value to test.
	 * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
	 * @example
	 *
	 *      R.isNil(null); //=> true
	 *      R.isNil(undefined); //=> true
	 *      R.isNil(0); //=> false
	 *      R.isNil([]); //=> false
	 */
	module.exports = _curry1(function isNil(x) { return x == null; });


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var nAry = __webpack_require__(62);
	
	
	/**
	 * Wraps a function of any arity (including nullary) in a function that accepts
	 * exactly 2 parameters. Any extraneous parameters will not be passed to the
	 * supplied function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.2.0
	 * @category Function
	 * @sig (* -> c) -> (a, b -> c)
	 * @param {Function} fn The function to wrap.
	 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
	 *         arity 2.
	 * @see R.nAry, R.unary
	 * @example
	 *
	 *      var takesThreeArgs = function(a, b, c) {
	 *        return [a, b, c];
	 *      };
	 *      takesThreeArgs.length; //=> 3
	 *      takesThreeArgs(1, 2, 3); //=> [1, 2, 3]
	 *
	 *      var takesTwoArgs = R.binary(takesThreeArgs);
	 *      takesTwoArgs.length; //=> 2
	 *      // Only 2 arguments are passed to the wrapped function
	 *      takesTwoArgs(1, 2, 3); //=> [1, 2, undefined]
	 * @symb R.binary(f)(a, b, c) = f(a, b)
	 */
	module.exports = _curry1(function binary(fn) {
	  return nAry(2, fn);
	});


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Wraps a function of any arity (including nullary) in a function that accepts
	 * exactly `n` parameters. Any extraneous parameters will not be passed to the
	 * supplied function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig Number -> (* -> a) -> (* -> a)
	 * @param {Number} n The desired arity of the new function.
	 * @param {Function} fn The function to wrap.
	 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
	 *         arity `n`.
	 * @see R.binary, R.unary
	 * @example
	 *
	 *      var takesTwoArgs = (a, b) => [a, b];
	 *
	 *      takesTwoArgs.length; //=> 2
	 *      takesTwoArgs(1, 2); //=> [1, 2]
	 *
	 *      var takesOneArg = R.nAry(1, takesTwoArgs);
	 *      takesOneArg.length; //=> 1
	 *      // Only `n` arguments are passed to the wrapped function
	 *      takesOneArg(1, 2); //=> [1, undefined]
	 * @symb R.nAry(0, f)(a, b) = f()
	 * @symb R.nAry(1, f)(a, b) = f(a)
	 * @symb R.nAry(2, f)(a, b) = f(a, b)
	 */
	module.exports = _curry2(function nAry(n, fn) {
	  switch (n) {
	    case 0: return function() {return fn.call(this);};
	    case 1: return function(a0) {return fn.call(this, a0);};
	    case 2: return function(a0, a1) {return fn.call(this, a0, a1);};
	    case 3: return function(a0, a1, a2) {return fn.call(this, a0, a1, a2);};
	    case 4: return function(a0, a1, a2, a3) {return fn.call(this, a0, a1, a2, a3);};
	    case 5: return function(a0, a1, a2, a3, a4) {return fn.call(this, a0, a1, a2, a3, a4);};
	    case 6: return function(a0, a1, a2, a3, a4, a5) {return fn.call(this, a0, a1, a2, a3, a4, a5);};
	    case 7: return function(a0, a1, a2, a3, a4, a5, a6) {return fn.call(this, a0, a1, a2, a3, a4, a5, a6);};
	    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) {return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);};
	    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);};
	    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);};
	    default: throw new Error('First argument to nAry must be a non-negative integer no greater than ten');
	  }
	});


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _isFunction = __webpack_require__(64);
	var and = __webpack_require__(44);
	var lift = __webpack_require__(65);
	
	
	/**
	 * A function which calls the two provided functions and returns the `&&`
	 * of the results.
	 * It returns the result of the first function if it is false-y and the result
	 * of the second function otherwise. Note that this is short-circuited,
	 * meaning that the second function will not be invoked if the first returns a
	 * false-y value.
	 *
	 * In addition to functions, `R.both` also accepts any fantasy-land compatible
	 * applicative functor.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.12.0
	 * @category Logic
	 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
	 * @param {Function} f A predicate
	 * @param {Function} g Another predicate
	 * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
	 * @see R.and
	 * @example
	 *
	 *      var gt10 = R.gt(R.__, 10)
	 *      var lt20 = R.lt(R.__, 20)
	 *      var f = R.both(gt10, lt20);
	 *      f(15); //=> true
	 *      f(30); //=> false
	 */
	module.exports = _curry2(function both(f, g) {
	  return _isFunction(f) ?
	    function _both() {
	      return f.apply(this, arguments) && g.apply(this, arguments);
	    } :
	    lift(and)(f, g);
	});


/***/ }),
/* 64 */
/***/ (function(module, exports) {

	module.exports = function _isFunction(x) {
	  return Object.prototype.toString.call(x) === '[object Function]';
	};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var liftN = __webpack_require__(66);
	
	
	/**
	 * "lifts" a function of arity > 1 so that it may "map over" a list, Function or other
	 * object that satisfies the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.7.0
	 * @category Function
	 * @sig (*... -> *) -> ([*]... -> [*])
	 * @param {Function} fn The function to lift into higher context
	 * @return {Function} The lifted function.
	 * @see R.liftN
	 * @example
	 *
	 *      var madd3 = R.lift((a, b, c) => a + b + c);
	 *
	 *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
	 *
	 *      var madd5 = R.lift((a, b, c, d, e) => a + b + c + d + e);
	 *
	 *      madd5([1,2], [3], [4, 5], [6], [7, 8]); //=> [21, 22, 22, 23, 22, 23, 23, 24]
	 */
	module.exports = _curry1(function lift(fn) {
	  return liftN(fn.length, fn);
	});


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _reduce = __webpack_require__(33);
	var ap = __webpack_require__(48);
	var curryN = __webpack_require__(16);
	var map = __webpack_require__(31);
	
	
	/**
	 * "lifts" a function to be the specified arity, so that it may "map over" that
	 * many lists, Functions or other objects that satisfy the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.7.0
	 * @category Function
	 * @sig Number -> (*... -> *) -> ([*]... -> [*])
	 * @param {Function} fn The function to lift into higher context
	 * @return {Function} The lifted function.
	 * @see R.lift, R.ap
	 * @example
	 *
	 *      var madd3 = R.liftN(3, (...args) => R.sum(args));
	 *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
	 */
	module.exports = _curry2(function liftN(arity, fn) {
	  var lifted = curryN(arity, fn);
	  return curryN(arity, function() {
	    return _reduce(ap, map(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
	  });
	});


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	var curry = __webpack_require__(68);
	
	
	/**
	 * Returns the result of calling its first argument with the remaining
	 * arguments. This is occasionally useful as a converging function for
	 * [`R.converge`](#converge): the first branch can produce a function while the
	 * remaining branches produce values to be passed to that function as its
	 * arguments.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Function
	 * @sig (*... -> a),*... -> a
	 * @param {Function} fn The function to apply to the remaining arguments.
	 * @param {...*} args Any number of positional arguments.
	 * @return {*}
	 * @see R.apply
	 * @example
	 *
	 *      R.call(R.add, 1, 2); //=> 3
	 *
	 *      var indentN = R.pipe(R.times(R.always(' ')),
	 *                           R.join(''),
	 *                           R.replace(/^(?!$)/gm));
	 *
	 *      var format = R.converge(R.call, [
	 *                                  R.pipe(R.prop('indent'), indentN),
	 *                                  R.prop('value')
	 *                              ]);
	 *
	 *      format({indent: 2, value: 'foo\nbar\nbaz\n'}); //=> '  foo\n  bar\n  baz\n'
	 * @symb R.call(f, a, b) = f(a, b)
	 */
	module.exports = curry(function call(fn) {
	  return fn.apply(this, Array.prototype.slice.call(arguments, 1));
	});


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var curryN = __webpack_require__(16);
	
	
	/**
	 * Returns a curried equivalent of the provided function. The curried function
	 * has two unusual capabilities. First, its arguments needn't be provided one
	 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
	 * following are equivalent:
	 *
	 *   - `g(1)(2)(3)`
	 *   - `g(1)(2, 3)`
	 *   - `g(1, 2)(3)`
	 *   - `g(1, 2, 3)`
	 *
	 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
	 * "gaps", allowing partial application of any combination of arguments,
	 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
	 * the following are equivalent:
	 *
	 *   - `g(1, 2, 3)`
	 *   - `g(_, 2, 3)(1)`
	 *   - `g(_, _, 3)(1)(2)`
	 *   - `g(_, _, 3)(1, 2)`
	 *   - `g(_, 2)(1)(3)`
	 *   - `g(_, 2)(1, 3)`
	 *   - `g(_, 2)(_, 3)(1)`
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (* -> a) -> (* -> a)
	 * @param {Function} fn The function to curry.
	 * @return {Function} A new, curried function.
	 * @see R.curryN
	 * @example
	 *
	 *      var addFourNumbers = (a, b, c, d) => a + b + c + d;
	 *
	 *      var curriedAddFourNumbers = R.curry(addFourNumbers);
	 *      var f = curriedAddFourNumbers(1, 2);
	 *      var g = f(3);
	 *      g(4); //=> 10
	 */
	module.exports = _curry1(function curry(fn) {
	  return curryN(fn.length, fn);
	});


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _makeFlat = __webpack_require__(70);
	var _xchain = __webpack_require__(71);
	var map = __webpack_require__(31);
	
	
	/**
	 * `chain` maps a function over a list and concatenates the results. `chain`
	 * is also known as `flatMap` in some libraries
	 *
	 * Dispatches to the `chain` method of the second argument, if present,
	 * according to the [FantasyLand Chain spec](https://github.com/fantasyland/fantasy-land#chain).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category List
	 * @sig Chain m => (a -> m b) -> m a -> m b
	 * @param {Function} fn The function to map with
	 * @param {Array} list The list to map over
	 * @return {Array} The result of flat-mapping `list` with `fn`
	 * @example
	 *
	 *      var duplicate = n => [n, n];
	 *      R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
	 *
	 *      R.chain(R.append, R.head)([1, 2, 3]); //=> [1, 2, 3, 1]
	 */
	module.exports = _curry2(_dispatchable(['fantasy-land/chain', 'chain'], _xchain, function chain(fn, monad) {
	  if (typeof monad === 'function') {
	    return function(x) { return fn(monad(x))(x); };
	  }
	  return _makeFlat(false)(map(fn, monad));
	}));


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	var _isArrayLike = __webpack_require__(34);
	
	
	/**
	 * `_makeFlat` is a helper function that returns a one-level or fully recursive
	 * function based on the flag passed in.
	 *
	 * @private
	 */
	module.exports = function _makeFlat(recursive) {
	  return function flatt(list) {
	    var value, jlen, j;
	    var result = [];
	    var idx = 0;
	    var ilen = list.length;
	
	    while (idx < ilen) {
	      if (_isArrayLike(list[idx])) {
	        value = recursive ? flatt(list[idx]) : list[idx];
	        j = 0;
	        jlen = value.length;
	        while (j < jlen) {
	          result[result.length] = value[j];
	          j += 1;
	        }
	      } else {
	        result[result.length] = list[idx];
	      }
	      idx += 1;
	    }
	    return result;
	  };
	};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _flatCat = __webpack_require__(72);
	var map = __webpack_require__(31);
	
	
	module.exports = _curry2(function _xchain(f, xf) {
	  return map(f, _flatCat(xf));
	});


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	var _forceReduced = __webpack_require__(73);
	var _isArrayLike = __webpack_require__(34);
	var _reduce = __webpack_require__(33);
	var _xfBase = __webpack_require__(27);
	
	module.exports = (function() {
	  var preservingReduced = function(xf) {
	    return {
	      '@@transducer/init': _xfBase.init,
	      '@@transducer/result': function(result) {
	        return xf['@@transducer/result'](result);
	      },
	      '@@transducer/step': function(result, input) {
	        var ret = xf['@@transducer/step'](result, input);
	        return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
	      }
	    };
	  };
	
	  return function _xcat(xf) {
	    var rxf = preservingReduced(xf);
	    return {
	      '@@transducer/init': _xfBase.init,
	      '@@transducer/result': function(result) {
	        return rxf['@@transducer/result'](result);
	      },
	      '@@transducer/step': function(result, input) {
	        return !_isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
	      }
	    };
	  };
	}());


/***/ }),
/* 73 */
/***/ (function(module, exports) {

	module.exports = function _forceReduced(x) {
	  return {
	    '@@transducer/value': x,
	    '@@transducer/reduced': true
	  };
	};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	/**
	 * Restricts a number to be within a range.
	 *
	 * Also works for other ordered types such as Strings and Dates.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.20.0
	 * @category Relation
	 * @sig Ord a => a -> a -> a -> a
	 * @param {Number} minimum The lower limit of the clamp (inclusive)
	 * @param {Number} maximum The upper limit of the clamp (inclusive)
	 * @param {Number} value Value to be clamped
	 * @return {Number} Returns `minimum` when `val < minimum`, `maximum` when `val > maximum`, returns `val` otherwise
	 * @example
	 *
	 *      R.clamp(1, 10, -5) // => 1
	 *      R.clamp(1, 10, 15) // => 10
	 *      R.clamp(1, 10, 4)  // => 4
	 */
	module.exports = _curry3(function clamp(min, max, value) {
	  if (min > max) {
	    throw new Error('min must not be greater than max in clamp(min, max, value)');
	  }
	  return value < min ? min :
	         value > max ? max :
	         value;
	});


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	var _clone = __webpack_require__(76);
	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Creates a deep copy of the value which may contain (nested) `Array`s and
	 * `Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are
	 * assigned by reference rather than copied
	 *
	 * Dispatches to a `clone` method if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig {*} -> {*}
	 * @param {*} value The object or array to clone
	 * @return {*} A deeply cloned copy of `val`
	 * @example
	 *
	 *      var objects = [{}, {}, {}];
	 *      var objectsClone = R.clone(objects);
	 *      objects === objectsClone; //=> false
	 *      objects[0] === objectsClone[0]; //=> false
	 */
	module.exports = _curry1(function clone(value) {
	  return value != null && typeof value.clone === 'function' ?
	    value.clone() :
	    _clone(value, [], [], true);
	});


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	var _cloneRegExp = __webpack_require__(77);
	var type = __webpack_require__(78);
	
	
	/**
	 * Copies an object.
	 *
	 * @private
	 * @param {*} value The value to be copied
	 * @param {Array} refFrom Array containing the source references
	 * @param {Array} refTo Array containing the copied source references
	 * @param {Boolean} deep Whether or not to perform deep cloning.
	 * @return {*} The copied value.
	 */
	module.exports = function _clone(value, refFrom, refTo, deep) {
	  var copy = function copy(copiedValue) {
	    var len = refFrom.length;
	    var idx = 0;
	    while (idx < len) {
	      if (value === refFrom[idx]) {
	        return refTo[idx];
	      }
	      idx += 1;
	    }
	    refFrom[idx + 1] = value;
	    refTo[idx + 1] = copiedValue;
	    for (var key in value) {
	      copiedValue[key] = deep ?
	        _clone(value[key], refFrom, refTo, true) : value[key];
	    }
	    return copiedValue;
	  };
	  switch (type(value)) {
	    case 'Object':  return copy({});
	    case 'Array':   return copy([]);
	    case 'Date':    return new Date(value.valueOf());
	    case 'RegExp':  return _cloneRegExp(value);
	    default:        return value;
	  }
	};


/***/ }),
/* 77 */
/***/ (function(module, exports) {

	module.exports = function _cloneRegExp(pattern) {
	  return new RegExp(pattern.source, (pattern.global     ? 'g' : '') +
	                                    (pattern.ignoreCase ? 'i' : '') +
	                                    (pattern.multiline  ? 'm' : '') +
	                                    (pattern.sticky     ? 'y' : '') +
	                                    (pattern.unicode    ? 'u' : ''));
	};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Gives a single-word string description of the (native) type of a value,
	 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
	 * attempt to distinguish user Object types any further, reporting them all as
	 * 'Object'.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Type
	 * @sig (* -> {*}) -> String
	 * @param {*} val The value to test
	 * @return {String}
	 * @example
	 *
	 *      R.type({}); //=> "Object"
	 *      R.type(1); //=> "Number"
	 *      R.type(false); //=> "Boolean"
	 *      R.type('s'); //=> "String"
	 *      R.type(null); //=> "Null"
	 *      R.type([]); //=> "Array"
	 *      R.type(/[A-z]/); //=> "RegExp"
	 *      R.type(() => {}); //=> "Function"
	 */
	module.exports = _curry1(function type(val) {
	  return val === null      ? 'Null'      :
	         val === undefined ? 'Undefined' :
	         Object.prototype.toString.call(val).slice(8, -1);
	});


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Makes a comparator function out of a function that reports whether the first
	 * element is less than the second.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (a, b -> Boolean) -> (a, b -> Number)
	 * @param {Function} pred A predicate function of arity two which will return `true` if the first argument
	 * is less than the second, `false` otherwise
	 * @return {Function} A Function :: a -> b -> Int that returns `-1` if a < b, `1` if b < a, otherwise `0`
	 * @example
	 *
	 *      var byAge = R.comparator((a, b) => a.age < b.age);
	 *      var people = [
	 *        // ...
	 *      ];
	 *      var peopleByIncreasingAge = R.sort(byAge, people);
	 */
	module.exports = _curry1(function comparator(pred) {
	  return function(a, b) {
	    return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
	  };
	});


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	var lift = __webpack_require__(65);
	var not = __webpack_require__(81);
	
	
	/**
	 * Takes a function `f` and returns a function `g` such that if called with the same arguments
	 * when `f` returns a "truthy" value, `g` returns `false` and when `f` returns a "falsy" value `g` returns `true`.
	 *
	 * `R.complement` may be applied to any functor
	 *
	 * @func
	 * @memberOf R
	 * @since v0.12.0
	 * @category Logic
	 * @sig (*... -> *) -> (*... -> Boolean)
	 * @param {Function} f
	 * @return {Function}
	 * @see R.not
	 * @example
	 *
	 *      var isNotNil = R.complement(R.isNil);
	 *      isNil(null); //=> true
	 *      isNotNil(null); //=> false
	 *      isNil(7); //=> false
	 *      isNotNil(7); //=> true
	 */
	module.exports = lift(not);


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * A function that returns the `!` of its argument. It will return `true` when
	 * passed false-y value, and `false` when passed a truth-y one.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Logic
	 * @sig * -> Boolean
	 * @param {*} a any value
	 * @return {Boolean} the logical inverse of passed argument.
	 * @see R.complement
	 * @example
	 *
	 *      R.not(true); //=> false
	 *      R.not(false); //=> true
	 *      R.not(0); //=> true
	 *      R.not(1); //=> false
	 */
	module.exports = _curry1(function not(a) {
	  return !a;
	});


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	var pipe = __webpack_require__(83);
	var reverse = __webpack_require__(88);
	
	
	/**
	 * Performs right-to-left function composition. The rightmost function may have
	 * any arity; the remaining functions must be unary.
	 *
	 * **Note:** The result of compose is not automatically curried.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
	 * @param {...Function} ...functions The functions to compose
	 * @return {Function}
	 * @see R.pipe
	 * @example
	 *
	 *      var classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
	 *      var yellGreeting = R.compose(R.toUpper, classyGreeting);
	 *      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"
	 *
	 *      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7
	 *
	 * @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))
	 */
	module.exports = function compose() {
	  if (arguments.length === 0) {
	    throw new Error('compose requires at least one argument');
	  }
	  return pipe.apply(this, reverse(arguments));
	};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(17);
	var _pipe = __webpack_require__(84);
	var reduce = __webpack_require__(43);
	var tail = __webpack_require__(85);
	
	
	/**
	 * Performs left-to-right function composition. The leftmost function may have
	 * any arity; the remaining functions must be unary.
	 *
	 * In some libraries this function is named `sequence`.
	 *
	 * **Note:** The result of pipe is not automatically curried.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
	 * @param {...Function} functions
	 * @return {Function}
	 * @see R.compose
	 * @example
	 *
	 *      var f = R.pipe(Math.pow, R.negate, R.inc);
	 *
	 *      f(3, 4); // -(3^4) + 1
	 * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
	 */
	module.exports = function pipe() {
	  if (arguments.length === 0) {
	    throw new Error('pipe requires at least one argument');
	  }
	  return _arity(arguments[0].length,
	                reduce(_pipe, arguments[0], tail(arguments)));
	};


/***/ }),
/* 84 */
/***/ (function(module, exports) {

	module.exports = function _pipe(f, g) {
	  return function() {
	    return g.call(this, f.apply(this, arguments));
	  };
	};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	var _checkForMethod = __webpack_require__(86);
	var _curry1 = __webpack_require__(8);
	var slice = __webpack_require__(87);
	
	
	/**
	 * Returns all but the first element of the given list or string (or object
	 * with a `tail` method).
	 *
	 * Dispatches to the `slice` method of the first argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [a]
	 * @sig String -> String
	 * @param {*} list
	 * @return {*}
	 * @see R.head, R.init, R.last
	 * @example
	 *
	 *      R.tail([1, 2, 3]);  //=> [2, 3]
	 *      R.tail([1, 2]);     //=> [2]
	 *      R.tail([1]);        //=> []
	 *      R.tail([]);         //=> []
	 *
	 *      R.tail('abc');  //=> 'bc'
	 *      R.tail('ab');   //=> 'b'
	 *      R.tail('a');    //=> ''
	 *      R.tail('');     //=> ''
	 */
	module.exports = _curry1(_checkForMethod('tail', slice(1, Infinity)));


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	var _isArray = __webpack_require__(23);
	
	
	/**
	 * This checks whether a function has a [methodname] function. If it isn't an
	 * array it will execute that function otherwise it will default to the ramda
	 * implementation.
	 *
	 * @private
	 * @param {Function} fn ramda implemtation
	 * @param {String} methodname property to check for a custom implementation
	 * @return {Object} Whatever the return value of the method is.
	 */
	module.exports = function _checkForMethod(methodname, fn) {
	  return function() {
	    var length = arguments.length;
	    if (length === 0) {
	      return fn();
	    }
	    var obj = arguments[length - 1];
	    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
	      fn.apply(this, arguments) :
	      obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
	  };
	};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	var _checkForMethod = __webpack_require__(86);
	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Returns the elements of the given list or string (or object with a `slice`
	 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
	 *
	 * Dispatches to the `slice` method of the third argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.4
	 * @category List
	 * @sig Number -> Number -> [a] -> [a]
	 * @sig Number -> Number -> String -> String
	 * @param {Number} fromIndex The start index (inclusive).
	 * @param {Number} toIndex The end index (exclusive).
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
	 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
	 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
	 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
	 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
	 */
	module.exports = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
	  return Array.prototype.slice.call(list, fromIndex, toIndex);
	}));


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _isString = __webpack_require__(35);
	
	
	/**
	 * Returns a new list or string with the elements or characters in reverse
	 * order.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [a]
	 * @sig String -> String
	 * @param {Array|String} list
	 * @return {Array|String}
	 * @example
	 *
	 *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
	 *      R.reverse([1, 2]);     //=> [2, 1]
	 *      R.reverse([1]);        //=> [1]
	 *      R.reverse([]);         //=> []
	 *
	 *      R.reverse('abc');      //=> 'cba'
	 *      R.reverse('ab');       //=> 'ba'
	 *      R.reverse('a');        //=> 'a'
	 *      R.reverse('');         //=> ''
	 */
	module.exports = _curry1(function reverse(list) {
	  return _isString(list) ? list.split('').reverse().join('') :
	                           Array.prototype.slice.call(list, 0).reverse();
	});


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	var chain = __webpack_require__(69);
	var compose = __webpack_require__(82);
	var map = __webpack_require__(31);
	
	
	/**
	 * Returns the right-to-left Kleisli composition of the provided functions,
	 * each of which must return a value of a type supported by [`chain`](#chain).
	 *
	 * `R.composeK(h, g, f)` is equivalent to `R.compose(R.chain(h), R.chain(g), R.chain(f))`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category Function
	 * @sig Chain m => ((y -> m z), (x -> m y), ..., (a -> m b)) -> (a -> m z)
	 * @param {...Function} ...functions The functions to compose
	 * @return {Function}
	 * @see R.pipeK
	 * @example
	 *
	 *       //  get :: String -> Object -> Maybe *
	 *       var get = R.curry((propName, obj) => Maybe(obj[propName]))
	 *
	 *       //  getStateCode :: Maybe String -> Maybe String
	 *       var getStateCode = R.composeK(
	 *         R.compose(Maybe.of, R.toUpper),
	 *         get('state'),
	 *         get('address'),
	 *         get('user'),
	 *       );
	 *       getStateCode({"user":{"address":{"state":"ny"}}}); //=> Maybe.Just("NY")
	 *       getStateCode({}); //=> Maybe.Nothing()
	 * @symb R.composeK(f, g, h)(a) = R.chain(f, R.chain(g, h(a)))
	 */
	module.exports = function composeK() {
	  if (arguments.length === 0) {
	    throw new Error('composeK requires at least one argument');
	  }
	  var init = Array.prototype.slice.call(arguments);
	  var last = init.pop();
	  return compose(compose.apply(this, map(chain, init)), last);
	};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	var pipeP = __webpack_require__(91);
	var reverse = __webpack_require__(88);
	
	
	/**
	 * Performs right-to-left composition of one or more Promise-returning
	 * functions. The rightmost function may have any arity; the remaining
	 * functions must be unary.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category Function
	 * @sig ((y -> Promise z), (x -> Promise y), ..., (a -> Promise b)) -> (a -> Promise z)
	 * @param {...Function} functions The functions to compose
	 * @return {Function}
	 * @see R.pipeP
	 * @example
	 *
	 *      var db = {
	 *        users: {
	 *          JOE: {
	 *            name: 'Joe',
	 *            followers: ['STEVE', 'SUZY']
	 *          }
	 *        }
	 *      }
	 *
	 *      // We'll pretend to do a db lookup which returns a promise
	 *      var lookupUser = (userId) => Promise.resolve(db.users[userId])
	 *      var lookupFollowers = (user) => Promise.resolve(user.followers)
	 *      lookupUser('JOE').then(lookupFollowers)
	 *
	 *      //  followersForUser :: String -> Promise [UserId]
	 *      var followersForUser = R.composeP(lookupFollowers, lookupUser);
	 *      followersForUser('JOE').then(followers => console.log('Followers:', followers))
	 *      // Followers: ["STEVE","SUZY"]
	 */
	module.exports = function composeP() {
	  if (arguments.length === 0) {
	    throw new Error('composeP requires at least one argument');
	  }
	  return pipeP.apply(this, reverse(arguments));
	};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(17);
	var _pipeP = __webpack_require__(92);
	var reduce = __webpack_require__(43);
	var tail = __webpack_require__(85);
	
	
	/**
	 * Performs left-to-right composition of one or more Promise-returning
	 * functions. The leftmost function may have any arity; the remaining functions
	 * must be unary.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category Function
	 * @sig ((a -> Promise b), (b -> Promise c), ..., (y -> Promise z)) -> (a -> Promise z)
	 * @param {...Function} functions
	 * @return {Function}
	 * @see R.composeP
	 * @example
	 *
	 *      //  followersForUser :: String -> Promise [User]
	 *      var followersForUser = R.pipeP(db.getUserById, db.getFollowers);
	 */
	module.exports = function pipeP() {
	  if (arguments.length === 0) {
	    throw new Error('pipeP requires at least one argument');
	  }
	  return _arity(arguments[0].length,
	                reduce(_pipeP, arguments[0], tail(arguments)));
	};


/***/ }),
/* 92 */
/***/ (function(module, exports) {

	module.exports = function _pipeP(f, g) {
	  return function() {
	    var ctx = this;
	    return f.apply(ctx, arguments).then(function(x) {
	      return g.call(ctx, x);
	    });
	  };
	};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _isArray = __webpack_require__(23);
	var _isFunction = __webpack_require__(64);
	var _isString = __webpack_require__(35);
	var toString = __webpack_require__(94);
	
	
	/**
	 * Returns the result of concatenating the given lists or strings.
	 *
	 * Note: `R.concat` expects both arguments to be of the same type,
	 * unlike the native `Array.prototype.concat` method. It will throw
	 * an error if you `concat` an Array with a non-Array value.
	 *
	 * Dispatches to the `concat` method of the first argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [a] -> [a]
	 * @sig String -> String -> String
	 * @param {Array|String} firstList The first list
	 * @param {Array|String} secondList The second list
	 * @return {Array|String} A list consisting of the elements of `firstList` followed by the elements of
	 * `secondList`.
	 *
	 * @example
	 *
	 *      R.concat('ABC', 'DEF'); // 'ABCDEF'
	 *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
	 *      R.concat([], []); //=> []
	 */
	module.exports = _curry2(function concat(a, b) {
	  if (_isArray(a)) {
	    if (_isArray(b)) {
	      return a.concat(b);
	    }
	    throw new TypeError(toString(b) + ' is not an array');
	  }
	  if (_isString(a)) {
	    if (_isString(b)) {
	      return a + b;
	    }
	    throw new TypeError(toString(b) + ' is not a string');
	  }
	  if (a != null && _isFunction(a['fantasy-land/concat'])) {
	    return a['fantasy-land/concat'](b);
	  }
	  if (a != null && _isFunction(a.concat)) {
	    return a.concat(b);
	  }
	  throw new TypeError(toString(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
	});


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _toString = __webpack_require__(95);
	
	
	/**
	 * Returns the string representation of the given value. `eval`'ing the output
	 * should result in a value equivalent to the input value. Many of the built-in
	 * `toString` methods do not satisfy this requirement.
	 *
	 * If the given value is an `[object Object]` with a `toString` method other
	 * than `Object.prototype.toString`, this method is invoked with no arguments
	 * to produce the return value. This means user-defined constructor functions
	 * can provide a suitable `toString` method. For example:
	 *
	 *     function Point(x, y) {
	 *       this.x = x;
	 *       this.y = y;
	 *     }
	 *
	 *     Point.prototype.toString = function() {
	 *       return 'new Point(' + this.x + ', ' + this.y + ')';
	 *     };
	 *
	 *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category String
	 * @sig * -> String
	 * @param {*} val
	 * @return {String}
	 * @example
	 *
	 *      R.toString(42); //=> '42'
	 *      R.toString('abc'); //=> '"abc"'
	 *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
	 *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
	 *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
	 */
	module.exports = _curry1(function toString(val) { return _toString(val, []); });


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	var _contains = __webpack_require__(96);
	var _map = __webpack_require__(32);
	var _quote = __webpack_require__(103);
	var _toISOString = __webpack_require__(104);
	var keys = __webpack_require__(39);
	var reject = __webpack_require__(105);
	
	
	module.exports = function _toString(x, seen) {
	  var recur = function recur(y) {
	    var xs = seen.concat([x]);
	    return _contains(y, xs) ? '<Circular>' : _toString(y, xs);
	  };
	
	  //  mapPairs :: (Object, [String]) -> [String]
	  var mapPairs = function(obj, keys) {
	    return _map(function(k) { return _quote(k) + ': ' + recur(obj[k]); }, keys.slice().sort());
	  };
	
	  switch (Object.prototype.toString.call(x)) {
	    case '[object Arguments]':
	      return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
	    case '[object Array]':
	      return '[' + _map(recur, x).concat(mapPairs(x, reject(function(k) { return /^\d+$/.test(k); }, keys(x)))).join(', ') + ']';
	    case '[object Boolean]':
	      return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
	    case '[object Date]':
	      return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';
	    case '[object Null]':
	      return 'null';
	    case '[object Number]':
	      return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
	    case '[object String]':
	      return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
	    case '[object Undefined]':
	      return 'undefined';
	    default:
	      if (typeof x.toString === 'function') {
	        var repr = x.toString();
	        if (repr !== '[object Object]') {
	          return repr;
	        }
	      }
	      return '{' + mapPairs(x, keys(x)).join(', ') + '}';
	  }
	};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	var _indexOf = __webpack_require__(97);
	
	
	module.exports = function _contains(a, list) {
	  return _indexOf(list, a, 0) >= 0;
	};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	var equals = __webpack_require__(98);
	
	
	module.exports = function _indexOf(list, a, idx) {
	  var inf, item;
	  // Array.prototype.indexOf doesn't exist below IE9
	  if (typeof list.indexOf === 'function') {
	    switch (typeof a) {
	      case 'number':
	        if (a === 0) {
	          // manually crawl the list to distinguish between +0 and -0
	          inf = 1 / a;
	          while (idx < list.length) {
	            item = list[idx];
	            if (item === 0 && 1 / item === inf) {
	              return idx;
	            }
	            idx += 1;
	          }
	          return -1;
	        } else if (a !== a) {
	          // NaN
	          while (idx < list.length) {
	            item = list[idx];
	            if (typeof item === 'number' && item !== item) {
	              return idx;
	            }
	            idx += 1;
	          }
	          return -1;
	        }
	        // non-zero numbers can utilise Set
	        return list.indexOf(a, idx);
	
	      // all these types can utilise Set
	      case 'string':
	      case 'boolean':
	      case 'function':
	      case 'undefined':
	        return list.indexOf(a, idx);
	
	      case 'object':
	        if (a === null) {
	          // null can utilise Set
	          return list.indexOf(a, idx);
	        }
	    }
	  }
	  // anything else not covered above, defer to R.equals
	  while (idx < list.length) {
	    if (equals(list[idx], a)) {
	      return idx;
	    }
	    idx += 1;
	  }
	  return -1;
	};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _equals = __webpack_require__(99);
	
	
	/**
	 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
	 * cyclical data structures.
	 *
	 * Dispatches symmetrically to the `equals` methods of both arguments, if
	 * present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.15.0
	 * @category Relation
	 * @sig a -> b -> Boolean
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 * @example
	 *
	 *      R.equals(1, 1); //=> true
	 *      R.equals(1, '1'); //=> false
	 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
	 *
	 *      var a = {}; a.v = a;
	 *      var b = {}; b.v = b;
	 *      R.equals(a, b); //=> true
	 */
	module.exports = _curry2(function equals(a, b) {
	  return _equals(a, b, [], []);
	});


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	var _arrayFromIterator = __webpack_require__(100);
	var _functionName = __webpack_require__(101);
	var _has = __webpack_require__(40);
	var identical = __webpack_require__(102);
	var keys = __webpack_require__(39);
	var type = __webpack_require__(78);
	
	
	module.exports = function _equals(a, b, stackA, stackB) {
	  if (identical(a, b)) {
	    return true;
	  }
	
	  if (type(a) !== type(b)) {
	    return false;
	  }
	
	  if (a == null || b == null) {
	    return false;
	  }
	
	  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
	    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) &&
	           typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
	  }
	
	  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
	    return typeof a.equals === 'function' && a.equals(b) &&
	           typeof b.equals === 'function' && b.equals(a);
	  }
	
	  switch (type(a)) {
	    case 'Arguments':
	    case 'Array':
	    case 'Object':
	      if (typeof a.constructor === 'function' &&
	          _functionName(a.constructor) === 'Promise') {
	        return a === b;
	      }
	      break;
	    case 'Boolean':
	    case 'Number':
	    case 'String':
	      if (!(typeof a === typeof b && identical(a.valueOf(), b.valueOf()))) {
	        return false;
	      }
	      break;
	    case 'Date':
	      if (!identical(a.valueOf(), b.valueOf())) {
	        return false;
	      }
	      break;
	    case 'Error':
	      return a.name === b.name && a.message === b.message;
	    case 'RegExp':
	      if (!(a.source === b.source &&
	            a.global === b.global &&
	            a.ignoreCase === b.ignoreCase &&
	            a.multiline === b.multiline &&
	            a.sticky === b.sticky &&
	            a.unicode === b.unicode)) {
	        return false;
	      }
	      break;
	    case 'Map':
	    case 'Set':
	      if (!_equals(_arrayFromIterator(a.entries()), _arrayFromIterator(b.entries()), stackA, stackB)) {
	        return false;
	      }
	      break;
	    case 'Int8Array':
	    case 'Uint8Array':
	    case 'Uint8ClampedArray':
	    case 'Int16Array':
	    case 'Uint16Array':
	    case 'Int32Array':
	    case 'Uint32Array':
	    case 'Float32Array':
	    case 'Float64Array':
	      break;
	    case 'ArrayBuffer':
	      break;
	    default:
	      // Values of other types are only equal if identical.
	      return false;
	  }
	
	  var keysA = keys(a);
	  if (keysA.length !== keys(b).length) {
	    return false;
	  }
	
	  var idx = stackA.length - 1;
	  while (idx >= 0) {
	    if (stackA[idx] === a) {
	      return stackB[idx] === b;
	    }
	    idx -= 1;
	  }
	
	  stackA.push(a);
	  stackB.push(b);
	  idx = keysA.length - 1;
	  while (idx >= 0) {
	    var key = keysA[idx];
	    if (!(_has(key, b) && _equals(b[key], a[key], stackA, stackB))) {
	      return false;
	    }
	    idx -= 1;
	  }
	  stackA.pop();
	  stackB.pop();
	  return true;
	};


/***/ }),
/* 100 */
/***/ (function(module, exports) {

	module.exports = function _arrayFromIterator(iter) {
	  var list = [];
	  var next;
	  while (!(next = iter.next()).done) {
	    list.push(next.value);
	  }
	  return list;
	};


/***/ }),
/* 101 */
/***/ (function(module, exports) {

	module.exports = function _functionName(f) {
	  // String(x => x) evaluates to "x => x", so the pattern may not match.
	  var match = String(f).match(/^function (\w*)/);
	  return match == null ? '' : match[1];
	};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns true if its arguments are identical, false otherwise. Values are
	 * identical if they reference the same memory. `NaN` is identical to `NaN`;
	 * `0` and `-0` are not identical.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.15.0
	 * @category Relation
	 * @sig a -> a -> Boolean
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 * @example
	 *
	 *      var o = {};
	 *      R.identical(o, o); //=> true
	 *      R.identical(1, 1); //=> true
	 *      R.identical(1, '1'); //=> false
	 *      R.identical([], []); //=> false
	 *      R.identical(0, -0); //=> false
	 *      R.identical(NaN, NaN); //=> true
	 */
	module.exports = _curry2(function identical(a, b) {
	  // SameValue algorithm
	  if (a === b) { // Steps 1-5, 7-10
	    // Steps 6.b-6.e: +0 != -0
	    return a !== 0 || 1 / a === 1 / b;
	  } else {
	    // Step 6.a: NaN == NaN
	    return a !== a && b !== b;
	  }
	});


/***/ }),
/* 103 */
/***/ (function(module, exports) {

	module.exports = function _quote(s) {
	  var escaped = s
	    .replace(/\\/g, '\\\\')
	    .replace(/[\b]/g, '\\b')  // \b matches word boundary; [\b] matches backspace
	    .replace(/\f/g, '\\f')
	    .replace(/\n/g, '\\n')
	    .replace(/\r/g, '\\r')
	    .replace(/\t/g, '\\t')
	    .replace(/\v/g, '\\v')
	    .replace(/\0/g, '\\0');
	
	  return '"' + escaped.replace(/"/g, '\\"') + '"';
	};


/***/ }),
/* 104 */
/***/ (function(module, exports) {

	/**
	 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
	 */
	module.exports = (function() {
	  var pad = function pad(n) { return (n < 10 ? '0' : '') + n; };
	
	  return typeof Date.prototype.toISOString === 'function' ?
	    function _toISOString(d) {
	      return d.toISOString();
	    } :
	    function _toISOString(d) {
	      return (
	        d.getUTCFullYear() + '-' +
	        pad(d.getUTCMonth() + 1) + '-' +
	        pad(d.getUTCDate()) + 'T' +
	        pad(d.getUTCHours()) + ':' +
	        pad(d.getUTCMinutes()) + ':' +
	        pad(d.getUTCSeconds()) + '.' +
	        (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z'
	      );
	    };
	}());


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	var _complement = __webpack_require__(106);
	var _curry2 = __webpack_require__(13);
	var filter = __webpack_require__(107);
	
	
	/**
	 * The complement of [`filter`](#filter).
	 *
	 * Acts as a transducer if a transformer is given in list position. Filterable
	 * objects include plain objects or any object that has a filter method such
	 * as `Array`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Filterable f => (a -> Boolean) -> f a -> f a
	 * @param {Function} pred
	 * @param {Array} filterable
	 * @return {Array}
	 * @see R.filter, R.transduce, R.addIndex
	 * @example
	 *
	 *      var isOdd = (n) => n % 2 === 1;
	 *
	 *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
	 *
	 *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
	 */
	module.exports = _curry2(function reject(pred, filterable) {
	  return filter(_complement(pred), filterable);
	});


/***/ }),
/* 106 */
/***/ (function(module, exports) {

	module.exports = function _complement(f) {
	  return function() {
	    return !f.apply(this, arguments);
	  };
	};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _filter = __webpack_require__(108);
	var _isObject = __webpack_require__(109);
	var _reduce = __webpack_require__(33);
	var _xfilter = __webpack_require__(110);
	var keys = __webpack_require__(39);
	
	
	/**
	 * Takes a predicate and a `Filterable`, and returns a new filterable of the
	 * same type containing the members of the given filterable which satisfy the
	 * given predicate. Filterable objects include plain objects or any object
	 * that has a filter method such as `Array`.
	 *
	 * Dispatches to the `filter` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Filterable f => (a -> Boolean) -> f a -> f a
	 * @param {Function} pred
	 * @param {Array} filterable
	 * @return {Array} Filterable
	 * @see R.reject, R.transduce, R.addIndex
	 * @example
	 *
	 *      var isEven = n => n % 2 === 0;
	 *
	 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
	 *
	 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
	 */
	module.exports = _curry2(_dispatchable(['filter'], _xfilter, function(pred, filterable) {
	  return (
	    _isObject(filterable) ?
	      _reduce(function(acc, key) {
	        if (pred(filterable[key])) {
	          acc[key] = filterable[key];
	        }
	        return acc;
	      }, {}, keys(filterable)) :
	    // else
	      _filter(pred, filterable)
	  );
	}));


/***/ }),
/* 108 */
/***/ (function(module, exports) {

	module.exports = function _filter(fn, list) {
	  var idx = 0;
	  var len = list.length;
	  var result = [];
	
	  while (idx < len) {
	    if (fn(list[idx])) {
	      result[result.length] = list[idx];
	    }
	    idx += 1;
	  }
	  return result;
	};


/***/ }),
/* 109 */
/***/ (function(module, exports) {

	module.exports = function _isObject(x) {
	  return Object.prototype.toString.call(x) === '[object Object]';
	};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XFilter(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }
	  XFilter.prototype['@@transducer/init'] = _xfBase.init;
	  XFilter.prototype['@@transducer/result'] = _xfBase.result;
	  XFilter.prototype['@@transducer/step'] = function(result, input) {
	    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
	  };
	
	  return _curry2(function _xfilter(f, xf) { return new XFilter(f, xf); });
	}());


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(17);
	var _curry1 = __webpack_require__(8);
	var map = __webpack_require__(31);
	var max = __webpack_require__(29);
	var reduce = __webpack_require__(43);
	
	
	/**
	 * Returns a function, `fn`, which encapsulates `if/else, if/else, ...` logic.
	 * `R.cond` takes a list of [predicate, transformer] pairs. All of the arguments
	 * to `fn` are applied to each of the predicates in turn until one returns a
	 * "truthy" value, at which point `fn` returns the result of applying its
	 * arguments to the corresponding transformer. If none of the predicates
	 * matches, `fn` returns undefined.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.6.0
	 * @category Logic
	 * @sig [[(*... -> Boolean),(*... -> *)]] -> (*... -> *)
	 * @param {Array} pairs A list of [predicate, transformer]
	 * @return {Function}
	 * @example
	 *
	 *      var fn = R.cond([
	 *        [R.equals(0),   R.always('water freezes at 0°C')],
	 *        [R.equals(100), R.always('water boils at 100°C')],
	 *        [R.T,           temp => 'nothing special happens at ' + temp + '°C']
	 *      ]);
	 *      fn(0); //=> 'water freezes at 0°C'
	 *      fn(50); //=> 'nothing special happens at 50°C'
	 *      fn(100); //=> 'water boils at 100°C'
	 */
	module.exports = _curry1(function cond(pairs) {
	  var arity = reduce(max,
	                     0,
	                     map(function(pair) { return pair[0].length; }, pairs));
	  return _arity(arity, function() {
	    var idx = 0;
	    while (idx < pairs.length) {
	      if (pairs[idx][0].apply(this, arguments)) {
	        return pairs[idx][1].apply(this, arguments);
	      }
	      idx += 1;
	    }
	  });
	});


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var constructN = __webpack_require__(113);
	
	
	/**
	 * Wraps a constructor function inside a curried function that can be called
	 * with the same arguments and returns the same type.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (* -> {*}) -> (* -> {*})
	 * @param {Function} fn The constructor function to wrap.
	 * @return {Function} A wrapped, curried constructor function.
	 * @see R.invoker
	 * @example
	 *
	 *      // Constructor function
	 *      function Animal(kind) {
	 *        this.kind = kind;
	 *      };
	 *      Animal.prototype.sighting = function() {
	 *        return "It's a " + this.kind + "!";
	 *      }
	 *
	 *      var AnimalConstructor = R.construct(Animal)
	 *
	 *      // Notice we no longer need the 'new' keyword:
	 *      AnimalConstructor('Pig'); //=> {"kind": "Pig", "sighting": function (){...}};
	 *
	 *      var animalTypes = ["Lion", "Tiger", "Bear"];
	 *      var animalSighting = R.invoker(0, 'sighting');
	 *      var sightNewAnimal = R.compose(animalSighting, AnimalConstructor);
	 *      R.map(sightNewAnimal, animalTypes); //=> ["It's a Lion!", "It's a Tiger!", "It's a Bear!"]
	 */
	module.exports = _curry1(function construct(Fn) {
	  return constructN(Fn.length, Fn);
	});


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var curry = __webpack_require__(68);
	var nAry = __webpack_require__(62);
	
	
	/**
	 * Wraps a constructor function inside a curried function that can be called
	 * with the same arguments and returns the same type. The arity of the function
	 * returned is specified to allow using variadic constructor functions.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.4.0
	 * @category Function
	 * @sig Number -> (* -> {*}) -> (* -> {*})
	 * @param {Number} n The arity of the constructor function.
	 * @param {Function} Fn The constructor function to wrap.
	 * @return {Function} A wrapped, curried constructor function.
	 * @example
	 *
	 *      // Variadic Constructor function
	 *      function Salad() {
	 *        this.ingredients = arguments;
	 *      };
	 *      Salad.prototype.recipe = function() {
	 *        var instructions = R.map((ingredient) => (
	 *          'Add a whollop of ' + ingredient, this.ingredients)
	 *        )
	 *        return R.join('\n', instructions)
	 *      }
	 *
	 *      var ThreeLayerSalad = R.constructN(3, Salad)
	 *
	 *      // Notice we no longer need the 'new' keyword, and the constructor is curried for 3 arguments.
	 *      var salad = ThreeLayerSalad('Mayonnaise')('Potato Chips')('Ketchup')
	 *      console.log(salad.recipe());
	 *      // Add a whollop of Mayonnaise
	 *      // Add a whollop of Potato Chips
	 *      // Add a whollop of Potato Ketchup
	 */
	module.exports = _curry2(function constructN(n, Fn) {
	  if (n > 10) {
	    throw new Error('Constructor with greater than ten arguments');
	  }
	  if (n === 0) {
	    return function() { return new Fn(); };
	  }
	  return curry(nAry(n, function($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
	    switch (arguments.length) {
	      case  1: return new Fn($0);
	      case  2: return new Fn($0, $1);
	      case  3: return new Fn($0, $1, $2);
	      case  4: return new Fn($0, $1, $2, $3);
	      case  5: return new Fn($0, $1, $2, $3, $4);
	      case  6: return new Fn($0, $1, $2, $3, $4, $5);
	      case  7: return new Fn($0, $1, $2, $3, $4, $5, $6);
	      case  8: return new Fn($0, $1, $2, $3, $4, $5, $6, $7);
	      case  9: return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);
	      case 10: return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
	    }
	  }));
	});


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	var _contains = __webpack_require__(96);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns `true` if the specified value is equal, in [`R.equals`](#equals)
	 * terms, to at least one element of the given list; `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig a -> [a] -> Boolean
	 * @param {Object} a The item to compare against.
	 * @param {Array} list The array to consider.
	 * @return {Boolean} `true` if an equivalent item is in the list, `false` otherwise.
	 * @see R.any
	 * @example
	 *
	 *      R.contains(3, [1, 2, 3]); //=> true
	 *      R.contains(4, [1, 2, 3]); //=> false
	 *      R.contains({ name: 'Fred' }, [{ name: 'Fred' }]); //=> true
	 *      R.contains([42], [[42]]); //=> true
	 */
	module.exports = _curry2(_contains);


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _map = __webpack_require__(32);
	var curryN = __webpack_require__(16);
	var max = __webpack_require__(29);
	var pluck = __webpack_require__(30);
	var reduce = __webpack_require__(43);
	
	
	/**
	 * Accepts a converging function and a list of branching functions and returns
	 * a new function. When invoked, this new function is applied to some
	 * arguments, each branching function is applied to those same arguments. The
	 * results of each branching function are passed as arguments to the converging
	 * function to produce the return value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.4.2
	 * @category Function
	 * @sig (x1 -> x2 -> ... -> z) -> [(a -> b -> ... -> x1), (a -> b -> ... -> x2), ...] -> (a -> b -> ... -> z)
	 * @param {Function} after A function. `after` will be invoked with the return values of
	 *        `fn1` and `fn2` as its arguments.
	 * @param {Array} functions A list of functions.
	 * @return {Function} A new function.
	 * @see R.useWith
	 * @example
	 *
	 *      var average = R.converge(R.divide, [R.sum, R.length])
	 *      average([1, 2, 3, 4, 5, 6, 7]) //=> 4
	 *
	 *      var strangeConcat = R.converge(R.concat, [R.toUpper, R.toLower])
	 *      strangeConcat("Yodel") //=> "YODELyodel"
	 *
	 * @symb R.converge(f, [g, h])(a, b) = f(g(a, b), h(a, b))
	 */
	module.exports = _curry2(function converge(after, fns) {
	  return curryN(reduce(max, 0, pluck('length', fns)), function() {
	    var args = arguments;
	    var context = this;
	    return after.apply(context, _map(function(fn) {
	      return fn.apply(context, args);
	    }, fns));
	  });
	});


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	var reduceBy = __webpack_require__(117);
	
	
	/**
	 * Counts the elements of a list according to how many match each value of a
	 * key generated by the supplied function. Returns an object mapping the keys
	 * produced by `fn` to the number of occurrences in the list. Note that all
	 * keys are coerced to strings because of how JavaScript objects work.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig (a -> String) -> [a] -> {*}
	 * @param {Function} fn The function used to map values to keys.
	 * @param {Array} list The list to count elements from.
	 * @return {Object} An object mapping keys to number of occurrences in the list.
	 * @example
	 *
	 *      var numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
	 *      R.countBy(Math.floor)(numbers);    //=> {'1': 3, '2': 2, '3': 1}
	 *
	 *      var letters = ['a', 'b', 'A', 'a', 'B', 'c'];
	 *      R.countBy(R.toLower)(letters);   //=> {'a': 3, 'b': 2, 'c': 1}
	 */
	module.exports = reduceBy(function(acc, elem) { return acc + 1; }, 0);


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	var _curryN = __webpack_require__(18);
	var _dispatchable = __webpack_require__(22);
	var _has = __webpack_require__(40);
	var _reduce = __webpack_require__(33);
	var _xreduceBy = __webpack_require__(118);
	
	
	/**
	 * Groups the elements of the list according to the result of calling
	 * the String-returning function `keyFn` on each element and reduces the elements
	 * of each group to a single value via the reducer function `valueFn`.
	 *
	 * This function is basically a more general [`groupBy`](#groupBy) function.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.20.0
	 * @category List
	 * @sig ((a, b) -> a) -> a -> (b -> String) -> [b] -> {String: a}
	 * @param {Function} valueFn The function that reduces the elements of each group to a single
	 *        value. Receives two values, accumulator for a particular group and the current element.
	 * @param {*} acc The (initial) accumulator value for each group.
	 * @param {Function} keyFn The function that maps the list's element into a key.
	 * @param {Array} list The array to group.
	 * @return {Object} An object with the output of `keyFn` for keys, mapped to the output of
	 *         `valueFn` for elements which produced that key when passed to `keyFn`.
	 * @see R.groupBy, R.reduce
	 * @example
	 *
	 *      var reduceToNamesBy = R.reduceBy((acc, student) => acc.concat(student.name), []);
	 *      var namesByGrade = reduceToNamesBy(function(student) {
	 *        var score = student.score;
	 *        return score < 65 ? 'F' :
	 *               score < 70 ? 'D' :
	 *               score < 80 ? 'C' :
	 *               score < 90 ? 'B' : 'A';
	 *      });
	 *      var students = [{name: 'Lucy', score: 92},
	 *                      {name: 'Drew', score: 85},
	 *                      // ...
	 *                      {name: 'Bart', score: 62}];
	 *      namesByGrade(students);
	 *      // {
	 *      //   'A': ['Lucy'],
	 *      //   'B': ['Drew']
	 *      //   // ...,
	 *      //   'F': ['Bart']
	 *      // }
	 */
	module.exports = _curryN(4, [], _dispatchable([], _xreduceBy,
	  function reduceBy(valueFn, valueAcc, keyFn, list) {
	    return _reduce(function(acc, elt) {
	      var key = keyFn(elt);
	      acc[key] = valueFn(_has(key, acc) ? acc[key] : valueAcc, elt);
	      return acc;
	    }, {}, list);
	  }));


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	var _curryN = __webpack_require__(18);
	var _has = __webpack_require__(40);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XReduceBy(valueFn, valueAcc, keyFn, xf) {
	    this.valueFn = valueFn;
	    this.valueAcc = valueAcc;
	    this.keyFn = keyFn;
	    this.xf = xf;
	    this.inputs = {};
	  }
	  XReduceBy.prototype['@@transducer/init'] = _xfBase.init;
	  XReduceBy.prototype['@@transducer/result'] = function(result) {
	    var key;
	    for (key in this.inputs) {
	      if (_has(key, this.inputs)) {
	        result = this.xf['@@transducer/step'](result, this.inputs[key]);
	        if (result['@@transducer/reduced']) {
	          result = result['@@transducer/value'];
	          break;
	        }
	      }
	    }
	    this.inputs = null;
	    return this.xf['@@transducer/result'](result);
	  };
	  XReduceBy.prototype['@@transducer/step'] = function(result, input) {
	    var key = this.keyFn(input);
	    this.inputs[key] = this.inputs[key] || [key, this.valueAcc];
	    this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
	    return result;
	  };
	
	  return _curryN(4, [],
	                 function _xreduceBy(valueFn, valueAcc, keyFn, xf) {
	                   return new XReduceBy(valueFn, valueAcc, keyFn, xf);
	                 });
	}());


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	var add = __webpack_require__(12);
	
	
	/**
	 * Decrements its argument.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Math
	 * @sig Number -> Number
	 * @param {Number} n
	 * @return {Number} n - 1
	 * @see R.inc
	 * @example
	 *
	 *      R.dec(42); //=> 41
	 */
	module.exports = add(-1);


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns the second argument if it is not `null`, `undefined` or `NaN`;
	 * otherwise the first argument is returned.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category Logic
	 * @sig a -> b -> a | b
	 * @param {a} default The default value.
	 * @param {b} val `val` will be returned instead of `default` unless `val` is `null`, `undefined` or `NaN`.
	 * @return {*} The second value if it is not `null`, `undefined` or `NaN`, otherwise the default value
	 * @example
	 *
	 *      var defaultTo42 = R.defaultTo(42);
	 *
	 *      defaultTo42(null);  //=> 42
	 *      defaultTo42(undefined);  //=> 42
	 *      defaultTo42('Ramda');  //=> 'Ramda'
	 *      // parseInt('string') results in NaN
	 *      defaultTo42(parseInt('string')); //=> 42
	 */
	module.exports = _curry2(function defaultTo(d, v) {
	  return v == null || v !== v ? d : v;
	});


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Makes a descending comparator function out of a function that returns a value
	 * that can be compared with `<` and `>`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.23.0
	 * @category Function
	 * @sig Ord b => (a -> b) -> a -> a -> Number
	 * @param {Function} fn A function of arity one that returns a value that can be compared
	 * @param {*} a The first item to be compared.
	 * @param {*} b The second item to be compared.
	 * @return {Number} `-1` if fn(a) > fn(b), `1` if fn(b) > fn(a), otherwise `0`
	 * @see R.ascend
	 * @example
	 *
	 *      var byAge = R.descend(R.prop('age'));
	 *      var people = [
	 *        // ...
	 *      ];
	 *      var peopleByOldestFirst = R.sort(byAge, people);
	 */
	module.exports = _curry3(function descend(fn, a, b) {
	  var aa = fn(a);
	  var bb = fn(b);
	  return aa > bb ? -1 : aa < bb ? 1 : 0;
	});


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	var _contains = __webpack_require__(96);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Finds the set (i.e. no duplicates) of all elements in the first list not
	 * contained in the second list. Objects and Arrays are compared in terms of
	 * value equality, not reference equality.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig [*] -> [*] -> [*]
	 * @param {Array} list1 The first list.
	 * @param {Array} list2 The second list.
	 * @return {Array} The elements in `list1` that are not in `list2`.
	 * @see R.differenceWith, R.symmetricDifference, R.symmetricDifferenceWith, R.without
	 * @example
	 *
	 *      R.difference([1,2,3,4], [7,6,5,4,3]); //=> [1,2]
	 *      R.difference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5]
	 *      R.difference([{a: 1}, {b: 2}], [{a: 1}, {c: 3}]) //=> [{b: 2}]
	 */
	module.exports = _curry2(function difference(first, second) {
	  var out = [];
	  var idx = 0;
	  var firstLen = first.length;
	  while (idx < firstLen) {
	    if (!_contains(first[idx], second) && !_contains(first[idx], out)) {
	      out[out.length] = first[idx];
	    }
	    idx += 1;
	  }
	  return out;
	});


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

	var _containsWith = __webpack_require__(124);
	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Finds the set (i.e. no duplicates) of all elements in the first list not
	 * contained in the second list. Duplication is determined according to the
	 * value returned by applying the supplied predicate to two list elements.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig ((a, a) -> Boolean) -> [a] -> [a] -> [a]
	 * @param {Function} pred A predicate used to test whether two items are equal.
	 * @param {Array} list1 The first list.
	 * @param {Array} list2 The second list.
	 * @return {Array} The elements in `list1` that are not in `list2`.
	 * @see R.difference, R.symmetricDifference, R.symmetricDifferenceWith
	 * @example
	 *
	 *      var cmp = (x, y) => x.a === y.a;
	 *      var l1 = [{a: 1}, {a: 2}, {a: 3}];
	 *      var l2 = [{a: 3}, {a: 4}];
	 *      R.differenceWith(cmp, l1, l2); //=> [{a: 1}, {a: 2}]
	 */
	module.exports = _curry3(function differenceWith(pred, first, second) {
	  var out = [];
	  var idx = 0;
	  var firstLen = first.length;
	  while (idx < firstLen) {
	    if (!_containsWith(pred, first[idx], second) &&
	        !_containsWith(pred, first[idx], out)) {
	      out.push(first[idx]);
	    }
	    idx += 1;
	  }
	  return out;
	});


/***/ }),
/* 124 */
/***/ (function(module, exports) {

	module.exports = function _containsWith(pred, x, list) {
	  var idx = 0;
	  var len = list.length;
	
	  while (idx < len) {
	    if (pred(x, list[idx])) {
	      return true;
	    }
	    idx += 1;
	  }
	  return false;
	};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a new object that does not contain a `prop` property.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category Object
	 * @sig String -> {k: v} -> {k: v}
	 * @param {String} prop The name of the property to dissociate
	 * @param {Object} obj The object to clone
	 * @return {Object} A new object equivalent to the original but without the specified property
	 * @see R.assoc
	 * @example
	 *
	 *      R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
	 */
	module.exports = _curry2(function dissoc(prop, obj) {
	  var result = {};
	  for (var p in obj) {
	    result[p] = obj[p];
	  }
	  delete result[prop];
	  return result;
	});


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _isInteger = __webpack_require__(59);
	var assoc = __webpack_require__(57);
	var dissoc = __webpack_require__(125);
	var remove = __webpack_require__(127);
	var update = __webpack_require__(128);
	
	
	/**
	 * Makes a shallow clone of an object, omitting the property at the given path.
	 * Note that this copies and flattens prototype properties onto the new object
	 * as well. All non-primitive properties are copied by reference.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.11.0
	 * @category Object
	 * @typedefn Idx = String | Int
	 * @sig [Idx] -> {k: v} -> {k: v}
	 * @param {Array} path The path to the value to omit
	 * @param {Object} obj The object to clone
	 * @return {Object} A new object without the property at path
	 * @see R.assocPath
	 * @example
	 *
	 *      R.dissocPath(['a', 'b', 'c'], {a: {b: {c: 42}}}); //=> {a: {b: {}}}
	 */
	module.exports = _curry2(function dissocPath(path, obj) {
	  switch (path.length) {
	    case 0:
	      return obj;
	    case 1:
	      return _isInteger(path[0]) ? remove(path[0], 1, obj) : dissoc(path[0], obj);
	    default:
	      var head = path[0];
	      var tail = Array.prototype.slice.call(path, 1);
	      if (obj[head] == null) {
	        return obj;
	      } else if (_isInteger(path[0])) {
	        return update(head, dissocPath(tail, obj[head]), obj);
	      } else {
	        return assoc(head, dissocPath(tail, obj[head]), obj);
	      }
	  }
	});


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Removes the sub-list of `list` starting at index `start` and containing
	 * `count` elements. _Note that this is not destructive_: it returns a copy of
	 * the list with the changes.
	 * <small>No lists have been harmed in the application of this function.</small>
	 *
	 * @func
	 * @memberOf R
	 * @since v0.2.2
	 * @category List
	 * @sig Number -> Number -> [a] -> [a]
	 * @param {Number} start The position to start removing elements
	 * @param {Number} count The number of elements to remove
	 * @param {Array} list The list to remove from
	 * @return {Array} A new Array with `count` elements from `start` removed.
	 * @example
	 *
	 *      R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
	 */
	module.exports = _curry3(function remove(start, count, list) {
	  var result = Array.prototype.slice.call(list, 0);
	  result.splice(start, count);
	  return result;
	});


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var adjust = __webpack_require__(19);
	var always = __webpack_require__(7);
	
	
	/**
	 * Returns a new copy of the array with the element at the provided index
	 * replaced with the given value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category List
	 * @sig Number -> a -> [a] -> [a]
	 * @param {Number} idx The index to update.
	 * @param {*} x The value to exist at the given index of the returned array.
	 * @param {Array|Arguments} list The source array-like object to be updated.
	 * @return {Array} A copy of `list` with the value at index `idx` replaced with `x`.
	 * @see R.adjust
	 * @example
	 *
	 *      R.update(1, 11, [0, 1, 2]);     //=> [0, 11, 2]
	 *      R.update(1)(11)([0, 1, 2]);     //=> [0, 11, 2]
	 * @symb R.update(-1, a, [b, c]) = [b, a]
	 * @symb R.update(0, a, [b, c]) = [a, c]
	 * @symb R.update(1, a, [b, c]) = [b, a]
	 */
	module.exports = _curry3(function update(idx, x, list) {
	  return adjust(always(x), idx, list);
	});


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Divides two numbers. Equivalent to `a / b`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Math
	 * @sig Number -> Number -> Number
	 * @param {Number} a The first value.
	 * @param {Number} b The second value.
	 * @return {Number} The result of `a / b`.
	 * @see R.multiply
	 * @example
	 *
	 *      R.divide(71, 100); //=> 0.71
	 *
	 *      var half = R.divide(R.__, 2);
	 *      half(42); //=> 21
	 *
	 *      var reciprocal = R.divide(1);
	 *      reciprocal(4);   //=> 0.25
	 */
	module.exports = _curry2(function divide(a, b) { return a / b; });


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xdrop = __webpack_require__(131);
	var slice = __webpack_require__(87);
	
	
	/**
	 * Returns all but the first `n` elements of the given list, string, or
	 * transducer/transformer (or object with a `drop` method).
	 *
	 * Dispatches to the `drop` method of the second argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Number -> [a] -> [a]
	 * @sig Number -> String -> String
	 * @param {Number} n
	 * @param {*} list
	 * @return {*} A copy of list without the first `n` elements
	 * @see R.take, R.transduce, R.dropLast, R.dropWhile
	 * @example
	 *
	 *      R.drop(1, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
	 *      R.drop(2, ['foo', 'bar', 'baz']); //=> ['baz']
	 *      R.drop(3, ['foo', 'bar', 'baz']); //=> []
	 *      R.drop(4, ['foo', 'bar', 'baz']); //=> []
	 *      R.drop(3, 'ramda');               //=> 'da'
	 */
	module.exports = _curry2(_dispatchable(['drop'], _xdrop, function drop(n, xs) {
	  return slice(Math.max(0, n), Infinity, xs);
	}));


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XDrop(n, xf) {
	    this.xf = xf;
	    this.n = n;
	  }
	  XDrop.prototype['@@transducer/init'] = _xfBase.init;
	  XDrop.prototype['@@transducer/result'] = _xfBase.result;
	  XDrop.prototype['@@transducer/step'] = function(result, input) {
	    if (this.n > 0) {
	      this.n -= 1;
	      return result;
	    }
	    return this.xf['@@transducer/step'](result, input);
	  };
	
	  return _curry2(function _xdrop(n, xf) { return new XDrop(n, xf); });
	}());


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _dropLast = __webpack_require__(133);
	var _xdropLast = __webpack_require__(136);
	
	
	/**
	 * Returns a list containing all but the last `n` elements of the given `list`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category List
	 * @sig Number -> [a] -> [a]
	 * @sig Number -> String -> String
	 * @param {Number} n The number of elements of `list` to skip.
	 * @param {Array} list The list of elements to consider.
	 * @return {Array} A copy of the list with only the first `list.length - n` elements
	 * @see R.takeLast, R.drop, R.dropWhile, R.dropLastWhile
	 * @example
	 *
	 *      R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
	 *      R.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']
	 *      R.dropLast(3, ['foo', 'bar', 'baz']); //=> []
	 *      R.dropLast(4, ['foo', 'bar', 'baz']); //=> []
	 *      R.dropLast(3, 'ramda');               //=> 'ra'
	 */
	module.exports = _curry2(_dispatchable([], _xdropLast, _dropLast));


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

	var take = __webpack_require__(134);
	
	module.exports = function dropLast(n, xs) {
	  return take(n < xs.length ? xs.length - n : 0, xs);
	};


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xtake = __webpack_require__(135);
	var slice = __webpack_require__(87);
	
	
	/**
	 * Returns the first `n` elements of the given list, string, or
	 * transducer/transformer (or object with a `take` method).
	 *
	 * Dispatches to the `take` method of the second argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Number -> [a] -> [a]
	 * @sig Number -> String -> String
	 * @param {Number} n
	 * @param {*} list
	 * @return {*}
	 * @see R.drop
	 * @example
	 *
	 *      R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']
	 *      R.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
	 *      R.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	 *      R.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	 *      R.take(3, 'ramda');               //=> 'ram'
	 *
	 *      var personnel = [
	 *        'Dave Brubeck',
	 *        'Paul Desmond',
	 *        'Eugene Wright',
	 *        'Joe Morello',
	 *        'Gerry Mulligan',
	 *        'Bob Bates',
	 *        'Joe Dodge',
	 *        'Ron Crotty'
	 *      ];
	 *
	 *      var takeFive = R.take(5);
	 *      takeFive(personnel);
	 *      //=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']
	 * @symb R.take(-1, [a, b]) = [a, b]
	 * @symb R.take(0, [a, b]) = []
	 * @symb R.take(1, [a, b]) = [a]
	 * @symb R.take(2, [a, b]) = [a, b]
	 */
	module.exports = _curry2(_dispatchable(['take'], _xtake, function take(n, xs) {
	  return slice(0, n < 0 ? Infinity : n, xs);
	}));


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _reduced = __webpack_require__(26);
	var _xfBase = __webpack_require__(27);
	
	module.exports = (function() {
	  function XTake(n, xf) {
	    this.xf = xf;
	    this.n = n;
	    this.i = 0;
	  }
	  XTake.prototype['@@transducer/init'] = _xfBase.init;
	  XTake.prototype['@@transducer/result'] = _xfBase.result;
	  XTake.prototype['@@transducer/step'] = function(result, input) {
	    this.i += 1;
	    var ret = this.n === 0 ? result : this.xf['@@transducer/step'](result, input);
	    return this.n >= 0 && this.i >= this.n ? _reduced(ret) : ret;
	  };
	
	  return _curry2(function _xtake(n, xf) { return new XTake(n, xf); });
	}());


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XDropLast(n, xf) {
	    this.xf = xf;
	    this.pos = 0;
	    this.full = false;
	    this.acc = new Array(n);
	  }
	  XDropLast.prototype['@@transducer/init'] = _xfBase.init;
	  XDropLast.prototype['@@transducer/result'] =  function(result) {
	    this.acc = null;
	    return this.xf['@@transducer/result'](result);
	  };
	  XDropLast.prototype['@@transducer/step'] = function(result, input) {
	    if (this.full) {
	      result = this.xf['@@transducer/step'](result, this.acc[this.pos]);
	    }
	    this.store(input);
	    return result;
	  };
	  XDropLast.prototype.store = function(input) {
	    this.acc[this.pos] = input;
	    this.pos += 1;
	    if (this.pos === this.acc.length) {
	      this.pos = 0;
	      this.full = true;
	    }
	  };
	
	  return _curry2(function _xdropLast(n, xf) { return new XDropLast(n, xf); });
	}());


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _dropLastWhile = __webpack_require__(138);
	var _xdropLastWhile = __webpack_require__(139);
	
	
	/**
	 * Returns a new list excluding all the tailing elements of a given list which
	 * satisfy the supplied predicate function. It passes each value from the right
	 * to the supplied predicate function, skipping elements until the predicate
	 * function returns a `falsy` value. The predicate function is applied to one argument:
	 * *(value)*.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [a]
	 * @param {Function} predicate The function to be called on each element
	 * @param {Array} list The collection to iterate over.
	 * @return {Array} A new array without any trailing elements that return `falsy` values from the `predicate`.
	 * @see R.takeLastWhile, R.addIndex, R.drop, R.dropWhile
	 * @example
	 *
	 *      var lteThree = x => x <= 3;
	 *
	 *      R.dropLastWhile(lteThree, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3, 4]
	 */
	module.exports = _curry2(_dispatchable([], _xdropLastWhile, _dropLastWhile));


/***/ }),
/* 138 */
/***/ (function(module, exports) {

	module.exports = function dropLastWhile(pred, list) {
	  var idx = list.length - 1;
	  while (idx >= 0 && pred(list[idx])) {
	    idx -= 1;
	  }
	  return Array.prototype.slice.call(list, 0, idx + 1);
	};


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _reduce = __webpack_require__(33);
	var _xfBase = __webpack_require__(27);
	
	module.exports = (function() {
	  function XDropLastWhile(fn, xf) {
	    this.f = fn;
	    this.retained = [];
	    this.xf = xf;
	  }
	  XDropLastWhile.prototype['@@transducer/init'] = _xfBase.init;
	  XDropLastWhile.prototype['@@transducer/result'] = function(result) {
	    this.retained = null;
	    return this.xf['@@transducer/result'](result);
	  };
	  XDropLastWhile.prototype['@@transducer/step'] = function(result, input) {
	    return this.f(input) ? this.retain(result, input)
	                         : this.flush(result, input);
	  };
	  XDropLastWhile.prototype.flush = function(result, input) {
	    result = _reduce(
	      this.xf['@@transducer/step'],
	      result,
	      this.retained
	    );
	    this.retained = [];
	    return this.xf['@@transducer/step'](result, input);
	  };
	  XDropLastWhile.prototype.retain = function(result, input) {
	    this.retained.push(input);
	    return result;
	  };
	
	  return _curry2(function _xdropLastWhile(fn, xf) { return new XDropLastWhile(fn, xf); });
	}());


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _dispatchable = __webpack_require__(22);
	var _xdropRepeatsWith = __webpack_require__(141);
	var dropRepeatsWith = __webpack_require__(142);
	var equals = __webpack_require__(98);
	
	
	/**
	 * Returns a new list without any consecutively repeating elements.
	 * [`R.equals`](#equals) is used to determine equality.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category List
	 * @sig [a] -> [a]
	 * @param {Array} list The array to consider.
	 * @return {Array} `list` without repeating elements.
	 * @see R.transduce
	 * @example
	 *
	 *     R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]); //=> [1, 2, 3, 4, 2]
	 */
	module.exports = _curry1(_dispatchable([], _xdropRepeatsWith(equals), dropRepeatsWith(equals)));


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XDropRepeatsWith(pred, xf) {
	    this.xf = xf;
	    this.pred = pred;
	    this.lastValue = undefined;
	    this.seenFirstValue = false;
	  }
	
	  XDropRepeatsWith.prototype['@@transducer/init'] = _xfBase.init;
	  XDropRepeatsWith.prototype['@@transducer/result'] = _xfBase.result;
	  XDropRepeatsWith.prototype['@@transducer/step'] = function(result, input) {
	    var sameAsLast = false;
	    if (!this.seenFirstValue) {
	      this.seenFirstValue = true;
	    } else if (this.pred(this.lastValue, input)) {
	      sameAsLast = true;
	    }
	    this.lastValue = input;
	    return sameAsLast ? result : this.xf['@@transducer/step'](result, input);
	  };
	
	  return _curry2(function _xdropRepeatsWith(pred, xf) { return new XDropRepeatsWith(pred, xf); });
	}());


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xdropRepeatsWith = __webpack_require__(141);
	var last = __webpack_require__(143);
	
	
	/**
	 * Returns a new list without any consecutively repeating elements. Equality is
	 * determined by applying the supplied predicate to each pair of consecutive elements. The
	 * first element in a series of equal elements will be preserved.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category List
	 * @sig (a, a -> Boolean) -> [a] -> [a]
	 * @param {Function} pred A predicate used to test whether two items are equal.
	 * @param {Array} list The array to consider.
	 * @return {Array} `list` without repeating elements.
	 * @see R.transduce
	 * @example
	 *
	 *      var l = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3];
	 *      R.dropRepeatsWith(R.eqBy(Math.abs), l); //=> [1, 3, 4, -5, 3]
	 */
	module.exports = _curry2(_dispatchable([], _xdropRepeatsWith, function dropRepeatsWith(pred, list) {
	  var result = [];
	  var idx = 1;
	  var len = list.length;
	  if (len !== 0) {
	    result[0] = list[0];
	    while (idx < len) {
	      if (!pred(last(result), list[idx])) {
	        result[result.length] = list[idx];
	      }
	      idx += 1;
	    }
	  }
	  return result;
	}));
	


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

	var nth = __webpack_require__(144);
	
	
	/**
	 * Returns the last element of the given list or string.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.4
	 * @category List
	 * @sig [a] -> a | Undefined
	 * @sig String -> String
	 * @param {*} list
	 * @return {*}
	 * @see R.init, R.head, R.tail
	 * @example
	 *
	 *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
	 *      R.last([]); //=> undefined
	 *
	 *      R.last('abc'); //=> 'c'
	 *      R.last(''); //=> ''
	 */
	module.exports = nth(-1);


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _isString = __webpack_require__(35);
	
	
	/**
	 * Returns the nth element of the given list or string. If n is negative the
	 * element at index length + n is returned.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Number -> [a] -> a | Undefined
	 * @sig Number -> String -> String
	 * @param {Number} offset
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      var list = ['foo', 'bar', 'baz', 'quux'];
	 *      R.nth(1, list); //=> 'bar'
	 *      R.nth(-1, list); //=> 'quux'
	 *      R.nth(-99, list); //=> undefined
	 *
	 *      R.nth(2, 'abc'); //=> 'c'
	 *      R.nth(3, 'abc'); //=> ''
	 * @symb R.nth(-1, [a, b, c]) = c
	 * @symb R.nth(0, [a, b, c]) = a
	 * @symb R.nth(1, [a, b, c]) = b
	 */
	module.exports = _curry2(function nth(offset, list) {
	  var idx = offset < 0 ? list.length + offset : offset;
	  return _isString(list) ? list.charAt(idx) : list[idx];
	});


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xdropWhile = __webpack_require__(146);
	
	
	/**
	 * Returns a new list excluding the leading elements of a given list which
	 * satisfy the supplied predicate function. It passes each value to the supplied
	 * predicate function, skipping elements while the predicate function returns
	 * `true`. The predicate function is applied to one argument: *(value)*.
	 *
	 * Dispatches to the `dropWhile` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [a]
	 * @param {Function} fn The function called per iteration.
	 * @param {Array} list The collection to iterate over.
	 * @return {Array} A new array.
	 * @see R.takeWhile, R.transduce, R.addIndex
	 * @example
	 *
	 *      var lteTwo = x => x <= 2;
	 *
	 *      R.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]); //=> [3, 4, 3, 2, 1]
	 */
	module.exports = _curry2(_dispatchable(['dropWhile'], _xdropWhile, function dropWhile(pred, list) {
	  var idx = 0;
	  var len = list.length;
	  while (idx < len && pred(list[idx])) {
	    idx += 1;
	  }
	  return Array.prototype.slice.call(list, idx);
	}));


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XDropWhile(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }
	  XDropWhile.prototype['@@transducer/init'] = _xfBase.init;
	  XDropWhile.prototype['@@transducer/result'] = _xfBase.result;
	  XDropWhile.prototype['@@transducer/step'] = function(result, input) {
	    if (this.f) {
	      if (this.f(input)) {
	        return result;
	      }
	      this.f = null;
	    }
	    return this.xf['@@transducer/step'](result, input);
	  };
	
	  return _curry2(function _xdropWhile(f, xf) { return new XDropWhile(f, xf); });
	}());


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _isFunction = __webpack_require__(64);
	var lift = __webpack_require__(65);
	var or = __webpack_require__(148);
	
	
	/**
	 * A function wrapping calls to the two functions in an `||` operation,
	 * returning the result of the first function if it is truth-y and the result
	 * of the second function otherwise. Note that this is short-circuited,
	 * meaning that the second function will not be invoked if the first returns a
	 * truth-y value.
	 *
	 * In addition to functions, `R.either` also accepts any fantasy-land compatible
	 * applicative functor.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.12.0
	 * @category Logic
	 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
	 * @param {Function} f a predicate
	 * @param {Function} g another predicate
	 * @return {Function} a function that applies its arguments to `f` and `g` and `||`s their outputs together.
	 * @see R.or
	 * @example
	 *
	 *      var gt10 = x => x > 10;
	 *      var even = x => x % 2 === 0;
	 *      var f = R.either(gt10, even);
	 *      f(101); //=> true
	 *      f(8); //=> true
	 */
	module.exports = _curry2(function either(f, g) {
	  return _isFunction(f) ?
	    function _either() {
	      return f.apply(this, arguments) || g.apply(this, arguments);
	    } :
	    lift(or)(f, g);
	});


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns `true` if one or both of its arguments are `true`. Returns `false`
	 * if both arguments are `false`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Logic
	 * @sig a -> b -> a | b
	 * @param {Any} a
	 * @param {Any} b
	 * @return {Any} the first argument if truthy, otherwise the second argument.
	 * @see R.either
	 * @example
	 *
	 *      R.or(true, true); //=> true
	 *      R.or(true, false); //=> true
	 *      R.or(false, true); //=> true
	 *      R.or(false, false); //=> false
	 */
	module.exports = _curry2(function or(a, b) {
	  return a || b;
	});


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _isArguments = __webpack_require__(41);
	var _isArray = __webpack_require__(23);
	var _isObject = __webpack_require__(109);
	var _isString = __webpack_require__(35);
	
	
	/**
	 * Returns the empty value of its argument's type. Ramda defines the empty
	 * value of Array (`[]`), Object (`{}`), String (`''`), and Arguments. Other
	 * types are supported if they define `<Type>.empty` and/or
	 * `<Type>.prototype.empty`.
	 *
	 * Dispatches to the `empty` method of the first argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category Function
	 * @sig a -> a
	 * @param {*} x
	 * @return {*}
	 * @example
	 *
	 *      R.empty(Just(42));      //=> Nothing()
	 *      R.empty([1, 2, 3]);     //=> []
	 *      R.empty('unicorns');    //=> ''
	 *      R.empty({x: 1, y: 2});  //=> {}
	 */
	module.exports = _curry1(function empty(x) {
	  return (
	    (x != null && typeof x['fantasy-land/empty'] === 'function') ?
	      x['fantasy-land/empty']() :
	    (x != null && x.constructor != null && typeof x.constructor['fantasy-land/empty'] === 'function') ?
	      x.constructor['fantasy-land/empty']() :
	    (x != null && typeof x.empty === 'function') ?
	      x.empty() :
	    (x != null && x.constructor != null && typeof x.constructor.empty === 'function') ?
	      x.constructor.empty() :
	    _isArray(x) ?
	      [] :
	    _isString(x) ?
	      '' :
	    _isObject(x) ?
	      {} :
	    _isArguments(x) ?
	      (function() { return arguments; }()) :
	    // else
	      void 0
	  );
	});


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var equals = __webpack_require__(98);
	var takeLast = __webpack_require__(151);
	
	/**
	 * Checks if a list ends with the provided values
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category List
	 * @sig [a] -> Boolean
	 * @sig String -> Boolean
	 * @param {*} suffix
	 * @param {*} list
	 * @return {Boolean}
	 * @example
	 *
	 *      R.endsWith('c', 'abc')                //=> true
	 *      R.endsWith('b', 'abc')                //=> false
	 *      R.endsWith(['c'], ['a', 'b', 'c'])    //=> true
	 *      R.endsWith(['b'], ['a', 'b', 'c'])    //=> false
	 */
	module.exports = _curry2(function(suffix, list) {
	  return equals(takeLast(suffix.length, list), suffix);
	});


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var drop = __webpack_require__(130);
	
	
	/**
	 * Returns a new list containing the last `n` elements of the given list.
	 * If `n > list.length`, returns a list of `list.length` elements.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category List
	 * @sig Number -> [a] -> [a]
	 * @sig Number -> String -> String
	 * @param {Number} n The number of elements to return.
	 * @param {Array} xs The collection to consider.
	 * @return {Array}
	 * @see R.dropLast
	 * @example
	 *
	 *      R.takeLast(1, ['foo', 'bar', 'baz']); //=> ['baz']
	 *      R.takeLast(2, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
	 *      R.takeLast(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	 *      R.takeLast(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	 *      R.takeLast(3, 'ramda');               //=> 'mda'
	 */
	module.exports = _curry2(function takeLast(n, xs) {
	  return drop(n >= 0 ? xs.length - n : 0, xs);
	});


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var equals = __webpack_require__(98);
	
	
	/**
	 * Takes a function and two values in its domain and returns `true` if the
	 * values map to the same value in the codomain; `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.18.0
	 * @category Relation
	 * @sig (a -> b) -> a -> a -> Boolean
	 * @param {Function} f
	 * @param {*} x
	 * @param {*} y
	 * @return {Boolean}
	 * @example
	 *
	 *      R.eqBy(Math.abs, 5, -5); //=> true
	 */
	module.exports = _curry3(function eqBy(f, x, y) {
	  return equals(f(x), f(y));
	});


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var equals = __webpack_require__(98);
	
	
	/**
	 * Reports whether two objects have the same value, in [`R.equals`](#equals)
	 * terms, for the specified property. Useful as a curried predicate.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig k -> {k: v} -> {k: v} -> Boolean
	 * @param {String} prop The name of the property to compare
	 * @param {Object} obj1
	 * @param {Object} obj2
	 * @return {Boolean}
	 *
	 * @example
	 *
	 *      var o1 = { a: 1, b: 2, c: 3, d: 4 };
	 *      var o2 = { a: 10, b: 20, c: 3, d: 40 };
	 *      R.eqProps('a', o1, o2); //=> false
	 *      R.eqProps('c', o1, o2); //=> true
	 */
	module.exports = _curry3(function eqProps(prop, obj1, obj2) {
	  return equals(obj1[prop], obj2[prop]);
	});


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Creates a new object by recursively evolving a shallow copy of `object`,
	 * according to the `transformation` functions. All non-primitive properties
	 * are copied by reference.
	 *
	 * A `transformation` function will not be invoked if its corresponding key
	 * does not exist in the evolved object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Object
	 * @sig {k: (v -> v)} -> {k: v} -> {k: v}
	 * @param {Object} transformations The object specifying transformation functions to apply
	 *        to the object.
	 * @param {Object} object The object to be transformed.
	 * @return {Object} The transformed object.
	 * @example
	 *
	 *      var tomato  = {firstName: '  Tomato ', data: {elapsed: 100, remaining: 1400}, id:123};
	 *      var transformations = {
	 *        firstName: R.trim,
	 *        lastName: R.trim, // Will not get invoked.
	 *        data: {elapsed: R.add(1), remaining: R.add(-1)}
	 *      };
	 *      R.evolve(transformations, tomato); //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}, id:123}
	 */
	module.exports = _curry2(function evolve(transformations, object) {
	  var result = {};
	  var transformation, key, type;
	  for (key in object) {
	    transformation = transformations[key];
	    type = typeof transformation;
	    result[key] = type === 'function'                 ? transformation(object[key])
	                : transformation && type === 'object' ? evolve(transformation, object[key])
	                                                      : object[key];
	  }
	  return result;
	});


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xfind = __webpack_require__(156);
	
	
	/**
	 * Returns the first element of the list which matches the predicate, or
	 * `undefined` if no element matches.
	 *
	 * Dispatches to the `find` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> a | undefined
	 * @param {Function} fn The predicate function used to determine if the element is the
	 *        desired one.
	 * @param {Array} list The array to consider.
	 * @return {Object} The element found, or `undefined`.
	 * @see R.transduce
	 * @example
	 *
	 *      var xs = [{a: 1}, {a: 2}, {a: 3}];
	 *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
	 *      R.find(R.propEq('a', 4))(xs); //=> undefined
	 */
	module.exports = _curry2(_dispatchable(['find'], _xfind, function find(fn, list) {
	  var idx = 0;
	  var len = list.length;
	  while (idx < len) {
	    if (fn(list[idx])) {
	      return list[idx];
	    }
	    idx += 1;
	  }
	}));


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _reduced = __webpack_require__(26);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XFind(f, xf) {
	    this.xf = xf;
	    this.f = f;
	    this.found = false;
	  }
	  XFind.prototype['@@transducer/init'] = _xfBase.init;
	  XFind.prototype['@@transducer/result'] = function(result) {
	    if (!this.found) {
	      result = this.xf['@@transducer/step'](result, void 0);
	    }
	    return this.xf['@@transducer/result'](result);
	  };
	  XFind.prototype['@@transducer/step'] = function(result, input) {
	    if (this.f(input)) {
	      this.found = true;
	      result = _reduced(this.xf['@@transducer/step'](result, input));
	    }
	    return result;
	  };
	
	  return _curry2(function _xfind(f, xf) { return new XFind(f, xf); });
	}());


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xfindIndex = __webpack_require__(158);
	
	
	/**
	 * Returns the index of the first element of the list which matches the
	 * predicate, or `-1` if no element matches.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.1
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> Number
	 * @param {Function} fn The predicate function used to determine if the element is the
	 * desired one.
	 * @param {Array} list The array to consider.
	 * @return {Number} The index of the element found, or `-1`.
	 * @see R.transduce
	 * @example
	 *
	 *      var xs = [{a: 1}, {a: 2}, {a: 3}];
	 *      R.findIndex(R.propEq('a', 2))(xs); //=> 1
	 *      R.findIndex(R.propEq('a', 4))(xs); //=> -1
	 */
	module.exports = _curry2(_dispatchable([], _xfindIndex, function findIndex(fn, list) {
	  var idx = 0;
	  var len = list.length;
	  while (idx < len) {
	    if (fn(list[idx])) {
	      return idx;
	    }
	    idx += 1;
	  }
	  return -1;
	}));


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _reduced = __webpack_require__(26);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XFindIndex(f, xf) {
	    this.xf = xf;
	    this.f = f;
	    this.idx = -1;
	    this.found = false;
	  }
	  XFindIndex.prototype['@@transducer/init'] = _xfBase.init;
	  XFindIndex.prototype['@@transducer/result'] = function(result) {
	    if (!this.found) {
	      result = this.xf['@@transducer/step'](result, -1);
	    }
	    return this.xf['@@transducer/result'](result);
	  };
	  XFindIndex.prototype['@@transducer/step'] = function(result, input) {
	    this.idx += 1;
	    if (this.f(input)) {
	      this.found = true;
	      result = _reduced(this.xf['@@transducer/step'](result, this.idx));
	    }
	    return result;
	  };
	
	  return _curry2(function _xfindIndex(f, xf) { return new XFindIndex(f, xf); });
	}());


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xfindLast = __webpack_require__(160);
	
	
	/**
	 * Returns the last element of the list which matches the predicate, or
	 * `undefined` if no element matches.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.1
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> a | undefined
	 * @param {Function} fn The predicate function used to determine if the element is the
	 * desired one.
	 * @param {Array} list The array to consider.
	 * @return {Object} The element found, or `undefined`.
	 * @see R.transduce
	 * @example
	 *
	 *      var xs = [{a: 1, b: 0}, {a:1, b: 1}];
	 *      R.findLast(R.propEq('a', 1))(xs); //=> {a: 1, b: 1}
	 *      R.findLast(R.propEq('a', 4))(xs); //=> undefined
	 */
	module.exports = _curry2(_dispatchable([], _xfindLast, function findLast(fn, list) {
	  var idx = list.length - 1;
	  while (idx >= 0) {
	    if (fn(list[idx])) {
	      return list[idx];
	    }
	    idx -= 1;
	  }
	}));


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XFindLast(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }
	  XFindLast.prototype['@@transducer/init'] = _xfBase.init;
	  XFindLast.prototype['@@transducer/result'] = function(result) {
	    return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.last));
	  };
	  XFindLast.prototype['@@transducer/step'] = function(result, input) {
	    if (this.f(input)) {
	      this.last = input;
	    }
	    return result;
	  };
	
	  return _curry2(function _xfindLast(f, xf) { return new XFindLast(f, xf); });
	}());


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xfindLastIndex = __webpack_require__(162);
	
	
	/**
	 * Returns the index of the last element of the list which matches the
	 * predicate, or `-1` if no element matches.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.1
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> Number
	 * @param {Function} fn The predicate function used to determine if the element is the
	 * desired one.
	 * @param {Array} list The array to consider.
	 * @return {Number} The index of the element found, or `-1`.
	 * @see R.transduce
	 * @example
	 *
	 *      var xs = [{a: 1, b: 0}, {a:1, b: 1}];
	 *      R.findLastIndex(R.propEq('a', 1))(xs); //=> 1
	 *      R.findLastIndex(R.propEq('a', 4))(xs); //=> -1
	 */
	module.exports = _curry2(_dispatchable([], _xfindLastIndex, function findLastIndex(fn, list) {
	  var idx = list.length - 1;
	  while (idx >= 0) {
	    if (fn(list[idx])) {
	      return idx;
	    }
	    idx -= 1;
	  }
	  return -1;
	}));


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XFindLastIndex(f, xf) {
	    this.xf = xf;
	    this.f = f;
	    this.idx = -1;
	    this.lastIdx = -1;
	  }
	  XFindLastIndex.prototype['@@transducer/init'] = _xfBase.init;
	  XFindLastIndex.prototype['@@transducer/result'] = function(result) {
	    return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.lastIdx));
	  };
	  XFindLastIndex.prototype['@@transducer/step'] = function(result, input) {
	    this.idx += 1;
	    if (this.f(input)) {
	      this.lastIdx = this.idx;
	    }
	    return result;
	  };
	
	  return _curry2(function _xfindLastIndex(f, xf) { return new XFindLastIndex(f, xf); });
	}());


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _makeFlat = __webpack_require__(70);
	
	
	/**
	 * Returns a new list by pulling every item out of it (and all its sub-arrays)
	 * and putting them in a new array, depth-first.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [b]
	 * @param {Array} list The array to consider.
	 * @return {Array} The flattened list.
	 * @see R.unnest
	 * @example
	 *
	 *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
	 *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	 */
	module.exports = _curry1(_makeFlat(true));


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var curry = __webpack_require__(68);
	
	
	/**
	 * Returns a new function much like the supplied one, except that the first two
	 * arguments' order is reversed.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (a -> b -> c -> ... -> z) -> (b -> a -> c -> ... -> z)
	 * @param {Function} fn The function to invoke with its first two parameters reversed.
	 * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
	 * @example
	 *
	 *      var mergeThree = (a, b, c) => [].concat(a, b, c);
	 *
	 *      mergeThree(1, 2, 3); //=> [1, 2, 3]
	 *
	 *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
	 * @symb R.flip(f)(a, b, c) = f(b, a, c)
	 */
	module.exports = _curry1(function flip(fn) {
	  return curry(function(a, b) {
	    var args = Array.prototype.slice.call(arguments, 0);
	    args[0] = b;
	    args[1] = a;
	    return fn.apply(this, args);
	  });
	});


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

	var _checkForMethod = __webpack_require__(86);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Iterate over an input `list`, calling a provided function `fn` for each
	 * element in the list.
	 *
	 * `fn` receives one argument: *(value)*.
	 *
	 * Note: `R.forEach` does not skip deleted or unassigned indices (sparse
	 * arrays), unlike the native `Array.prototype.forEach` method. For more
	 * details on this behavior, see:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
	 *
	 * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns
	 * the original array. In some libraries this function is named `each`.
	 *
	 * Dispatches to the `forEach` method of the second argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.1
	 * @category List
	 * @sig (a -> *) -> [a] -> [a]
	 * @param {Function} fn The function to invoke. Receives one argument, `value`.
	 * @param {Array} list The list to iterate over.
	 * @return {Array} The original list.
	 * @see R.addIndex
	 * @example
	 *
	 *      var printXPlusFive = x => console.log(x + 5);
	 *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
	 *      // logs 6
	 *      // logs 7
	 *      // logs 8
	 * @symb R.forEach(f, [a, b, c]) = [a, b, c]
	 */
	module.exports = _curry2(_checkForMethod('forEach', function forEach(fn, list) {
	  var len = list.length;
	  var idx = 0;
	  while (idx < len) {
	    fn(list[idx]);
	    idx += 1;
	  }
	  return list;
	}));


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var keys = __webpack_require__(39);
	
	
	/**
	 * Iterate over an input `object`, calling a provided function `fn` for each
	 * key and value in the object.
	 *
	 * `fn` receives three argument: *(value, key, obj)*.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.23.0
	 * @category Object
	 * @sig ((a, String, StrMap a) -> Any) -> StrMap a -> StrMap a
	 * @param {Function} fn The function to invoke. Receives three argument, `value`, `key`, `obj`.
	 * @param {Object} obj The object to iterate over.
	 * @return {Object} The original object.
	 * @example
	 *
	 *      var printKeyConcatValue = (value, key) => console.log(key + ':' + value);
	 *      R.forEachObjIndexed(printKeyConcatValue, {x: 1, y: 2}); //=> {x: 1, y: 2}
	 *      // logs x:1
	 *      // logs y:2
	 * @symb R.forEachObjIndexed(f, {x: a, y: b}) = {x: a, y: b}
	 */
	module.exports = _curry2(function forEachObjIndexed(fn, obj) {
	  var keyList = keys(obj);
	  var idx = 0;
	  while (idx < keyList.length) {
	    var key = keyList[idx];
	    fn(obj[key], key, obj);
	    idx += 1;
	  }
	  return obj;
	});


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Creates a new object from a list key-value pairs. If a key appears in
	 * multiple pairs, the rightmost pair is included in the object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category List
	 * @sig [[k,v]] -> {k: v}
	 * @param {Array} pairs An array of two-element arrays that will be the keys and values of the output object.
	 * @return {Object} The object made by pairing up `keys` and `values`.
	 * @see R.toPairs, R.pair
	 * @example
	 *
	 *      R.fromPairs([['a', 1], ['b', 2], ['c', 3]]); //=> {a: 1, b: 2, c: 3}
	 */
	module.exports = _curry1(function fromPairs(pairs) {
	  var result = {};
	  var idx = 0;
	  while (idx < pairs.length) {
	    result[pairs[idx][0]] = pairs[idx][1];
	    idx += 1;
	  }
	  return result;
	});


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

	var _checkForMethod = __webpack_require__(86);
	var _curry2 = __webpack_require__(13);
	var reduceBy = __webpack_require__(117);
	
	/**
	 * Splits a list into sub-lists stored in an object, based on the result of
	 * calling a String-returning function on each element, and grouping the
	 * results according to values returned.
	 *
	 * Dispatches to the `groupBy` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig (a -> String) -> [a] -> {String: [a]}
	 * @param {Function} fn Function :: a -> String
	 * @param {Array} list The array to group
	 * @return {Object} An object with the output of `fn` for keys, mapped to arrays of elements
	 *         that produced that key when passed to `fn`.
	 * @see R.transduce
	 * @example
	 *
	 *      var byGrade = R.groupBy(function(student) {
	 *        var score = student.score;
	 *        return score < 65 ? 'F' :
	 *               score < 70 ? 'D' :
	 *               score < 80 ? 'C' :
	 *               score < 90 ? 'B' : 'A';
	 *      });
	 *      var students = [{name: 'Abby', score: 84},
	 *                      {name: 'Eddy', score: 58},
	 *                      // ...
	 *                      {name: 'Jack', score: 69}];
	 *      byGrade(students);
	 *      // {
	 *      //   'A': [{name: 'Dianne', score: 99}],
	 *      //   'B': [{name: 'Abby', score: 84}]
	 *      //   // ...,
	 *      //   'F': [{name: 'Eddy', score: 58}]
	 *      // }
	 */
	module.exports = _curry2(_checkForMethod('groupBy', reduceBy(function(acc, item) {
	  if (acc == null) {
	    acc = [];
	  }
	  acc.push(item);
	  return acc;
	}, null)));


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	/**
	 * Takes a list and returns a list of lists where each sublist's elements are
	 * all satisfied pairwise comparison according to the provided function.
	 * Only adjacent elements are passed to the comparison function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.21.0
	 * @category List
	 * @sig ((a, a) → Boolean) → [a] → [[a]]
	 * @param {Function} fn Function for determining whether two given (adjacent)
	 *        elements should be in the same group
	 * @param {Array} list The array to group. Also accepts a string, which will be
	 *        treated as a list of characters.
	 * @return {List} A list that contains sublists of elements,
	 *         whose concatenations are equal to the original list.
	 * @example
	 *
	 * R.groupWith(R.equals, [0, 1, 1, 2, 3, 5, 8, 13, 21])
	 * //=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]
	 *
	 * R.groupWith((a, b) => a + 1 === b, [0, 1, 1, 2, 3, 5, 8, 13, 21])
	 * //=> [[0, 1], [1, 2, 3], [5], [8], [13], [21]]
	 *
	 * R.groupWith((a, b) => a % 2 === b % 2, [0, 1, 1, 2, 3, 5, 8, 13, 21])
	 * //=> [[0], [1, 1], [2], [3, 5], [8], [13, 21]]
	 *
	 * R.groupWith(R.eqBy(isVowel), 'aestiou')
	 * //=> ['ae', 'st', 'iou']
	 */
	module.exports = _curry2(function(fn, list) {
	  var res = [];
	  var idx = 0;
	  var len = list.length;
	  while (idx < len) {
	    var nextidx = idx + 1;
	    while (nextidx < len && fn(list[nextidx - 1], list[nextidx])) {
	      nextidx += 1;
	    }
	    res.push(list.slice(idx, nextidx));
	    idx = nextidx;
	  }
	  return res;
	});


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns `true` if the first argument is greater than the second; `false`
	 * otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig Ord a => a -> a -> Boolean
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 * @see R.lt
	 * @example
	 *
	 *      R.gt(2, 1); //=> true
	 *      R.gt(2, 2); //=> false
	 *      R.gt(2, 3); //=> false
	 *      R.gt('a', 'z'); //=> false
	 *      R.gt('z', 'a'); //=> true
	 */
	module.exports = _curry2(function gt(a, b) { return a > b; });


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns `true` if the first argument is greater than or equal to the second;
	 * `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig Ord a => a -> a -> Boolean
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Boolean}
	 * @see R.lte
	 * @example
	 *
	 *      R.gte(2, 1); //=> true
	 *      R.gte(2, 2); //=> true
	 *      R.gte(2, 3); //=> false
	 *      R.gte('a', 'z'); //=> false
	 *      R.gte('z', 'a'); //=> true
	 */
	module.exports = _curry2(function gte(a, b) { return a >= b; });


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _has = __webpack_require__(40);
	
	
	/**
	 * Returns whether or not an object has an own property with the specified name
	 *
	 * @func
	 * @memberOf R
	 * @since v0.7.0
	 * @category Object
	 * @sig s -> {s: x} -> Boolean
	 * @param {String} prop The name of the property to check for.
	 * @param {Object} obj The object to query.
	 * @return {Boolean} Whether the property exists.
	 * @example
	 *
	 *      var hasName = R.has('name');
	 *      hasName({name: 'alice'});   //=> true
	 *      hasName({name: 'bob'});     //=> true
	 *      hasName({});                //=> false
	 *
	 *      var point = {x: 0, y: 0};
	 *      var pointHas = R.has(R.__, point);
	 *      pointHas('x');  //=> true
	 *      pointHas('y');  //=> true
	 *      pointHas('z');  //=> false
	 */
	module.exports = _curry2(_has);


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns whether or not an object or its prototype chain has a property with
	 * the specified name
	 *
	 * @func
	 * @memberOf R
	 * @since v0.7.0
	 * @category Object
	 * @sig s -> {s: x} -> Boolean
	 * @param {String} prop The name of the property to check for.
	 * @param {Object} obj The object to query.
	 * @return {Boolean} Whether the property exists.
	 * @example
	 *
	 *      function Rectangle(width, height) {
	 *        this.width = width;
	 *        this.height = height;
	 *      }
	 *      Rectangle.prototype.area = function() {
	 *        return this.width * this.height;
	 *      };
	 *
	 *      var square = new Rectangle(2, 2);
	 *      R.hasIn('width', square);  //=> true
	 *      R.hasIn('area', square);  //=> true
	 */
	module.exports = _curry2(function hasIn(prop, obj) {
	  return prop in obj;
	});


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

	var nth = __webpack_require__(144);
	
	
	/**
	 * Returns the first element of the given list or string. In some libraries
	 * this function is named `first`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> a | Undefined
	 * @sig String -> String
	 * @param {Array|String} list
	 * @return {*}
	 * @see R.tail, R.init, R.last
	 * @example
	 *
	 *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
	 *      R.head([]); //=> undefined
	 *
	 *      R.head('abc'); //=> 'a'
	 *      R.head(''); //=> ''
	 */
	module.exports = nth(0);


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _identity = __webpack_require__(176);
	
	
	/**
	 * A function that does nothing but return the parameter supplied to it. Good
	 * as a default or placeholder function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig a -> a
	 * @param {*} x The value to return.
	 * @return {*} The input value, `x`.
	 * @example
	 *
	 *      R.identity(1); //=> 1
	 *
	 *      var obj = {};
	 *      R.identity(obj) === obj; //=> true
	 * @symb R.identity(a) = a
	 */
	module.exports = _curry1(_identity);


/***/ }),
/* 176 */
/***/ (function(module, exports) {

	module.exports = function _identity(x) { return x; };


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var curryN = __webpack_require__(16);
	
	
	/**
	 * Creates a function that will process either the `onTrue` or the `onFalse`
	 * function depending upon the result of the `condition` predicate.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Logic
	 * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
	 * @param {Function} condition A predicate function
	 * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
	 * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
	 * @return {Function} A new unary function that will process either the `onTrue` or the `onFalse`
	 *                    function depending upon the result of the `condition` predicate.
	 * @see R.unless, R.when
	 * @example
	 *
	 *      var incCount = R.ifElse(
	 *        R.has('count'),
	 *        R.over(R.lensProp('count'), R.inc),
	 *        R.assoc('count', 1)
	 *      );
	 *      incCount({});           //=> { count: 1 }
	 *      incCount({ count: 1 }); //=> { count: 2 }
	 */
	module.exports = _curry3(function ifElse(condition, onTrue, onFalse) {
	  return curryN(Math.max(condition.length, onTrue.length, onFalse.length),
	    function _ifElse() {
	      return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
	    }
	  );
	});


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

	var add = __webpack_require__(12);
	
	
	/**
	 * Increments its argument.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Math
	 * @sig Number -> Number
	 * @param {Number} n
	 * @return {Number} n + 1
	 * @see R.dec
	 * @example
	 *
	 *      R.inc(42); //=> 43
	 */
	module.exports = add(1);


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

	var reduceBy = __webpack_require__(117);
	
	
	/**
	 * Given a function that generates a key, turns a list of objects into an
	 * object indexing the objects by the given key. Note that if multiple
	 * objects generate the same value for the indexing key only the last value
	 * will be included in the generated object.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category List
	 * @sig (a -> String) -> [{k: v}] -> {k: {k: v}}
	 * @param {Function} fn Function :: a -> String
	 * @param {Array} array The array of objects to index
	 * @return {Object} An object indexing each array element by the given property.
	 * @example
	 *
	 *      var list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
	 *      R.indexBy(R.prop('id'), list);
	 *      //=> {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}}
	 */
	module.exports = reduceBy(function(acc, elem) { return elem; }, null);


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _indexOf = __webpack_require__(97);
	var _isArray = __webpack_require__(23);
	
	
	/**
	 * Returns the position of the first occurrence of an item in an array, or -1
	 * if the item is not included in the array. [`R.equals`](#equals) is used to
	 * determine equality.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig a -> [a] -> Number
	 * @param {*} target The item to find.
	 * @param {Array} xs The array to search in.
	 * @return {Number} the index of the target, or -1 if the target is not found.
	 * @see R.lastIndexOf
	 * @example
	 *
	 *      R.indexOf(3, [1,2,3,4]); //=> 2
	 *      R.indexOf(10, [1,2,3,4]); //=> -1
	 */
	module.exports = _curry2(function indexOf(target, xs) {
	  return typeof xs.indexOf === 'function' && !_isArray(xs) ?
	    xs.indexOf(target) :
	    _indexOf(xs, target, 0);
	});


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

	var slice = __webpack_require__(87);
	
	
	/**
	 * Returns all but the last element of the given list or string.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category List
	 * @sig [a] -> [a]
	 * @sig String -> String
	 * @param {*} list
	 * @return {*}
	 * @see R.last, R.head, R.tail
	 * @example
	 *
	 *      R.init([1, 2, 3]);  //=> [1, 2]
	 *      R.init([1, 2]);     //=> [1]
	 *      R.init([1]);        //=> []
	 *      R.init([]);         //=> []
	 *
	 *      R.init('abc');  //=> 'ab'
	 *      R.init('ab');   //=> 'a'
	 *      R.init('a');    //=> ''
	 *      R.init('');     //=> ''
	 */
	module.exports = slice(0, -1);


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

	var _containsWith = __webpack_require__(124);
	var _curry3 = __webpack_require__(20);
	var _filter = __webpack_require__(108);
	
	
	/**
	 * Takes a predicate `pred`, a list `xs`, and a list `ys`, and returns a list
	 * `xs'` comprising each of the elements of `xs` which is equal to one or more
	 * elements of `ys` according to `pred`.
	 *
	 * `pred` must be a binary function expecting an element from each list.
	 *
	 * `xs`, `ys`, and `xs'` are treated as sets, semantically, so ordering should
	 * not be significant, but since `xs'` is ordered the implementation guarantees
	 * that its values are in the same order as they appear in `xs`. Duplicates are
	 * not removed, so `xs'` may contain duplicates if `xs` contains duplicates.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category Relation
	 * @sig (a -> b -> Boolean) -> [a] -> [b] -> [a]
	 * @param {Function} pred
	 * @param {Array} xs
	 * @param {Array} ys
	 * @return {Array}
	 * @see R.intersection
	 * @example
	 *
	 *      R.innerJoin(
	 *        (record, id) => record.id === id,
	 *        [{id: 824, name: 'Richie Furay'},
	 *         {id: 956, name: 'Dewey Martin'},
	 *         {id: 313, name: 'Bruce Palmer'},
	 *         {id: 456, name: 'Stephen Stills'},
	 *         {id: 177, name: 'Neil Young'}],
	 *        [177, 456, 999]
	 *      );
	 *      //=> [{id: 456, name: 'Stephen Stills'}, {id: 177, name: 'Neil Young'}]
	 */
	module.exports = _curry3(function innerJoin(pred, xs, ys) {
	  return _filter(function(x) { return _containsWith(pred, x, ys); }, xs);
	});


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Inserts the supplied element into the list, at the specified `index`. _Note that
	
	 * this is not destructive_: it returns a copy of the list with the changes.
	 * <small>No lists have been harmed in the application of this function.</small>
	 *
	 * @func
	 * @memberOf R
	 * @since v0.2.2
	 * @category List
	 * @sig Number -> a -> [a] -> [a]
	 * @param {Number} index The position to insert the element
	 * @param {*} elt The element to insert into the Array
	 * @param {Array} list The list to insert into
	 * @return {Array} A new Array with `elt` inserted at `index`.
	 * @example
	 *
	 *      R.insert(2, 'x', [1,2,3,4]); //=> [1,2,'x',3,4]
	 */
	module.exports = _curry3(function insert(idx, elt, list) {
	  idx = idx < list.length && idx >= 0 ? idx : list.length;
	  var result = Array.prototype.slice.call(list, 0);
	  result.splice(idx, 0, elt);
	  return result;
	});


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Inserts the sub-list into the list, at the specified `index`. _Note that this is not
	 * destructive_: it returns a copy of the list with the changes.
	 * <small>No lists have been harmed in the application of this function.</small>
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category List
	 * @sig Number -> [a] -> [a] -> [a]
	 * @param {Number} index The position to insert the sub-list
	 * @param {Array} elts The sub-list to insert into the Array
	 * @param {Array} list The list to insert the sub-list into
	 * @return {Array} A new Array with `elts` inserted starting at `index`.
	 * @example
	 *
	 *      R.insertAll(2, ['x','y','z'], [1,2,3,4]); //=> [1,2,'x','y','z',3,4]
	 */
	module.exports = _curry3(function insertAll(idx, elts, list) {
	  idx = idx < list.length && idx >= 0 ? idx : list.length;
	  return [].concat(Array.prototype.slice.call(list, 0, idx),
	                   elts,
	                   Array.prototype.slice.call(list, idx));
	});


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

	var _contains = __webpack_require__(96);
	var _curry2 = __webpack_require__(13);
	var _filter = __webpack_require__(108);
	var flip = __webpack_require__(164);
	var uniq = __webpack_require__(186);
	
	
	/**
	 * Combines two lists into a set (i.e. no duplicates) composed of those
	 * elements common to both lists.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig [*] -> [*] -> [*]
	 * @param {Array} list1 The first list.
	 * @param {Array} list2 The second list.
	 * @return {Array} The list of elements found in both `list1` and `list2`.
	 * @see R.innerJoin
	 * @example
	 *
	 *      R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]
	 */
	module.exports = _curry2(function intersection(list1, list2) {
	  var lookupList, filteredList;
	  if (list1.length > list2.length) {
	    lookupList = list1;
	    filteredList = list2;
	  } else {
	    lookupList = list2;
	    filteredList = list1;
	  }
	  return uniq(_filter(flip(_contains)(lookupList), filteredList));
	});


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(175);
	var uniqBy = __webpack_require__(187);
	
	
	/**
	 * Returns a new list containing only one copy of each element in the original
	 * list. [`R.equals`](#equals) is used to determine equality.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [a]
	 * @param {Array} list The array to consider.
	 * @return {Array} The list of unique items.
	 * @example
	 *
	 *      R.uniq([1, 1, 2, 1]); //=> [1, 2]
	 *      R.uniq([1, '1']);     //=> [1, '1']
	 *      R.uniq([[42], [42]]); //=> [[42]]
	 */
	module.exports = uniqBy(identity);


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

	var _Set = __webpack_require__(188);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a new list containing only one copy of each element in the original
	 * list, based upon the value returned by applying the supplied function to
	 * each list element. Prefers the first item if the supplied function produces
	 * the same value on two items. [`R.equals`](#equals) is used for comparison.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category List
	 * @sig (a -> b) -> [a] -> [a]
	 * @param {Function} fn A function used to produce a value to use during comparisons.
	 * @param {Array} list The array to consider.
	 * @return {Array} The list of unique items.
	 * @example
	 *
	 *      R.uniqBy(Math.abs, [-1, -5, 2, 10, 1, 2]); //=> [-1, -5, 2, 10]
	 */
	module.exports = _curry2(function uniqBy(fn, list) {
	  var set = new _Set();
	  var result = [];
	  var idx = 0;
	  var appliedItem, item;
	
	  while (idx < list.length) {
	    item = list[idx];
	    appliedItem = fn(item);
	    if (set.add(appliedItem)) {
	      result.push(item);
	    }
	    idx += 1;
	  }
	  return result;
	});


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

	var _contains = __webpack_require__(96);
	
	
	// A simple Set type that honours R.equals semantics
	module.exports = (function() {
	  function _Set() {
	    /* globals Set */
	    this._nativeSet = typeof Set === 'function' ? new Set() : null;
	    this._items = {};
	  }
	
	  // until we figure out why jsdoc chokes on this
	  // @param item The item to add to the Set
	  // @returns {boolean} true if the item did not exist prior, otherwise false
	  //
	  _Set.prototype.add = function(item) {
	    return !hasOrAdd(item, true, this);
	  };
	
	  //
	  // @param item The item to check for existence in the Set
	  // @returns {boolean} true if the item exists in the Set, otherwise false
	  //
	  _Set.prototype.has = function(item) {
	    return hasOrAdd(item, false, this);
	  };
	
	  //
	  // Combines the logic for checking whether an item is a member of the set and
	  // for adding a new item to the set.
	  //
	  // @param item       The item to check or add to the Set instance.
	  // @param shouldAdd  If true, the item will be added to the set if it doesn't
	  //                   already exist.
	  // @param set        The set instance to check or add to.
	  // @return {boolean} true if the item already existed, otherwise false.
	  //
	  function hasOrAdd(item, shouldAdd, set) {
	    var type = typeof item;
	    var prevSize, newSize;
	    switch (type) {
	      case 'string':
	      case 'number':
	        // distinguish between +0 and -0
	        if (item === 0 && 1 / item === -Infinity) {
	          if (set._items['-0']) {
	            return true;
	          } else {
	            if (shouldAdd) {
	              set._items['-0'] = true;
	            }
	            return false;
	          }
	        }
	        // these types can all utilise the native Set
	        if (set._nativeSet !== null) {
	          if (shouldAdd) {
	            prevSize = set._nativeSet.size;
	            set._nativeSet.add(item);
	            newSize = set._nativeSet.size;
	            return newSize === prevSize;
	          } else {
	            return set._nativeSet.has(item);
	          }
	        } else {
	          if (!(type in set._items)) {
	            if (shouldAdd) {
	              set._items[type] = {};
	              set._items[type][item] = true;
	            }
	            return false;
	          } else if (item in set._items[type]) {
	            return true;
	          } else {
	            if (shouldAdd) {
	              set._items[type][item] = true;
	            }
	            return false;
	          }
	        }
	
	      case 'boolean':
	        // set._items['boolean'] holds a two element array
	        // representing [ falseExists, trueExists ]
	        if (type in set._items) {
	          var bIdx = item ? 1 : 0;
	          if (set._items[type][bIdx]) {
	            return true;
	          } else {
	            if (shouldAdd) {
	              set._items[type][bIdx] = true;
	            }
	            return false;
	          }
	        } else {
	          if (shouldAdd) {
	            set._items[type] = item ? [false, true] : [true, false];
	          }
	          return false;
	        }
	
	      case 'function':
	        // compare functions for reference equality
	        if (set._nativeSet !== null) {
	          if (shouldAdd) {
	            prevSize = set._nativeSet.size;
	            set._nativeSet.add(item);
	            newSize = set._nativeSet.size;
	            return newSize === prevSize;
	          } else {
	            return set._nativeSet.has(item);
	          }
	        } else {
	          if (!(type in set._items)) {
	            if (shouldAdd) {
	              set._items[type] = [item];
	            }
	            return false;
	          }
	          if (!_contains(item, set._items[type])) {
	            if (shouldAdd) {
	              set._items[type].push(item);
	            }
	            return false;
	          }
	          return true;
	        }
	
	      case 'undefined':
	        if (set._items[type]) {
	          return true;
	        } else {
	          if (shouldAdd) {
	            set._items[type] = true;
	          }
	          return false;
	        }
	
	      case 'object':
	        if (item === null) {
	          if (!set._items['null']) {
	            if (shouldAdd) {
	              set._items['null'] = true;
	            }
	            return false;
	          }
	          return true;
	        }
	      /* falls through */
	      default:
	        // reduce the search size of heterogeneous sets by creating buckets
	        // for each type.
	        type = Object.prototype.toString.call(item);
	        if (!(type in set._items)) {
	          if (shouldAdd) {
	            set._items[type] = [item];
	          }
	          return false;
	        }
	        // scan through all previously applied items
	        if (!_contains(item, set._items[type])) {
	          if (shouldAdd) {
	            set._items[type].push(item);
	          }
	          return false;
	        }
	        return true;
	    }
	  }
	  return _Set;
	}());


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

	var _containsWith = __webpack_require__(124);
	var _curry3 = __webpack_require__(20);
	var uniqWith = __webpack_require__(190);
	
	
	/**
	 * Combines two lists into a set (i.e. no duplicates) composed of those
	 * elements common to both lists. Duplication is determined according to the
	 * value returned by applying the supplied predicate to two list elements.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig ((a, a) -> Boolean) -> [a] -> [a] -> [a]
	 * @param {Function} pred A predicate function that determines whether
	 *        the two supplied elements are equal.
	 * @param {Array} list1 One list of items to compare
	 * @param {Array} list2 A second list of items to compare
	 * @return {Array} A new list containing those elements common to both lists.
	 * @see R.innerJoin
	 * @deprecated since v0.24.0
	 * @example
	 *
	 *      var buffaloSpringfield = [
	 *        {id: 824, name: 'Richie Furay'},
	 *        {id: 956, name: 'Dewey Martin'},
	 *        {id: 313, name: 'Bruce Palmer'},
	 *        {id: 456, name: 'Stephen Stills'},
	 *        {id: 177, name: 'Neil Young'}
	 *      ];
	 *      var csny = [
	 *        {id: 204, name: 'David Crosby'},
	 *        {id: 456, name: 'Stephen Stills'},
	 *        {id: 539, name: 'Graham Nash'},
	 *        {id: 177, name: 'Neil Young'}
	 *      ];
	 *
	 *      R.intersectionWith(R.eqBy(R.prop('id')), buffaloSpringfield, csny);
	 *      //=> [{id: 456, name: 'Stephen Stills'}, {id: 177, name: 'Neil Young'}]
	 */
	module.exports = _curry3(function intersectionWith(pred, list1, list2) {
	  var lookupList, filteredList;
	  if (list1.length > list2.length) {
	    lookupList = list1;
	    filteredList = list2;
	  } else {
	    lookupList = list2;
	    filteredList = list1;
	  }
	  var results = [];
	  var idx = 0;
	  while (idx < filteredList.length) {
	    if (_containsWith(pred, filteredList[idx], lookupList)) {
	      results[results.length] = filteredList[idx];
	    }
	    idx += 1;
	  }
	  return uniqWith(pred, results);
	});


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

	var _containsWith = __webpack_require__(124);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a new list containing only one copy of each element in the original
	 * list, based upon the value returned by applying the supplied predicate to
	 * two list elements. Prefers the first item if two items compare equal based
	 * on the predicate.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.2.0
	 * @category List
	 * @sig (a, a -> Boolean) -> [a] -> [a]
	 * @param {Function} pred A predicate used to test whether two items are equal.
	 * @param {Array} list The array to consider.
	 * @return {Array} The list of unique items.
	 * @example
	 *
	 *      var strEq = R.eqBy(String);
	 *      R.uniqWith(strEq)([1, '1', 2, 1]); //=> [1, 2]
	 *      R.uniqWith(strEq)([{}, {}]);       //=> [{}]
	 *      R.uniqWith(strEq)([1, '1', 1]);    //=> [1]
	 *      R.uniqWith(strEq)(['1', 1, 1]);    //=> ['1']
	 */
	module.exports = _curry2(function uniqWith(pred, list) {
	  var idx = 0;
	  var len = list.length;
	  var result = [];
	  var item;
	  while (idx < len) {
	    item = list[idx];
	    if (!_containsWith(pred, item, result)) {
	      result[result.length] = item;
	    }
	    idx += 1;
	  }
	  return result;
	});


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

	var _checkForMethod = __webpack_require__(86);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Creates a new list with the separator interposed between elements.
	 *
	 * Dispatches to the `intersperse` method of the second argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category List
	 * @sig a -> [a] -> [a]
	 * @param {*} separator The element to add to the list.
	 * @param {Array} list The list to be interposed.
	 * @return {Array} The new list.
	 * @example
	 *
	 *      R.intersperse('n', ['ba', 'a', 'a']); //=> ['ba', 'n', 'a', 'n', 'a']
	 */
	module.exports = _curry2(_checkForMethod('intersperse', function intersperse(separator, list) {
	  var out = [];
	  var idx = 0;
	  var length = list.length;
	  while (idx < length) {
	    if (idx === length - 1) {
	      out.push(list[idx]);
	    } else {
	      out.push(list[idx], separator);
	    }
	    idx += 1;
	  }
	  return out;
	}));


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

	var _clone = __webpack_require__(76);
	var _curry3 = __webpack_require__(20);
	var _isTransformer = __webpack_require__(24);
	var _reduce = __webpack_require__(33);
	var _stepCat = __webpack_require__(193);
	
	
	/**
	 * Transforms the items of the list with the transducer and appends the
	 * transformed items to the accumulator using an appropriate iterator function
	 * based on the accumulator type.
	 *
	 * The accumulator can be an array, string, object or a transformer. Iterated
	 * items will be appended to arrays and concatenated to strings. Objects will
	 * be merged directly or 2-item arrays will be merged as key, value pairs.
	 *
	 * The accumulator can also be a transformer object that provides a 2-arity
	 * reducing iterator function, step, 0-arity initial value function, init, and
	 * 1-arity result extraction function result. The step function is used as the
	 * iterator function in reduce. The result function is used to convert the
	 * final accumulator into the return type and in most cases is R.identity. The
	 * init function is used to provide the initial accumulator.
	 *
	 * The iteration is performed with [`R.reduce`](#reduce) after initializing the
	 * transducer.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.12.0
	 * @category List
	 * @sig a -> (b -> b) -> [c] -> a
	 * @param {*} acc The initial accumulator value.
	 * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @example
	 *
	 *      var numbers = [1, 2, 3, 4];
	 *      var transducer = R.compose(R.map(R.add(1)), R.take(2));
	 *
	 *      R.into([], transducer, numbers); //=> [2, 3]
	 *
	 *      var intoArray = R.into([]);
	 *      intoArray(transducer, numbers); //=> [2, 3]
	 */
	module.exports = _curry3(function into(acc, xf, list) {
	  return _isTransformer(acc) ?
	    _reduce(xf(acc), acc['@@transducer/init'](), list) :
	    _reduce(xf(_stepCat(acc)), _clone(acc, [], [], false), list);
	});


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

	var _assign = __webpack_require__(194);
	var _identity = __webpack_require__(176);
	var _isArrayLike = __webpack_require__(34);
	var _isTransformer = __webpack_require__(24);
	var objOf = __webpack_require__(196);
	
	
	module.exports = (function() {
	  var _stepCatArray = {
	    '@@transducer/init': Array,
	    '@@transducer/step': function(xs, x) {
	      xs.push(x);
	      return xs;
	    },
	    '@@transducer/result': _identity
	  };
	  var _stepCatString = {
	    '@@transducer/init': String,
	    '@@transducer/step': function(a, b) { return a + b; },
	    '@@transducer/result': _identity
	  };
	  var _stepCatObject = {
	    '@@transducer/init': Object,
	    '@@transducer/step': function(result, input) {
	      return _assign(
	        result,
	        _isArrayLike(input) ? objOf(input[0], input[1]) : input
	      );
	    },
	    '@@transducer/result': _identity
	  };
	
	  return function _stepCat(obj) {
	    if (_isTransformer(obj)) {
	      return obj;
	    }
	    if (_isArrayLike(obj)) {
	      return _stepCatArray;
	    }
	    if (typeof obj === 'string') {
	      return _stepCatString;
	    }
	    if (typeof obj === 'object') {
	      return _stepCatObject;
	    }
	    throw new Error('Cannot create transformer for ' + obj);
	  };
	}());


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

	var _objectAssign = __webpack_require__(195);
	
	module.exports =
	  typeof Object.assign === 'function' ? Object.assign : _objectAssign;


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

	var _has = __webpack_require__(40);
	
	// Based on https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	module.exports = function _objectAssign(target) {
	  if (target == null) {
	    throw new TypeError('Cannot convert undefined or null to object');
	  }
	
	  var output = Object(target);
	  var idx = 1;
	  var length = arguments.length;
	  while (idx < length) {
	    var source = arguments[idx];
	    if (source != null) {
	      for (var nextKey in source) {
	        if (_has(nextKey, source)) {
	          output[nextKey] = source[nextKey];
	        }
	      }
	    }
	    idx += 1;
	  }
	  return output;
	};


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Creates an object containing a single key:value pair.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.18.0
	 * @category Object
	 * @sig String -> a -> {String:a}
	 * @param {String} key
	 * @param {*} val
	 * @return {Object}
	 * @see R.pair
	 * @example
	 *
	 *      var matchPhrases = R.compose(
	 *        R.objOf('must'),
	 *        R.map(R.objOf('match_phrase'))
	 *      );
	 *      matchPhrases(['foo', 'bar', 'baz']); //=> {must: [{match_phrase: 'foo'}, {match_phrase: 'bar'}, {match_phrase: 'baz'}]}
	 */
	module.exports = _curry2(function objOf(key, val) {
	  var obj = {};
	  obj[key] = val;
	  return obj;
	});


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _has = __webpack_require__(40);
	var keys = __webpack_require__(39);
	
	
	/**
	 * Same as [`R.invertObj`](#invertObj), however this accounts for objects with
	 * duplicate values by putting the values into an array.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Object
	 * @sig {s: x} -> {x: [ s, ... ]}
	 * @param {Object} obj The object or array to invert
	 * @return {Object} out A new object with keys in an array.
	 * @see R.invertObj
	 * @example
	 *
	 *      var raceResultsByFirstName = {
	 *        first: 'alice',
	 *        second: 'jake',
	 *        third: 'alice',
	 *      };
	 *      R.invert(raceResultsByFirstName);
	 *      //=> { 'alice': ['first', 'third'], 'jake':['second'] }
	 */
	module.exports = _curry1(function invert(obj) {
	  var props = keys(obj);
	  var len = props.length;
	  var idx = 0;
	  var out = {};
	
	  while (idx < len) {
	    var key = props[idx];
	    var val = obj[key];
	    var list = _has(val, out) ? out[val] : (out[val] = []);
	    list[list.length] = key;
	    idx += 1;
	  }
	  return out;
	});


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var keys = __webpack_require__(39);
	
	
	/**
	 * Returns a new object with the keys of the given object as values, and the
	 * values of the given object, which are coerced to strings, as keys. Note
	 * that the last key found is preferred when handling the same value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Object
	 * @sig {s: x} -> {x: s}
	 * @param {Object} obj The object or array to invert
	 * @return {Object} out A new object
	 * @see R.invert
	 * @example
	 *
	 *      var raceResults = {
	 *        first: 'alice',
	 *        second: 'jake'
	 *      };
	 *      R.invertObj(raceResults);
	 *      //=> { 'alice': 'first', 'jake':'second' }
	 *
	 *      // Alternatively:
	 *      var raceResults = ['alice', 'jake'];
	 *      R.invertObj(raceResults);
	 *      //=> { 'alice': '0', 'jake':'1' }
	 */
	module.exports = _curry1(function invertObj(obj) {
	  var props = keys(obj);
	  var len = props.length;
	  var idx = 0;
	  var out = {};
	
	  while (idx < len) {
	    var key = props[idx];
	    out[obj[key]] = key;
	    idx += 1;
	  }
	  return out;
	});


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _isFunction = __webpack_require__(64);
	var curryN = __webpack_require__(16);
	var toString = __webpack_require__(94);
	
	
	/**
	 * Turns a named method with a specified arity into a function that can be
	 * called directly supplied with arguments and a target object.
	 *
	 * The returned function is curried and accepts `arity + 1` parameters where
	 * the final parameter is the target object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig Number -> String -> (a -> b -> ... -> n -> Object -> *)
	 * @param {Number} arity Number of arguments the returned function should take
	 *        before the target object.
	 * @param {String} method Name of the method to call.
	 * @return {Function} A new curried function.
	 * @see R.construct
	 * @example
	 *
	 *      var sliceFrom = R.invoker(1, 'slice');
	 *      sliceFrom(6, 'abcdefghijklm'); //=> 'ghijklm'
	 *      var sliceFrom6 = R.invoker(2, 'slice')(6);
	 *      sliceFrom6(8, 'abcdefghijklm'); //=> 'gh'
	 * @symb R.invoker(0, 'method')(o) = o['method']()
	 * @symb R.invoker(1, 'method')(a, o) = o['method'](a)
	 * @symb R.invoker(2, 'method')(a, b, o) = o['method'](a, b)
	 */
	module.exports = _curry2(function invoker(arity, method) {
	  return curryN(arity + 1, function() {
	    var target = arguments[arity];
	    if (target != null && _isFunction(target[method])) {
	      return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
	    }
	    throw new TypeError(toString(target) + ' does not have a method named "' + method + '"');
	  });
	});


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * See if an object (`val`) is an instance of the supplied constructor. This
	 * function will check up the inheritance chain, if any.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category Type
	 * @sig (* -> {*}) -> a -> Boolean
	 * @param {Object} ctor A constructor
	 * @param {*} val The value to test
	 * @return {Boolean}
	 * @example
	 *
	 *      R.is(Object, {}); //=> true
	 *      R.is(Number, 1); //=> true
	 *      R.is(Object, 1); //=> false
	 *      R.is(String, 's'); //=> true
	 *      R.is(String, new String('')); //=> true
	 *      R.is(Object, new String('')); //=> true
	 *      R.is(Object, 's'); //=> false
	 *      R.is(Number, {}); //=> false
	 */
	module.exports = _curry2(function is(Ctor, val) {
	  return val != null && val.constructor === Ctor || val instanceof Ctor;
	});


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var empty = __webpack_require__(149);
	var equals = __webpack_require__(98);
	
	
	/**
	 * Returns `true` if the given value is its type's empty value; `false`
	 * otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Logic
	 * @sig a -> Boolean
	 * @param {*} x
	 * @return {Boolean}
	 * @see R.empty
	 * @example
	 *
	 *      R.isEmpty([1, 2, 3]);   //=> false
	 *      R.isEmpty([]);          //=> true
	 *      R.isEmpty('');          //=> true
	 *      R.isEmpty(null);        //=> false
	 *      R.isEmpty({});          //=> true
	 *      R.isEmpty({length: 0}); //=> false
	 */
	module.exports = _curry1(function isEmpty(x) {
	  return x != null && equals(x, empty(x));
	});


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

	var invoker = __webpack_require__(199);
	
	
	/**
	 * Returns a string made by inserting the `separator` between each element and
	 * concatenating all the elements into a single string.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig String -> [a] -> String
	 * @param {Number|String} separator The string used to separate the elements.
	 * @param {Array} xs The elements to join into a string.
	 * @return {String} str The string made by concatenating `xs` with `separator`.
	 * @see R.split
	 * @example
	 *
	 *      var spacer = R.join(' ');
	 *      spacer(['a', 2, 3.4]);   //=> 'a 2 3.4'
	 *      R.join('|', [1, 2, 3]);    //=> '1|2|3'
	 */
	module.exports = invoker(1, 'join');


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var converge = __webpack_require__(115);
	
	
	/**
	 * juxt applies a list of functions to a list of values.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category Function
	 * @sig [(a, b, ..., m) -> n] -> ((a, b, ..., m) -> [n])
	 * @param {Array} fns An array of functions
	 * @return {Function} A function that returns a list of values after applying each of the original `fns` to its parameters.
	 * @see R.applySpec
	 * @example
	 *
	 *      var getRange = R.juxt([Math.min, Math.max]);
	 *      getRange(3, 4, 9, -3); //=> [-3, 9]
	 * @symb R.juxt([f, g, h])(a, b) = [f(a, b), g(a, b), h(a, b)]
	 */
	module.exports = _curry1(function juxt(fns) {
	  return converge(function() { return Array.prototype.slice.call(arguments, 0); }, fns);
	});


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Returns a list containing the names of all the properties of the supplied
	 * object, including prototype properties.
	 * Note that the order of the output array is not guaranteed to be consistent
	 * across different JS platforms.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.2.0
	 * @category Object
	 * @sig {k: v} -> [k]
	 * @param {Object} obj The object to extract properties from
	 * @return {Array} An array of the object's own and prototype properties.
	 * @see R.keys, R.valuesIn
	 * @example
	 *
	 *      var F = function() { this.x = 'X'; };
	 *      F.prototype.y = 'Y';
	 *      var f = new F();
	 *      R.keysIn(f); //=> ['x', 'y']
	 */
	module.exports = _curry1(function keysIn(obj) {
	  var prop;
	  var ks = [];
	  for (prop in obj) {
	    ks[ks.length] = prop;
	  }
	  return ks;
	});


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _isArray = __webpack_require__(23);
	var equals = __webpack_require__(98);
	
	
	/**
	 * Returns the position of the last occurrence of an item in an array, or -1 if
	 * the item is not included in the array. [`R.equals`](#equals) is used to
	 * determine equality.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig a -> [a] -> Number
	 * @param {*} target The item to find.
	 * @param {Array} xs The array to search in.
	 * @return {Number} the index of the target, or -1 if the target is not found.
	 * @see R.indexOf
	 * @example
	 *
	 *      R.lastIndexOf(3, [-1,3,3,0,1,2,3,4]); //=> 6
	 *      R.lastIndexOf(10, [1,2,3,4]); //=> -1
	 */
	module.exports = _curry2(function lastIndexOf(target, xs) {
	  if (typeof xs.lastIndexOf === 'function' && !_isArray(xs)) {
	    return xs.lastIndexOf(target);
	  } else {
	    var idx = xs.length - 1;
	    while (idx >= 0) {
	      if (equals(xs[idx], target)) {
	        return idx;
	      }
	      idx -= 1;
	    }
	    return -1;
	  }
	});


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _isNumber = __webpack_require__(207);
	
	
	/**
	 * Returns the number of elements in the array by returning `list.length`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category List
	 * @sig [a] -> Number
	 * @param {Array} list The array to inspect.
	 * @return {Number} The length of the array.
	 * @example
	 *
	 *      R.length([]); //=> 0
	 *      R.length([1, 2, 3]); //=> 3
	 */
	module.exports = _curry1(function length(list) {
	  return list != null && _isNumber(list.length) ? list.length : NaN;
	});


/***/ }),
/* 207 */
/***/ (function(module, exports) {

	module.exports = function _isNumber(x) {
	  return Object.prototype.toString.call(x) === '[object Number]';
	};


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var map = __webpack_require__(31);
	
	
	/**
	 * Returns a lens for the given getter and setter functions. The getter "gets"
	 * the value of the focus; the setter "sets" the value of the focus. The setter
	 * should not mutate the data structure.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Object
	 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	 * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
	 * @param {Function} getter
	 * @param {Function} setter
	 * @return {Lens}
	 * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
	 * @example
	 *
	 *      var xLens = R.lens(R.prop('x'), R.assoc('x'));
	 *
	 *      R.view(xLens, {x: 1, y: 2});            //=> 1
	 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
	 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
	 */
	module.exports = _curry2(function lens(getter, setter) {
	  return function(toFunctorFn) {
	    return function(target) {
	      return map(
	        function(focus) {
	          return setter(focus, target);
	        },
	        toFunctorFn(getter(target))
	      );
	    };
	  };
	});


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var lens = __webpack_require__(208);
	var nth = __webpack_require__(144);
	var update = __webpack_require__(128);
	
	
	/**
	 * Returns a lens whose focus is the specified index.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category Object
	 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	 * @sig Number -> Lens s a
	 * @param {Number} n
	 * @return {Lens}
	 * @see R.view, R.set, R.over
	 * @example
	 *
	 *      var headLens = R.lensIndex(0);
	 *
	 *      R.view(headLens, ['a', 'b', 'c']);            //=> 'a'
	 *      R.set(headLens, 'x', ['a', 'b', 'c']);        //=> ['x', 'b', 'c']
	 *      R.over(headLens, R.toUpper, ['a', 'b', 'c']); //=> ['A', 'b', 'c']
	 */
	module.exports = _curry1(function lensIndex(n) {
	  return lens(nth(n), update(n));
	});


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var assocPath = __webpack_require__(58);
	var lens = __webpack_require__(208);
	var path = __webpack_require__(211);
	
	
	/**
	 * Returns a lens whose focus is the specified path.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category Object
	 * @typedefn Idx = String | Int
	 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	 * @sig [Idx] -> Lens s a
	 * @param {Array} path The path to use.
	 * @return {Lens}
	 * @see R.view, R.set, R.over
	 * @example
	 *
	 *      var xHeadYLens = R.lensPath(['x', 0, 'y']);
	 *
	 *      R.view(xHeadYLens, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
	 *      //=> 2
	 *      R.set(xHeadYLens, 1, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
	 *      //=> {x: [{y: 1, z: 3}, {y: 4, z: 5}]}
	 *      R.over(xHeadYLens, R.negate, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
	 *      //=> {x: [{y: -2, z: 3}, {y: 4, z: 5}]}
	 */
	module.exports = _curry1(function lensPath(p) {
	  return lens(path(p), assocPath(p));
	});


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Retrieve the value at a given path.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.2.0
	 * @category Object
	 * @typedefn Idx = String | Int
	 * @sig [Idx] -> {a} -> a | Undefined
	 * @param {Array} path The path to use.
	 * @param {Object} obj The object to retrieve the nested property from.
	 * @return {*} The data at `path`.
	 * @see R.prop
	 * @example
	 *
	 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
	 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
	 */
	module.exports = _curry2(function path(paths, obj) {
	  var val = obj;
	  var idx = 0;
	  while (idx < paths.length) {
	    if (val == null) {
	      return;
	    }
	    val = val[paths[idx]];
	    idx += 1;
	  }
	  return val;
	});


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var assoc = __webpack_require__(57);
	var lens = __webpack_require__(208);
	var prop = __webpack_require__(42);
	
	
	/**
	 * Returns a lens whose focus is the specified property.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category Object
	 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	 * @sig String -> Lens s a
	 * @param {String} k
	 * @return {Lens}
	 * @see R.view, R.set, R.over
	 * @example
	 *
	 *      var xLens = R.lensProp('x');
	 *
	 *      R.view(xLens, {x: 1, y: 2});            //=> 1
	 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
	 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
	 */
	module.exports = _curry1(function lensProp(k) {
	  return lens(prop(k), assoc(k));
	});


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns `true` if the first argument is less than the second; `false`
	 * otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig Ord a => a -> a -> Boolean
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 * @see R.gt
	 * @example
	 *
	 *      R.lt(2, 1); //=> false
	 *      R.lt(2, 2); //=> false
	 *      R.lt(2, 3); //=> true
	 *      R.lt('a', 'z'); //=> true
	 *      R.lt('z', 'a'); //=> false
	 */
	module.exports = _curry2(function lt(a, b) { return a < b; });


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns `true` if the first argument is less than or equal to the second;
	 * `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig Ord a => a -> a -> Boolean
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Boolean}
	 * @see R.gte
	 * @example
	 *
	 *      R.lte(2, 1); //=> false
	 *      R.lte(2, 2); //=> true
	 *      R.lte(2, 3); //=> true
	 *      R.lte('a', 'z'); //=> true
	 *      R.lte('z', 'a'); //=> false
	 */
	module.exports = _curry2(function lte(a, b) { return a <= b; });


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * The `mapAccum` function behaves like a combination of map and reduce; it
	 * applies a function to each element of a list, passing an accumulating
	 * parameter from left to right, and returning a final value of this
	 * accumulator together with the new list.
	 *
	 * The iterator function receives two arguments, *acc* and *value*, and should
	 * return a tuple *[acc, value]*.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category List
	 * @sig (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y])
	 * @param {Function} fn The function to be called on every element of the input `list`.
	 * @param {*} acc The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @see R.addIndex, R.mapAccumRight
	 * @example
	 *
	 *      var digits = ['1', '2', '3', '4'];
	 *      var appender = (a, b) => [a + b, a + b];
	 *
	 *      R.mapAccum(appender, 0, digits); //=> ['01234', ['01', '012', '0123', '01234']]
	 * @symb R.mapAccum(f, a, [b, c, d]) = [
	 *   f(f(f(a, b)[0], c)[0], d)[0],
	 *   [
	 *     f(a, b)[1],
	 *     f(f(a, b)[0], c)[1],
	 *     f(f(f(a, b)[0], c)[0], d)[1]
	 *   ]
	 * ]
	 */
	module.exports = _curry3(function mapAccum(fn, acc, list) {
	  var idx = 0;
	  var len = list.length;
	  var result = [];
	  var tuple = [acc];
	  while (idx < len) {
	    tuple = fn(tuple[0], list[idx]);
	    result[idx] = tuple[1];
	    idx += 1;
	  }
	  return [tuple[0], result];
	});


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * The `mapAccumRight` function behaves like a combination of map and reduce; it
	 * applies a function to each element of a list, passing an accumulating
	 * parameter from right to left, and returning a final value of this
	 * accumulator together with the new list.
	 *
	 * Similar to [`mapAccum`](#mapAccum), except moves through the input list from
	 * the right to the left.
	 *
	 * The iterator function receives two arguments, *value* and *acc*, and should
	 * return a tuple *[value, acc]*.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category List
	 * @sig (x-> acc -> (y, acc)) -> acc -> [x] -> ([y], acc)
	 * @param {Function} fn The function to be called on every element of the input `list`.
	 * @param {*} acc The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @see R.addIndex, R.mapAccum
	 * @example
	 *
	 *      var digits = ['1', '2', '3', '4'];
	 *      var append = (a, b) => [a + b, a + b];
	 *
	 *      R.mapAccumRight(append, 5, digits); //=> [['12345', '2345', '345', '45'], '12345']
	 * @symb R.mapAccumRight(f, a, [b, c, d]) = [
	 *   [
	 *     f(b, f(c, f(d, a)[0])[0])[1],
	 *     f(c, f(d, a)[0])[1],
	 *     f(d, a)[1],
	 *   ]
	 *   f(b, f(c, f(d, a)[0])[0])[0],
	 * ]
	 */
	module.exports = _curry3(function mapAccumRight(fn, acc, list) {
	  var idx = list.length - 1;
	  var result = [];
	  var tuple = [acc];
	  while (idx >= 0) {
	    tuple = fn(list[idx], tuple[0]);
	    result[idx] = tuple[1];
	    idx -= 1;
	  }
	  return [result, tuple[0]];
	});


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _reduce = __webpack_require__(33);
	var keys = __webpack_require__(39);
	
	
	/**
	 * An Object-specific version of [`map`](#map). The function is applied to three
	 * arguments: *(value, key, obj)*. If only the value is significant, use
	 * [`map`](#map) instead.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Object
	 * @sig ((*, String, Object) -> *) -> Object -> Object
	 * @param {Function} fn
	 * @param {Object} obj
	 * @return {Object}
	 * @see R.map
	 * @example
	 *
	 *      var values = { x: 1, y: 2, z: 3 };
	 *      var prependKeyAndDouble = (num, key, obj) => key + (num * 2);
	 *
	 *      R.mapObjIndexed(prependKeyAndDouble, values); //=> { x: 'x2', y: 'y4', z: 'z6' }
	 */
	module.exports = _curry2(function mapObjIndexed(fn, obj) {
	  return _reduce(function(acc, key) {
	    acc[key] = fn(obj[key], key, obj);
	    return acc;
	  }, {}, keys(obj));
	});


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Tests a regular expression against a String. Note that this function will
	 * return an empty array when there are no matches. This differs from
	 * [`String.prototype.match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
	 * which returns `null` when there are no matches.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category String
	 * @sig RegExp -> String -> [String | Undefined]
	 * @param {RegExp} rx A regular expression.
	 * @param {String} str The string to match against
	 * @return {Array} The list of matches or empty array.
	 * @see R.test
	 * @example
	 *
	 *      R.match(/([a-z]a)/g, 'bananas'); //=> ['ba', 'na', 'na']
	 *      R.match(/a/, 'b'); //=> []
	 *      R.match(/a/, null); //=> TypeError: null does not have a method named "match"
	 */
	module.exports = _curry2(function match(rx, str) {
	  return str.match(rx) || [];
	});


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _isInteger = __webpack_require__(59);
	
	
	/**
	 * `mathMod` behaves like the modulo operator should mathematically, unlike the
	 * `%` operator (and by extension, [`R.modulo`](#modulo)). So while
	 * `-17 % 5` is `-2`, `mathMod(-17, 5)` is `3`. `mathMod` requires Integer
	 * arguments, and returns NaN when the modulus is zero or negative.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category Math
	 * @sig Number -> Number -> Number
	 * @param {Number} m The dividend.
	 * @param {Number} p the modulus.
	 * @return {Number} The result of `b mod a`.
	 * @see R.modulo
	 * @example
	 *
	 *      R.mathMod(-17, 5);  //=> 3
	 *      R.mathMod(17, 5);   //=> 2
	 *      R.mathMod(17, -5);  //=> NaN
	 *      R.mathMod(17, 0);   //=> NaN
	 *      R.mathMod(17.2, 5); //=> NaN
	 *      R.mathMod(17, 5.3); //=> NaN
	 *
	 *      var clock = R.mathMod(R.__, 12);
	 *      clock(15); //=> 3
	 *      clock(24); //=> 0
	 *
	 *      var seventeenMod = R.mathMod(17);
	 *      seventeenMod(3);  //=> 2
	 *      seventeenMod(4);  //=> 1
	 *      seventeenMod(10); //=> 7
	 */
	module.exports = _curry2(function mathMod(m, p) {
	  if (!_isInteger(m)) { return NaN; }
	  if (!_isInteger(p) || p < 1) { return NaN; }
	  return ((m % p) + p) % p;
	});


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Takes a function and two values, and returns whichever value produces the
	 * larger result when passed to the provided function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Relation
	 * @sig Ord b => (a -> b) -> a -> a -> a
	 * @param {Function} f
	 * @param {*} a
	 * @param {*} b
	 * @return {*}
	 * @see R.max, R.minBy
	 * @example
	 *
	 *      //  square :: Number -> Number
	 *      var square = n => n * n;
	 *
	 *      R.maxBy(square, -3, 2); //=> -3
	 *
	 *      R.reduce(R.maxBy(square), 0, [3, -5, 4, 1, -2]); //=> -5
	 *      R.reduce(R.maxBy(square), 0, []); //=> 0
	 */
	module.exports = _curry3(function maxBy(f, a, b) {
	  return f(b) > f(a) ? b : a;
	});


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var sum = __webpack_require__(222);
	
	
	/**
	 * Returns the mean of the given list of numbers.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category Math
	 * @sig [Number] -> Number
	 * @param {Array} list
	 * @return {Number}
	 * @see R.median
	 * @example
	 *
	 *      R.mean([2, 7, 9]); //=> 6
	 *      R.mean([]); //=> NaN
	 */
	module.exports = _curry1(function mean(list) {
	  return sum(list) / list.length;
	});


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

	var add = __webpack_require__(12);
	var reduce = __webpack_require__(43);
	
	
	/**
	 * Adds together all the elements of a list.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Math
	 * @sig [Number] -> Number
	 * @param {Array} list An array of numbers
	 * @return {Number} The sum of all the numbers in the list.
	 * @see R.reduce
	 * @example
	 *
	 *      R.sum([2,4,6,8,100,1]); //=> 121
	 */
	module.exports = reduce(add, 0);


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var mean = __webpack_require__(221);
	
	
	/**
	 * Returns the median of the given list of numbers.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category Math
	 * @sig [Number] -> Number
	 * @param {Array} list
	 * @return {Number}
	 * @see R.mean
	 * @example
	 *
	 *      R.median([2, 9, 7]); //=> 7
	 *      R.median([7, 2, 10, 9]); //=> 8
	 *      R.median([]); //=> NaN
	 */
	module.exports = _curry1(function median(list) {
	  var len = list.length;
	  if (len === 0) {
	    return NaN;
	  }
	  var width = 2 - len % 2;
	  var idx = (len - width) / 2;
	  return mean(Array.prototype.slice.call(list, 0).sort(function(a, b) {
	    return a < b ? -1 : a > b ? 1 : 0;
	  }).slice(idx, idx + width));
	});


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

	var memoizeWith = __webpack_require__(225);
	var toString = __webpack_require__(94);
	
	
	/**
	 * Creates a new function that, when invoked, caches the result of calling `fn`
	 * for a given argument set and returns the result. Subsequent calls to the
	 * memoized `fn` with the same argument set will not result in an additional
	 * call to `fn`; instead, the cached result for that set of arguments will be
	 * returned.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (*... -> a) -> (*... -> a)
	 * @param {Function} fn The function to memoize.
	 * @return {Function} Memoized version of `fn`.
	 * @see R.memoizeWith
	 * @example
	 *
	 *      let count = 0;
	 *      const factorial = R.memoize(n => {
	 *        count += 1;
	 *        return R.product(R.range(1, n + 1));
	 *      });
	 *      factorial(5); //=> 120
	 *      factorial(5); //=> 120
	 *      factorial(5); //=> 120
	 *      count; //=> 1
	 */
	module.exports = memoizeWith(function() {
	  return toString(arguments);
	});


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(17);
	var _curry2 = __webpack_require__(13);
	var _has = __webpack_require__(40);
	
	
	/**
	 * A customisable version of [`R.memoize`](#memoize). `memoizeWith` takes an
	 * additional function that will be applied to a given argument set and used to
	 * create the cache key under which the results of the function to be memoized
	 * will be stored. Care must be taken when implementing key generation to avoid
	 * clashes that may overwrite previous entries erroneously.
	 *
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category Function
	 * @sig (*... -> String) -> (*... -> a) -> (*... -> a)
	 * @param {Function} fn The function to generate the cache key.
	 * @param {Function} fn The function to memoize.
	 * @return {Function} Memoized version of `fn`.
	 * @see R.memoize
	 * @example
	 *
	 *      let count = 0;
	 *      const factorial = R.memoizeWith(R.identity, n => {
	 *        count += 1;
	 *        return R.product(R.range(1, n + 1));
	 *      });
	 *      factorial(5); //=> 120
	 *      factorial(5); //=> 120
	 *      factorial(5); //=> 120
	 *      count; //=> 1
	 */
	module.exports = _curry2(function memoizeWith(mFn, fn) {
	  var cache = {};
	  return _arity(fn.length, function() {
	    var key = mFn.apply(this, arguments);
	    if (!_has(key, cache)) {
	      cache[key] = fn.apply(this, arguments);
	    }
	    return cache[key];
	  });
	});


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

	var _assign = __webpack_require__(194);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Create a new object with the own properties of the first object merged with
	 * the own properties of the second object. If a key exists in both objects,
	 * the value from the second object will be used.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig {k: v} -> {k: v} -> {k: v}
	 * @param {Object} l
	 * @param {Object} r
	 * @return {Object}
	 * @see R.mergeDeepRight, R.mergeWith, R.mergeWithKey
	 * @example
	 *
	 *      R.merge({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
	 *      //=> { 'name': 'fred', 'age': 40 }
	 *
	 *      var resetToDefault = R.merge(R.__, {x: 0});
	 *      resetToDefault({x: 5, y: 2}); //=> {x: 0, y: 2}
	 * @symb R.merge({ x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: 5, z: 3 }
	 */
	module.exports = _curry2(function merge(l, r) {
	  return _assign({}, l, r);
	});


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

	var _assign = __webpack_require__(194);
	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Merges a list of objects together into one object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category List
	 * @sig [{k: v}] -> {k: v}
	 * @param {Array} list An array of objects
	 * @return {Object} A merged object.
	 * @see R.reduce
	 * @example
	 *
	 *      R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}
	 *      R.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}
	 * @symb R.mergeAll([{ x: 1 }, { y: 2 }, { z: 3 }]) = { x: 1, y: 2, z: 3 }
	 */
	module.exports = _curry1(function mergeAll(list) {
	  return _assign.apply(null, [{}].concat(list));
	});


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var mergeDeepWithKey = __webpack_require__(229);
	
	
	/**
	 * Creates a new object with the own properties of the first object merged with
	 * the own properties of the second object. If a key exists in both objects:
	 * - and both values are objects, the two values will be recursively merged
	 * - otherwise the value from the first object will be used.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category Object
	 * @sig {a} -> {a} -> {a}
	 * @param {Object} lObj
	 * @param {Object} rObj
	 * @return {Object}
	 * @see R.merge, R.mergeDeepRight, R.mergeDeepWith, R.mergeDeepWithKey
	 * @example
	 *
	 *      R.mergeDeepLeft({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
	 *                      { age: 40, contact: { email: 'baa@example.com' }});
	 *      //=> { name: 'fred', age: 10, contact: { email: 'moo@example.com' }}
	 */
	module.exports = _curry2(function mergeDeepLeft(lObj, rObj) {
	  return mergeDeepWithKey(function(k, lVal, rVal) {
	    return lVal;
	  }, lObj, rObj);
	});


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var _isObject = __webpack_require__(109);
	var mergeWithKey = __webpack_require__(230);
	
	
	/**
	 * Creates a new object with the own properties of the two provided objects.
	 * If a key exists in both objects:
	 * - and both associated values are also objects then the values will be
	 *   recursively merged.
	 * - otherwise the provided function is applied to the key and associated values
	 *   using the resulting value as the new value associated with the key.
	 * If a key only exists in one object, the value will be associated with the key
	 * of the resulting object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category Object
	 * @sig (String -> a -> a -> a) -> {a} -> {a} -> {a}
	 * @param {Function} fn
	 * @param {Object} lObj
	 * @param {Object} rObj
	 * @return {Object}
	 * @see R.mergeWithKey, R.mergeDeep, R.mergeDeepWith
	 * @example
	 *
	 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
	 *      R.mergeDeepWithKey(concatValues,
	 *                         { a: true, c: { thing: 'foo', values: [10, 20] }},
	 *                         { b: true, c: { thing: 'bar', values: [15, 35] }});
	 *      //=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}
	 */
	module.exports = _curry3(function mergeDeepWithKey(fn, lObj, rObj) {
	  return mergeWithKey(function(k, lVal, rVal) {
	    if (_isObject(lVal) && _isObject(rVal)) {
	      return mergeDeepWithKey(fn, lVal, rVal);
	    } else {
	      return fn(k, lVal, rVal);
	    }
	  }, lObj, rObj);
	});


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var _has = __webpack_require__(40);
	
	
	/**
	 * Creates a new object with the own properties of the two provided objects. If
	 * a key exists in both objects, the provided function is applied to the key
	 * and the values associated with the key in each object, with the result being
	 * used as the value associated with the key in the returned object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category Object
	 * @sig (String -> a -> a -> a) -> {a} -> {a} -> {a}
	 * @param {Function} fn
	 * @param {Object} l
	 * @param {Object} r
	 * @return {Object}
	 * @see R.mergeDeepWithKey, R.merge, R.mergeWith
	 * @example
	 *
	 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
	 *      R.mergeWithKey(concatValues,
	 *                     { a: true, thing: 'foo', values: [10, 20] },
	 *                     { b: true, thing: 'bar', values: [15, 35] });
	 *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
	 * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
	 */
	module.exports = _curry3(function mergeWithKey(fn, l, r) {
	  var result = {};
	  var k;
	
	  for (k in l) {
	    if (_has(k, l)) {
	      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
	    }
	  }
	
	  for (k in r) {
	    if (_has(k, r) && !(_has(k, result))) {
	      result[k] = r[k];
	    }
	  }
	
	  return result;
	});


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var mergeDeepWithKey = __webpack_require__(229);
	
	
	/**
	 * Creates a new object with the own properties of the first object merged with
	 * the own properties of the second object. If a key exists in both objects:
	 * - and both values are objects, the two values will be recursively merged
	 * - otherwise the value from the second object will be used.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category Object
	 * @sig {a} -> {a} -> {a}
	 * @param {Object} lObj
	 * @param {Object} rObj
	 * @return {Object}
	 * @see R.merge, R.mergeDeepLeft, R.mergeDeepWith, R.mergeDeepWithKey
	 * @example
	 *
	 *      R.mergeDeepRight({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
	 *                       { age: 40, contact: { email: 'baa@example.com' }});
	 *      //=> { name: 'fred', age: 40, contact: { email: 'baa@example.com' }}
	 */
	module.exports = _curry2(function mergeDeepRight(lObj, rObj) {
	  return mergeDeepWithKey(function(k, lVal, rVal) {
	    return rVal;
	  }, lObj, rObj);
	});


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var mergeDeepWithKey = __webpack_require__(229);
	
	
	/**
	 * Creates a new object with the own properties of the two provided objects.
	 * If a key exists in both objects:
	 * - and both associated values are also objects then the values will be
	 *   recursively merged.
	 * - otherwise the provided function is applied to associated values using the
	 *   resulting value as the new value associated with the key.
	 * If a key only exists in one object, the value will be associated with the key
	 * of the resulting object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category Object
	 * @sig (a -> a -> a) -> {a} -> {a} -> {a}
	 * @param {Function} fn
	 * @param {Object} lObj
	 * @param {Object} rObj
	 * @return {Object}
	 * @see R.mergeWith, R.mergeDeep, R.mergeDeepWithKey
	 * @example
	 *
	 *      R.mergeDeepWith(R.concat,
	 *                      { a: true, c: { values: [10, 20] }},
	 *                      { b: true, c: { values: [15, 35] }});
	 *      //=> { a: true, b: true, c: { values: [10, 20, 15, 35] }}
	 */
	module.exports = _curry3(function mergeDeepWith(fn, lObj, rObj) {
	  return mergeDeepWithKey(function(k, lVal, rVal) {
	    return fn(lVal, rVal);
	  }, lObj, rObj);
	});


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var mergeWithKey = __webpack_require__(230);
	
	
	/**
	 * Creates a new object with the own properties of the two provided objects. If
	 * a key exists in both objects, the provided function is applied to the values
	 * associated with the key in each object, with the result being used as the
	 * value associated with the key in the returned object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category Object
	 * @sig (a -> a -> a) -> {a} -> {a} -> {a}
	 * @param {Function} fn
	 * @param {Object} l
	 * @param {Object} r
	 * @return {Object}
	 * @see R.mergeDeepWith, R.merge, R.mergeWithKey
	 * @example
	 *
	 *      R.mergeWith(R.concat,
	 *                  { a: true, values: [10, 20] },
	 *                  { b: true, values: [15, 35] });
	 *      //=> { a: true, b: true, values: [10, 20, 15, 35] }
	 */
	module.exports = _curry3(function mergeWith(fn, l, r) {
	  return mergeWithKey(function(_, _l, _r) {
	    return fn(_l, _r);
	  }, l, r);
	});


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns the smaller of its two arguments.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig Ord a => a -> a -> a
	 * @param {*} a
	 * @param {*} b
	 * @return {*}
	 * @see R.minBy, R.max
	 * @example
	 *
	 *      R.min(789, 123); //=> 123
	 *      R.min('a', 'b'); //=> 'a'
	 */
	module.exports = _curry2(function min(a, b) { return b < a ? b : a; });


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Takes a function and two values, and returns whichever value produces the
	 * smaller result when passed to the provided function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Relation
	 * @sig Ord b => (a -> b) -> a -> a -> a
	 * @param {Function} f
	 * @param {*} a
	 * @param {*} b
	 * @return {*}
	 * @see R.min, R.maxBy
	 * @example
	 *
	 *      //  square :: Number -> Number
	 *      var square = n => n * n;
	 *
	 *      R.minBy(square, -3, 2); //=> 2
	 *
	 *      R.reduce(R.minBy(square), Infinity, [3, -5, 4, 1, -2]); //=> 1
	 *      R.reduce(R.minBy(square), Infinity, []); //=> Infinity
	 */
	module.exports = _curry3(function minBy(f, a, b) {
	  return f(b) < f(a) ? b : a;
	});


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Divides the first parameter by the second and returns the remainder. Note
	 * that this function preserves the JavaScript-style behavior for modulo. For
	 * mathematical modulo see [`mathMod`](#mathMod).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.1
	 * @category Math
	 * @sig Number -> Number -> Number
	 * @param {Number} a The value to the divide.
	 * @param {Number} b The pseudo-modulus
	 * @return {Number} The result of `b % a`.
	 * @see R.mathMod
	 * @example
	 *
	 *      R.modulo(17, 3); //=> 2
	 *      // JS behavior:
	 *      R.modulo(-17, 3); //=> -2
	 *      R.modulo(17, -3); //=> 2
	 *
	 *      var isOdd = R.modulo(R.__, 2);
	 *      isOdd(42); //=> 0
	 *      isOdd(21); //=> 1
	 */
	module.exports = _curry2(function modulo(a, b) { return a % b; });


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Multiplies two numbers. Equivalent to `a * b` but curried.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Math
	 * @sig Number -> Number -> Number
	 * @param {Number} a The first value.
	 * @param {Number} b The second value.
	 * @return {Number} The result of `a * b`.
	 * @see R.divide
	 * @example
	 *
	 *      var double = R.multiply(2);
	 *      var triple = R.multiply(3);
	 *      double(3);       //=>  6
	 *      triple(4);       //=> 12
	 *      R.multiply(2, 5);  //=> 10
	 */
	module.exports = _curry2(function multiply(a, b) { return a * b; });


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Negates its argument.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Math
	 * @sig Number -> Number
	 * @param {Number} n
	 * @return {Number}
	 * @example
	 *
	 *      R.negate(42); //=> -42
	 */
	module.exports = _curry1(function negate(n) { return -n; });


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

	var _complement = __webpack_require__(106);
	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xany = __webpack_require__(46);
	var any = __webpack_require__(45);
	
	
	/**
	 * Returns `true` if no elements of the list match the predicate, `false`
	 * otherwise.
	 *
	 * Dispatches to the `any` method of the second argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.12.0
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> Boolean
	 * @param {Function} fn The predicate function.
	 * @param {Array} list The array to consider.
	 * @return {Boolean} `true` if the predicate is not satisfied by every element, `false` otherwise.
	 * @see R.all, R.any
	 * @example
	 *
	 *      var isEven = n => n % 2 === 0;
	 *
	 *      R.none(isEven, [1, 3, 5, 7, 9, 11]); //=> true
	 *      R.none(isEven, [1, 3, 5, 7, 8, 11]); //=> false
	 */
	module.exports = _curry2(_complement(_dispatchable(['any'], _xany, any)));


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var curryN = __webpack_require__(16);
	var nth = __webpack_require__(144);
	
	
	/**
	 * Returns a function which returns its nth argument.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category Function
	 * @sig Number -> *... -> *
	 * @param {Number} n
	 * @return {Function}
	 * @example
	 *
	 *      R.nthArg(1)('a', 'b', 'c'); //=> 'b'
	 *      R.nthArg(-1)('a', 'b', 'c'); //=> 'c'
	 * @symb R.nthArg(-1)(a, b, c) = c
	 * @symb R.nthArg(0)(a, b, c) = a
	 * @symb R.nthArg(1)(a, b, c) = b
	 */
	module.exports = _curry1(function nthArg(n) {
	  var arity = n < 0 ? 1 : n + 1;
	  return curryN(arity, function() {
	    return nth(n, arguments);
	  });
	});


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * `o` is a curried composition function that returns a unary function.
	 * Like [`compose`](#compose), `o` performs right-to-left function composition.
	 * Unlike [`compose`](#compose), the rightmost function passed to `o` will be
	 * invoked with only one argument.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category Function
	 * @sig (b -> c) -> (a -> b) -> a -> c
	 * @param {Function} f
	 * @param {Function} g
	 * @return {Function}
	 * @see R.compose, R.pipe
	 * @example
	 *
	 *      var classyGreeting = name => "The name's " + name.last + ", " + name.first + " " + lastName
	 *      var yellGreeting = R.o(R.toUpper, classyGreeting);
	 *      yellGreeting({first: 'James', last: 'Bond'}); //=> "THE NAME'S BOND, JAMES BOND"
	 *
	 *      R.o(R.multiply(10), R.add(10))(-4) //=> 60
	 *
	 * @symb R.o(f, g, x) = f(g(x))
	 */
	module.exports = _curry3(function o(f, g, x) {
	  return f(g(x));
	});


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _of = __webpack_require__(243);
	
	
	/**
	 * Returns a singleton array containing the value provided.
	 *
	 * Note this `of` is different from the ES6 `of`; See
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category Function
	 * @sig a -> [a]
	 * @param {*} x any value
	 * @return {Array} An array wrapping `x`.
	 * @example
	 *
	 *      R.of(null); //=> [null]
	 *      R.of([42]); //=> [[42]]
	 */
	module.exports = _curry1(_of);


/***/ }),
/* 243 */
/***/ (function(module, exports) {

	module.exports = function _of(x) { return [x]; };


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

	var _contains = __webpack_require__(96);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a partial copy of an object omitting the keys specified.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig [String] -> {String: *} -> {String: *}
	 * @param {Array} names an array of String property names to omit from the new object
	 * @param {Object} obj The object to copy from
	 * @return {Object} A new object with properties from `names` not on it.
	 * @see R.pick
	 * @example
	 *
	 *      R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
	 */
	module.exports = _curry2(function omit(names, obj) {
	  var result = {};
	  for (var prop in obj) {
	    if (!_contains(prop, names)) {
	      result[prop] = obj[prop];
	    }
	  }
	  return result;
	});


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(17);
	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Accepts a function `fn` and returns a function that guards invocation of
	 * `fn` such that `fn` can only ever be called once, no matter how many times
	 * the returned function is invoked. The first value calculated is returned in
	 * subsequent invocations.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (a... -> b) -> (a... -> b)
	 * @param {Function} fn The function to wrap in a call-only-once wrapper.
	 * @return {Function} The wrapped function.
	 * @example
	 *
	 *      var addOneOnce = R.once(x => x + 1);
	 *      addOneOnce(10); //=> 11
	 *      addOneOnce(addOneOnce(50)); //=> 11
	 */
	module.exports = _curry1(function once(fn) {
	  var called = false;
	  var result;
	  return _arity(fn.length, function() {
	    if (called) {
	      return result;
	    }
	    called = true;
	    result = fn.apply(this, arguments);
	    return result;
	  });
	});


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Returns the result of "setting" the portion of the given data structure
	 * focused by the given lens to the result of applying the given function to
	 * the focused value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category Object
	 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	 * @sig Lens s a -> (a -> a) -> s -> s
	 * @param {Lens} lens
	 * @param {*} v
	 * @param {*} x
	 * @return {*}
	 * @see R.prop, R.lensIndex, R.lensProp
	 * @example
	 *
	 *      var headLens = R.lensIndex(0);
	 *
	 *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
	 */
	module.exports = (function() {
	  // `Identity` is a functor that holds a single value, where `map` simply
	  // transforms the held value with the provided function.
	  var Identity = function(x) {
	    return {value: x, map: function(f) { return Identity(f(x)); }};
	  };
	
	  return _curry3(function over(lens, f, x) {
	    // The value returned by the getter function is first transformed with `f`,
	    // then set as the value of an `Identity`. This is then mapped over with the
	    // setter function of the lens.
	    return lens(function(y) { return Identity(f(y)); })(x).value;
	  });
	}());


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Takes two arguments, `fst` and `snd`, and returns `[fst, snd]`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.18.0
	 * @category List
	 * @sig a -> b -> (a,b)
	 * @param {*} fst
	 * @param {*} snd
	 * @return {Array}
	 * @see R.objOf, R.of
	 * @example
	 *
	 *      R.pair('foo', 'bar'); //=> ['foo', 'bar']
	 */
	module.exports = _curry2(function pair(fst, snd) { return [fst, snd]; });


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(15);
	var _createPartialApplicator = __webpack_require__(249);
	
	
	/**
	 * Takes a function `f` and a list of arguments, and returns a function `g`.
	 * When applied, `g` returns the result of applying `f` to the arguments
	 * provided initially followed by the arguments provided to `g`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category Function
	 * @sig ((a, b, c, ..., n) -> x) -> [a, b, c, ...] -> ((d, e, f, ..., n) -> x)
	 * @param {Function} f
	 * @param {Array} args
	 * @return {Function}
	 * @see R.partialRight
	 * @example
	 *
	 *      var multiply2 = (a, b) => a * b;
	 *      var double = R.partial(multiply2, [2]);
	 *      double(2); //=> 4
	 *
	 *      var greet = (salutation, title, firstName, lastName) =>
	 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
	 *
	 *      var sayHello = R.partial(greet, ['Hello']);
	 *      var sayHelloToMs = R.partial(sayHello, ['Ms.']);
	 *      sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
	 * @symb R.partial(f, [a, b])(c, d) = f(a, b, c, d)
	 */
	module.exports = _createPartialApplicator(_concat);


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(17);
	var _curry2 = __webpack_require__(13);
	
	
	module.exports = function _createPartialApplicator(concat) {
	  return _curry2(function(fn, args) {
	    return _arity(Math.max(0, fn.length - args.length), function() {
	      return fn.apply(this, concat(args, arguments));
	    });
	  });
	};


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(15);
	var _createPartialApplicator = __webpack_require__(249);
	var flip = __webpack_require__(164);
	
	
	/**
	 * Takes a function `f` and a list of arguments, and returns a function `g`.
	 * When applied, `g` returns the result of applying `f` to the arguments
	 * provided to `g` followed by the arguments provided initially.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category Function
	 * @sig ((a, b, c, ..., n) -> x) -> [d, e, f, ..., n] -> ((a, b, c, ...) -> x)
	 * @param {Function} f
	 * @param {Array} args
	 * @return {Function}
	 * @see R.partial
	 * @example
	 *
	 *      var greet = (salutation, title, firstName, lastName) =>
	 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
	 *
	 *      var greetMsJaneJones = R.partialRight(greet, ['Ms.', 'Jane', 'Jones']);
	 *
	 *      greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
	 * @symb R.partialRight(f, [a, b])(c, d) = f(c, d, a, b)
	 */
	module.exports = _createPartialApplicator(flip(_concat));


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

	var filter = __webpack_require__(107);
	var juxt = __webpack_require__(203);
	var reject = __webpack_require__(105);
	
	
	/**
	 * Takes a predicate and a list or other `Filterable` object and returns the
	 * pair of filterable objects of the same type of elements which do and do not
	 * satisfy, the predicate, respectively. Filterable objects include plain objects or any object
	 * that has a filter method such as `Array`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.4
	 * @category List
	 * @sig Filterable f => (a -> Boolean) -> f a -> [f a, f a]
	 * @param {Function} pred A predicate to determine which side the element belongs to.
	 * @param {Array} filterable the list (or other filterable) to partition.
	 * @return {Array} An array, containing first the subset of elements that satisfy the
	 *         predicate, and second the subset of elements that do not satisfy.
	 * @see R.filter, R.reject
	 * @example
	 *
	 *      R.partition(R.contains('s'), ['sss', 'ttt', 'foo', 'bars']);
	 *      // => [ [ 'sss', 'bars' ],  [ 'ttt', 'foo' ] ]
	 *
	 *      R.partition(R.contains('s'), { a: 'sss', b: 'ttt', foo: 'bars' });
	 *      // => [ { a: 'sss', foo: 'bars' }, { b: 'ttt' }  ]
	 */
	module.exports = juxt([filter, reject]);


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var equals = __webpack_require__(98);
	var path = __webpack_require__(211);
	
	
	/**
	 * Determines whether a nested path on an object has a specific value, in
	 * [`R.equals`](#equals) terms. Most likely used to filter a list.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.7.0
	 * @category Relation
	 * @typedefn Idx = String | Int
	 * @sig [Idx] -> a -> {a} -> Boolean
	 * @param {Array} path The path of the nested property to use
	 * @param {*} val The value to compare the nested property with
	 * @param {Object} obj The object to check the nested property in
	 * @return {Boolean} `true` if the value equals the nested object property,
	 *         `false` otherwise.
	 * @example
	 *
	 *      var user1 = { address: { zipCode: 90210 } };
	 *      var user2 = { address: { zipCode: 55555 } };
	 *      var user3 = { name: 'Bob' };
	 *      var users = [ user1, user2, user3 ];
	 *      var isFamous = R.pathEq(['address', 'zipCode'], 90210);
	 *      R.filter(isFamous, users); //=> [ user1 ]
	 */
	module.exports = _curry3(function pathEq(_path, val, obj) {
	  return equals(path(_path, obj), val);
	});


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var defaultTo = __webpack_require__(120);
	var path = __webpack_require__(211);
	
	
	/**
	 * If the given, non-null object has a value at the given path, returns the
	 * value at that path. Otherwise returns the provided default value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.18.0
	 * @category Object
	 * @typedefn Idx = String | Int
	 * @sig a -> [Idx] -> {a} -> a
	 * @param {*} d The default value.
	 * @param {Array} p The path to use.
	 * @param {Object} obj The object to retrieve the nested property from.
	 * @return {*} The data at `path` of the supplied object or the default value.
	 * @example
	 *
	 *      R.pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2
	 *      R.pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> "N/A"
	 */
	module.exports = _curry3(function pathOr(d, p, obj) {
	  return defaultTo(d, path(p, obj));
	});


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var path = __webpack_require__(211);
	
	
	/**
	 * Returns `true` if the specified object property at given path satisfies the
	 * given predicate; `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category Logic
	 * @typedefn Idx = String | Int
	 * @sig (a -> Boolean) -> [Idx] -> {a} -> Boolean
	 * @param {Function} pred
	 * @param {Array} propPath
	 * @param {*} obj
	 * @return {Boolean}
	 * @see R.propSatisfies, R.path
	 * @example
	 *
	 *      R.pathSatisfies(y => y > 0, ['x', 'y'], {x: {y: 2}}); //=> true
	 */
	module.exports = _curry3(function pathSatisfies(pred, propPath, obj) {
	  return propPath.length > 0 && pred(path(propPath, obj));
	});


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a partial copy of an object containing only the keys specified. If
	 * the key does not exist, the property is ignored.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig [k] -> {k: v} -> {k: v}
	 * @param {Array} names an array of String property names to copy onto a new object
	 * @param {Object} obj The object to copy from
	 * @return {Object} A new object with only properties from `names` on it.
	 * @see R.omit, R.props
	 * @example
	 *
	 *      R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
	 *      R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
	 */
	module.exports = _curry2(function pick(names, obj) {
	  var result = {};
	  var idx = 0;
	  while (idx < names.length) {
	    if (names[idx] in obj) {
	      result[names[idx]] = obj[names[idx]];
	    }
	    idx += 1;
	  }
	  return result;
	});


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Similar to `pick` except that this one includes a `key: undefined` pair for
	 * properties that don't exist.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig [k] -> {k: v} -> {k: v}
	 * @param {Array} names an array of String property names to copy onto a new object
	 * @param {Object} obj The object to copy from
	 * @return {Object} A new object with only properties from `names` on it.
	 * @see R.pick
	 * @example
	 *
	 *      R.pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
	 *      R.pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}
	 */
	module.exports = _curry2(function pickAll(names, obj) {
	  var result = {};
	  var idx = 0;
	  var len = names.length;
	  while (idx < len) {
	    var name = names[idx];
	    result[name] = obj[name];
	    idx += 1;
	  }
	  return result;
	});


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a partial copy of an object containing only the keys that satisfy
	 * the supplied predicate.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Object
	 * @sig (v, k -> Boolean) -> {k: v} -> {k: v}
	 * @param {Function} pred A predicate to determine whether or not a key
	 *        should be included on the output object.
	 * @param {Object} obj The object to copy from
	 * @return {Object} A new object with only properties that satisfy `pred`
	 *         on it.
	 * @see R.pick, R.filter
	 * @example
	 *
	 *      var isUpperCase = (val, key) => key.toUpperCase() === key;
	 *      R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
	 */
	module.exports = _curry2(function pickBy(test, obj) {
	  var result = {};
	  for (var prop in obj) {
	    if (test(obj[prop], prop, obj)) {
	      result[prop] = obj[prop];
	    }
	  }
	  return result;
	});


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

	var composeK = __webpack_require__(89);
	var reverse = __webpack_require__(88);
	
	/**
	 * Returns the left-to-right Kleisli composition of the provided functions,
	 * each of which must return a value of a type supported by [`chain`](#chain).
	 *
	 * `R.pipeK(f, g, h)` is equivalent to `R.pipe(R.chain(f), R.chain(g), R.chain(h))`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category Function
	 * @sig Chain m => ((a -> m b), (b -> m c), ..., (y -> m z)) -> (a -> m z)
	 * @param {...Function}
	 * @return {Function}
	 * @see R.composeK
	 * @example
	 *
	 *      //  parseJson :: String -> Maybe *
	 *      //  get :: String -> Object -> Maybe *
	 *
	 *      //  getStateCode :: Maybe String -> Maybe String
	 *      var getStateCode = R.pipeK(
	 *        parseJson,
	 *        get('user'),
	 *        get('address'),
	 *        get('state'),
	 *        R.compose(Maybe.of, R.toUpper)
	 *      );
	 *
	 *      getStateCode('{"user":{"address":{"state":"ny"}}}');
	 *      //=> Just('NY')
	 *      getStateCode('[Invalid JSON]');
	 *      //=> Nothing()
	 * @symb R.pipeK(f, g, h)(a) = R.chain(h, R.chain(g, f(a)))
	 */
	module.exports = function pipeK() {
	  if (arguments.length === 0) {
	    throw new Error('pipeK requires at least one argument');
	  }
	  return composeK.apply(this, reverse(arguments));
	};


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(15);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a new list with the given element at the front, followed by the
	 * contents of the list.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig a -> [a] -> [a]
	 * @param {*} el The item to add to the head of the output list.
	 * @param {Array} list The array to add to the tail of the output list.
	 * @return {Array} A new array.
	 * @see R.append
	 * @example
	 *
	 *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
	 */
	module.exports = _curry2(function prepend(el, list) {
	  return _concat([el], list);
	});


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

	var multiply = __webpack_require__(237);
	var reduce = __webpack_require__(43);
	
	
	/**
	 * Multiplies together all the elements of a list.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Math
	 * @sig [Number] -> Number
	 * @param {Array} list An array of numbers
	 * @return {Number} The product of all the numbers in the list.
	 * @see R.reduce
	 * @example
	 *
	 *      R.product([2,4,6,8,100,1]); //=> 38400
	 */
	module.exports = reduce(multiply, 1);


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

	var _map = __webpack_require__(32);
	var identity = __webpack_require__(175);
	var pickAll = __webpack_require__(256);
	var useWith = __webpack_require__(262);
	
	
	/**
	 * Reasonable analog to SQL `select` statement.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @category Relation
	 * @sig [k] -> [{k: v}] -> [{k: v}]
	 * @param {Array} props The property names to project
	 * @param {Array} objs The objects to query
	 * @return {Array} An array of objects with just the `props` properties.
	 * @example
	 *
	 *      var abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2};
	 *      var fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7};
	 *      var kids = [abby, fred];
	 *      R.project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
	 */
	module.exports = useWith(_map, [pickAll, identity]); // passing `identity` gives correct arity


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var curryN = __webpack_require__(16);
	
	
	/**
	 * Accepts a function `fn` and a list of transformer functions and returns a
	 * new curried function. When the new function is invoked, it calls the
	 * function `fn` with parameters consisting of the result of calling each
	 * supplied handler on successive arguments to the new function.
	 *
	 * If more arguments are passed to the returned function than transformer
	 * functions, those arguments are passed directly to `fn` as additional
	 * parameters. If you expect additional arguments that don't need to be
	 * transformed, although you can ignore them, it's best to pass an identity
	 * function so that the new function reports the correct arity.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (x1 -> x2 -> ... -> z) -> [(a -> x1), (b -> x2), ...] -> (a -> b -> ... -> z)
	 * @param {Function} fn The function to wrap.
	 * @param {Array} transformers A list of transformer functions
	 * @return {Function} The wrapped function.
	 * @see R.converge
	 * @example
	 *
	 *      R.useWith(Math.pow, [R.identity, R.identity])(3, 4); //=> 81
	 *      R.useWith(Math.pow, [R.identity, R.identity])(3)(4); //=> 81
	 *      R.useWith(Math.pow, [R.dec, R.inc])(3, 4); //=> 32
	 *      R.useWith(Math.pow, [R.dec, R.inc])(3)(4); //=> 32
	 * @symb R.useWith(f, [g, h])(a, b) = f(g(a), h(b))
	 */
	module.exports = _curry2(function useWith(fn, transformers) {
	  return curryN(transformers.length, function() {
	    var args = [];
	    var idx = 0;
	    while (idx < transformers.length) {
	      args.push(transformers[idx].call(this, arguments[idx]));
	      idx += 1;
	    }
	    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, transformers.length)));
	  });
	});


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var equals = __webpack_require__(98);
	
	
	/**
	 * Returns `true` if the specified object property is equal, in
	 * [`R.equals`](#equals) terms, to the given value; `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig String -> a -> Object -> Boolean
	 * @param {String} name
	 * @param {*} val
	 * @param {*} obj
	 * @return {Boolean}
	 * @see R.equals, R.propSatisfies
	 * @example
	 *
	 *      var abby = {name: 'Abby', age: 7, hair: 'blond'};
	 *      var fred = {name: 'Fred', age: 12, hair: 'brown'};
	 *      var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
	 *      var alois = {name: 'Alois', age: 15, disposition: 'surly'};
	 *      var kids = [abby, fred, rusty, alois];
	 *      var hasBrownHair = R.propEq('hair', 'brown');
	 *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
	 */
	module.exports = _curry3(function propEq(name, val, obj) {
	  return equals(val, obj[name]);
	});


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var is = __webpack_require__(200);
	
	
	/**
	 * Returns `true` if the specified object property is of the given type;
	 * `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category Type
	 * @sig Type -> String -> Object -> Boolean
	 * @param {Function} type
	 * @param {String} name
	 * @param {*} obj
	 * @return {Boolean}
	 * @see R.is, R.propSatisfies
	 * @example
	 *
	 *      R.propIs(Number, 'x', {x: 1, y: 2});  //=> true
	 *      R.propIs(Number, 'x', {x: 'foo'});    //=> false
	 *      R.propIs(Number, 'x', {});            //=> false
	 */
	module.exports = _curry3(function propIs(type, name, obj) {
	  return is(type, obj[name]);
	});


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var _has = __webpack_require__(40);
	
	
	/**
	 * If the given, non-null object has an own property with the specified name,
	 * returns the value of that property. Otherwise returns the provided default
	 * value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.6.0
	 * @category Object
	 * @sig a -> String -> Object -> a
	 * @param {*} val The default value.
	 * @param {String} p The name of the property to return.
	 * @param {Object} obj The object to query.
	 * @return {*} The value of given property of the supplied object or the default value.
	 * @example
	 *
	 *      var alice = {
	 *        name: 'ALICE',
	 *        age: 101
	 *      };
	 *      var favorite = R.prop('favoriteLibrary');
	 *      var favoriteWithDefault = R.propOr('Ramda', 'favoriteLibrary');
	 *
	 *      favorite(alice);  //=> undefined
	 *      favoriteWithDefault(alice);  //=> 'Ramda'
	 */
	module.exports = _curry3(function propOr(val, p, obj) {
	  return (obj != null && _has(p, obj)) ? obj[p] : val;
	});


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Returns `true` if the specified object property satisfies the given
	 * predicate; `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category Logic
	 * @sig (a -> Boolean) -> String -> {String: a} -> Boolean
	 * @param {Function} pred
	 * @param {String} name
	 * @param {*} obj
	 * @return {Boolean}
	 * @see R.propEq, R.propIs
	 * @example
	 *
	 *      R.propSatisfies(x => x > 0, 'x', {x: 1, y: 2}); //=> true
	 */
	module.exports = _curry3(function propSatisfies(pred, name, obj) {
	  return pred(obj[name]);
	});


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Acts as multiple `prop`: array of keys in, array of values out. Preserves
	 * order.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig [k] -> {k: v} -> [v]
	 * @param {Array} ps The property names to fetch
	 * @param {Object} obj The object to query
	 * @return {Array} The corresponding values or partially applied function.
	 * @example
	 *
	 *      R.props(['x', 'y'], {x: 1, y: 2}); //=> [1, 2]
	 *      R.props(['c', 'a', 'b'], {b: 2, a: 1}); //=> [undefined, 1, 2]
	 *
	 *      var fullName = R.compose(R.join(' '), R.props(['first', 'last']));
	 *      fullName({last: 'Bullet-Tooth', age: 33, first: 'Tony'}); //=> 'Tony Bullet-Tooth'
	 */
	module.exports = _curry2(function props(ps, obj) {
	  var len = ps.length;
	  var out = [];
	  var idx = 0;
	
	  while (idx < len) {
	    out[idx] = obj[ps[idx]];
	    idx += 1;
	  }
	
	  return out;
	});


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _isNumber = __webpack_require__(207);
	
	
	/**
	 * Returns a list of numbers from `from` (inclusive) to `to` (exclusive).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Number -> Number -> [Number]
	 * @param {Number} from The first number in the list.
	 * @param {Number} to One more than the last number in the list.
	 * @return {Array} The list of numbers in tthe set `[a, b)`.
	 * @example
	 *
	 *      R.range(1, 5);    //=> [1, 2, 3, 4]
	 *      R.range(50, 53);  //=> [50, 51, 52]
	 */
	module.exports = _curry2(function range(from, to) {
	  if (!(_isNumber(from) && _isNumber(to))) {
	    throw new TypeError('Both arguments to range must be numbers');
	  }
	  var result = [];
	  var n = from;
	  while (n < to) {
	    result.push(n);
	    n += 1;
	  }
	  return result;
	});


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Returns a single item by iterating through the list, successively calling
	 * the iterator function and passing it an accumulator value and the current
	 * value from the array, and then passing the result to the next call.
	 *
	 * Similar to [`reduce`](#reduce), except moves through the input list from the
	 * right to the left.
	 *
	 * The iterator function receives two values: *(value, acc)*, while the arguments'
	 * order of `reduce`'s iterator function is *(acc, value)*.
	 *
	 * Note: `R.reduceRight` does not skip deleted or unassigned indices (sparse
	 * arrays), unlike the native `Array.prototype.reduceRight` method. For more details
	 * on this behavior, see:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig (a, b -> b) -> b -> [a] -> b
	 * @param {Function} fn The iterator function. Receives two values, the current element from the array
	 *        and the accumulator.
	 * @param {*} acc The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @see R.reduce, R.addIndex
	 * @example
	 *
	 *      R.reduceRight(R.subtract, 0, [1, 2, 3, 4]) // => (1 - (2 - (3 - (4 - 0)))) = -2
	 *          -               -2
	 *         / \              / \
	 *        1   -            1   3
	 *           / \              / \
	 *          2   -     ==>    2  -1
	 *             / \              / \
	 *            3   -            3   4
	 *               / \              / \
	 *              4   0            4   0
	 *
	 * @symb R.reduceRight(f, a, [b, c, d]) = f(b, f(c, f(d, a)))
	 */
	module.exports = _curry3(function reduceRight(fn, acc, list) {
	  var idx = list.length - 1;
	  while (idx >= 0) {
	    acc = fn(list[idx], acc);
	    idx -= 1;
	  }
	  return acc;
	});


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

	var _curryN = __webpack_require__(18);
	var _reduce = __webpack_require__(33);
	var _reduced = __webpack_require__(26);
	
	
	/**
	 * Like [`reduce`](#reduce), `reduceWhile` returns a single item by iterating
	 * through the list, successively calling the iterator function. `reduceWhile`
	 * also takes a predicate that is evaluated before each step. If the predicate
	 * returns `false`, it "short-circuits" the iteration and returns the current
	 * value of the accumulator.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.22.0
	 * @category List
	 * @sig ((a, b) -> Boolean) -> ((a, b) -> a) -> a -> [b] -> a
	 * @param {Function} pred The predicate. It is passed the accumulator and the
	 *        current element.
	 * @param {Function} fn The iterator function. Receives two values, the
	 *        accumulator and the current element.
	 * @param {*} a The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @see R.reduce, R.reduced
	 * @example
	 *
	 *      var isOdd = (acc, x) => x % 2 === 1;
	 *      var xs = [1, 3, 5, 60, 777, 800];
	 *      R.reduceWhile(isOdd, R.add, 0, xs); //=> 9
	 *
	 *      var ys = [2, 4, 6]
	 *      R.reduceWhile(isOdd, R.add, 111, ys); //=> 111
	 */
	module.exports = _curryN(4, [], function _reduceWhile(pred, fn, a, list) {
	  return _reduce(function(acc, x) {
	    return pred(acc, x) ? fn(acc, x) : _reduced(acc);
	  }, a, list);
	});


/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _reduced = __webpack_require__(26);
	
	/**
	 * Returns a value wrapped to indicate that it is the final value of the reduce
	 * and transduce functions. The returned value should be considered a black
	 * box: the internal structure is not guaranteed to be stable.
	 *
	 * Note: this optimization is unavailable to functions not explicitly listed
	 * above. For instance, it is not currently supported by
	 * [`reduceRight`](#reduceRight).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.15.0
	 * @category List
	 * @sig a -> *
	 * @param {*} x The final value of the reduce.
	 * @return {*} The wrapped value.
	 * @see R.reduce, R.transduce
	 * @example
	 *
	 *     R.reduce(
	 *       (acc, item) => item > 3 ? R.reduced(acc) : acc.concat(item),
	 *       [],
	 *       [1, 2, 3, 4, 5]) // [1, 2, 3]
	 */
	
	module.exports = _curry1(_reduced);


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var always = __webpack_require__(7);
	var times = __webpack_require__(273);
	
	
	/**
	 * Returns a fixed list of size `n` containing a specified identical value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.1
	 * @category List
	 * @sig a -> n -> [a]
	 * @param {*} value The value to repeat.
	 * @param {Number} n The desired size of the output list.
	 * @return {Array} A new array containing `n` `value`s.
	 * @see R.times
	 * @example
	 *
	 *      R.repeat('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
	 *
	 *      var obj = {};
	 *      var repeatedObjs = R.repeat(obj, 5); //=> [{}, {}, {}, {}, {}]
	 *      repeatedObjs[0] === repeatedObjs[1]; //=> true
	 * @symb R.repeat(a, 0) = []
	 * @symb R.repeat(a, 1) = [a]
	 * @symb R.repeat(a, 2) = [a, a]
	 */
	module.exports = _curry2(function repeat(value, n) {
	  return times(always(value), n);
	});


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Calls an input function `n` times, returning an array containing the results
	 * of those function calls.
	 *
	 * `fn` is passed one argument: The current value of `n`, which begins at `0`
	 * and is gradually incremented to `n - 1`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.2.3
	 * @category List
	 * @sig (Number -> a) -> Number -> [a]
	 * @param {Function} fn The function to invoke. Passed one argument, the current value of `n`.
	 * @param {Number} n A value between `0` and `n - 1`. Increments after each function call.
	 * @return {Array} An array containing the return values of all calls to `fn`.
	 * @see R.repeat
	 * @example
	 *
	 *      R.times(R.identity, 5); //=> [0, 1, 2, 3, 4]
	 * @symb R.times(f, 0) = []
	 * @symb R.times(f, 1) = [f(0)]
	 * @symb R.times(f, 2) = [f(0), f(1)]
	 */
	module.exports = _curry2(function times(fn, n) {
	  var len = Number(n);
	  var idx = 0;
	  var list;
	
	  if (len < 0 || isNaN(len)) {
	    throw new RangeError('n must be a non-negative number');
	  }
	  list = new Array(len);
	  while (idx < len) {
	    list[idx] = fn(idx);
	    idx += 1;
	  }
	  return list;
	});


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Replace a substring or regex match in a string with a replacement.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.7.0
	 * @category String
	 * @sig RegExp|String -> String -> String -> String
	 * @param {RegExp|String} pattern A regular expression or a substring to match.
	 * @param {String} replacement The string to replace the matches with.
	 * @param {String} str The String to do the search and replacement in.
	 * @return {String} The result.
	 * @example
	 *
	 *      R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
	 *      R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'
	 *
	 *      // Use the "g" (global) flag to replace all occurrences:
	 *      R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
	 */
	module.exports = _curry3(function replace(regex, replacement, str) {
	  return str.replace(regex, replacement);
	});


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Scan is similar to [`reduce`](#reduce), but returns a list of successively
	 * reduced values from the left
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category List
	 * @sig (a,b -> a) -> a -> [b] -> [a]
	 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	 *        current element from the array
	 * @param {*} acc The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {Array} A list of all intermediately reduced values.
	 * @see R.reduce
	 * @example
	 *
	 *      var numbers = [1, 2, 3, 4];
	 *      var factorials = R.scan(R.multiply, 1, numbers); //=> [1, 1, 2, 6, 24]
	 * @symb R.scan(f, a, [b, c]) = [a, f(a, b), f(f(a, b), c)]
	 */
	module.exports = _curry3(function scan(fn, acc, list) {
	  var idx = 0;
	  var len = list.length;
	  var result = [acc];
	  while (idx < len) {
	    acc = fn(acc, list[idx]);
	    result[idx + 1] = acc;
	    idx += 1;
	  }
	  return result;
	});


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var ap = __webpack_require__(48);
	var map = __webpack_require__(31);
	var prepend = __webpack_require__(259);
	var reduceRight = __webpack_require__(269);
	
	
	/**
	 * Transforms a [Traversable](https://github.com/fantasyland/fantasy-land#traversable)
	 * of [Applicative](https://github.com/fantasyland/fantasy-land#applicative) into an
	 * Applicative of Traversable.
	 *
	 * Dispatches to the `sequence` method of the second argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category List
	 * @sig (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
	 * @param {Function} of
	 * @param {*} traversable
	 * @return {*}
	 * @see R.traverse
	 * @example
	 *
	 *      R.sequence(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])
	 *      R.sequence(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
	 *
	 *      R.sequence(R.of, Just([1, 2, 3])); //=> [Just(1), Just(2), Just(3)]
	 *      R.sequence(R.of, Nothing());       //=> [Nothing()]
	 */
	module.exports = _curry2(function sequence(of, traversable) {
	  return typeof traversable.sequence === 'function' ?
	    traversable.sequence(of) :
	    reduceRight(function(x, acc) { return ap(map(prepend, x), acc); },
	                of([]),
	                traversable);
	});


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var always = __webpack_require__(7);
	var over = __webpack_require__(246);
	
	
	/**
	 * Returns the result of "setting" the portion of the given data structure
	 * focused by the given lens to the given value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category Object
	 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	 * @sig Lens s a -> a -> s -> s
	 * @param {Lens} lens
	 * @param {*} v
	 * @param {*} x
	 * @return {*}
	 * @see R.prop, R.lensIndex, R.lensProp
	 * @example
	 *
	 *      var xLens = R.lensProp('x');
	 *
	 *      R.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}
	 *      R.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}
	 */
	module.exports = _curry3(function set(lens, v, x) {
	  return over(lens, always(v), x);
	});


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a copy of the list, sorted according to the comparator function,
	 * which should accept two values at a time and return a negative number if the
	 * first value is smaller, a positive number if it's larger, and zero if they
	 * are equal. Please note that this is a **copy** of the list. It does not
	 * modify the original.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig (a,a -> Number) -> [a] -> [a]
	 * @param {Function} comparator A sorting function :: a -> b -> Int
	 * @param {Array} list The list to sort
	 * @return {Array} a new array with its elements sorted by the comparator function.
	 * @example
	 *
	 *      var diff = function(a, b) { return a - b; };
	 *      R.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]
	 */
	module.exports = _curry2(function sort(comparator, list) {
	  return Array.prototype.slice.call(list, 0).sort(comparator);
	});


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Sorts the list according to the supplied function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig Ord b => (a -> b) -> [a] -> [a]
	 * @param {Function} fn
	 * @param {Array} list The list to sort.
	 * @return {Array} A new list sorted by the keys generated by `fn`.
	 * @example
	 *
	 *      var sortByFirstItem = R.sortBy(R.prop(0));
	 *      var sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));
	 *      var pairs = [[-1, 1], [-2, 2], [-3, 3]];
	 *      sortByFirstItem(pairs); //=> [[-3, 3], [-2, 2], [-1, 1]]
	 *      var alice = {
	 *        name: 'ALICE',
	 *        age: 101
	 *      };
	 *      var bob = {
	 *        name: 'Bob',
	 *        age: -10
	 *      };
	 *      var clara = {
	 *        name: 'clara',
	 *        age: 314.159
	 *      };
	 *      var people = [clara, bob, alice];
	 *      sortByNameCaseInsensitive(people); //=> [alice, bob, clara]
	 */
	module.exports = _curry2(function sortBy(fn, list) {
	  return Array.prototype.slice.call(list, 0).sort(function(a, b) {
	    var aa = fn(a);
	    var bb = fn(b);
	    return aa < bb ? -1 : aa > bb ? 1 : 0;
	  });
	});


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Sorts a list according to a list of comparators.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.23.0
	 * @category Relation
	 * @sig [a -> a -> Number] -> [a] -> [a]
	 * @param {Array} functions A list of comparator functions.
	 * @param {Array} list The list to sort.
	 * @return {Array} A new list sorted according to the comarator functions.
	 * @example
	 *
	 *      var alice = {
	 *        name: 'alice',
	 *        age: 40
	 *      };
	 *      var bob = {
	 *        name: 'bob',
	 *        age: 30
	 *      };
	 *      var clara = {
	 *        name: 'clara',
	 *        age: 40
	 *      };
	 *      var people = [clara, bob, alice];
	 *      var ageNameSort = R.sortWith([
	 *        R.descend(R.prop('age')),
	 *        R.ascend(R.prop('name'))
	 *      ]);
	 *      ageNameSort(people); //=> [alice, clara, bob]
	 */
	module.exports = _curry2(function sortWith(fns, list) {
	  return Array.prototype.slice.call(list, 0).sort(function(a, b) {
	    var result = 0;
	    var i = 0;
	    while (result === 0 && i < fns.length) {
	      result = fns[i](a, b);
	      i += 1;
	    }
	    return result;
	  });
	});


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

	var invoker = __webpack_require__(199);
	
	
	/**
	 * Splits a string into an array of strings based on the given
	 * separator.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category String
	 * @sig (String | RegExp) -> String -> [String]
	 * @param {String|RegExp} sep The pattern.
	 * @param {String} str The string to separate into an array.
	 * @return {Array} The array of strings from `str` separated by `str`.
	 * @see R.join
	 * @example
	 *
	 *      var pathComponents = R.split('/');
	 *      R.tail(pathComponents('/usr/local/bin/node')); //=> ['usr', 'local', 'bin', 'node']
	 *
	 *      R.split('.', 'a.b.c.xyz.d'); //=> ['a', 'b', 'c', 'xyz', 'd']
	 */
	module.exports = invoker(1, 'split');


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var length = __webpack_require__(206);
	var slice = __webpack_require__(87);
	
	
	/**
	 * Splits a given list or string at a given index.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category List
	 * @sig Number -> [a] -> [[a], [a]]
	 * @sig Number -> String -> [String, String]
	 * @param {Number} index The index where the array/string is split.
	 * @param {Array|String} array The array/string to be split.
	 * @return {Array}
	 * @example
	 *
	 *      R.splitAt(1, [1, 2, 3]);          //=> [[1], [2, 3]]
	 *      R.splitAt(5, 'hello world');      //=> ['hello', ' world']
	 *      R.splitAt(-1, 'foobar');          //=> ['fooba', 'r']
	 */
	module.exports = _curry2(function splitAt(index, array) {
	  return [slice(0, index, array), slice(index, length(array), array)];
	});


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var slice = __webpack_require__(87);
	
	
	/**
	 * Splits a collection into slices of the specified length.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category List
	 * @sig Number -> [a] -> [[a]]
	 * @sig Number -> String -> [String]
	 * @param {Number} n
	 * @param {Array} list
	 * @return {Array}
	 * @example
	 *
	 *      R.splitEvery(3, [1, 2, 3, 4, 5, 6, 7]); //=> [[1, 2, 3], [4, 5, 6], [7]]
	 *      R.splitEvery(3, 'foobarbaz'); //=> ['foo', 'bar', 'baz']
	 */
	module.exports = _curry2(function splitEvery(n, list) {
	  if (n <= 0) {
	    throw new Error('First argument to splitEvery must be a positive integer');
	  }
	  var result = [];
	  var idx = 0;
	  while (idx < list.length) {
	    result.push(slice(idx, idx += n, list));
	  }
	  return result;
	});


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Takes a list and a predicate and returns a pair of lists with the following properties:
	 *
	 *  - the result of concatenating the two output lists is equivalent to the input list;
	 *  - none of the elements of the first output list satisfies the predicate; and
	 *  - if the second output list is non-empty, its first element satisfies the predicate.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [[a], [a]]
	 * @param {Function} pred The predicate that determines where the array is split.
	 * @param {Array} list The array to be split.
	 * @return {Array}
	 * @example
	 *
	 *      R.splitWhen(R.equals(2), [1, 2, 3, 1, 2, 3]);   //=> [[1], [2, 3, 1, 2, 3]]
	 */
	module.exports = _curry2(function splitWhen(pred, list) {
	  var idx = 0;
	  var len = list.length;
	  var prefix = [];
	
	  while (idx < len && !pred(list[idx])) {
	    prefix.push(list[idx]);
	    idx += 1;
	  }
	
	  return [prefix, Array.prototype.slice.call(list, idx)];
	});


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var equals = __webpack_require__(98);
	var take = __webpack_require__(134);
	
	/**
	 * Checks if a list starts with the provided values
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category List
	 * @sig [a] -> Boolean
	 * @sig String -> Boolean
	 * @param {*} prefix
	 * @param {*} list
	 * @return {Boolean}
	 * @example
	 *
	 *      R.startsWith('a', 'abc')                //=> true
	 *      R.startsWith('b', 'abc')                //=> false
	 *      R.startsWith(['a'], ['a', 'b', 'c'])    //=> true
	 *      R.startsWith(['b'], ['a', 'b', 'c'])    //=> false
	 */
	module.exports = _curry2(function(prefix, list) {
	  return equals(take(prefix.length, list), prefix);
	});


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Subtracts its second argument from its first argument.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Math
	 * @sig Number -> Number -> Number
	 * @param {Number} a The first value.
	 * @param {Number} b The second value.
	 * @return {Number} The result of `a - b`.
	 * @see R.add
	 * @example
	 *
	 *      R.subtract(10, 8); //=> 2
	 *
	 *      var minus5 = R.subtract(R.__, 5);
	 *      minus5(17); //=> 12
	 *
	 *      var complementaryAngle = R.subtract(90);
	 *      complementaryAngle(30); //=> 60
	 *      complementaryAngle(72); //=> 18
	 */
	module.exports = _curry2(function subtract(a, b) {
	  return Number(a) - Number(b);
	});


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var concat = __webpack_require__(93);
	var difference = __webpack_require__(122);
	
	
	/**
	 * Finds the set (i.e. no duplicates) of all elements contained in the first or
	 * second list, but not both.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category Relation
	 * @sig [*] -> [*] -> [*]
	 * @param {Array} list1 The first list.
	 * @param {Array} list2 The second list.
	 * @return {Array} The elements in `list1` or `list2`, but not both.
	 * @see R.symmetricDifferenceWith, R.difference, R.differenceWith
	 * @example
	 *
	 *      R.symmetricDifference([1,2,3,4], [7,6,5,4,3]); //=> [1,2,7,6,5]
	 *      R.symmetricDifference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5,1,2]
	 */
	module.exports = _curry2(function symmetricDifference(list1, list2) {
	  return concat(difference(list1, list2), difference(list2, list1));
	});


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var concat = __webpack_require__(93);
	var differenceWith = __webpack_require__(123);
	
	
	/**
	 * Finds the set (i.e. no duplicates) of all elements contained in the first or
	 * second list, but not both. Duplication is determined according to the value
	 * returned by applying the supplied predicate to two list elements.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category Relation
	 * @sig ((a, a) -> Boolean) -> [a] -> [a] -> [a]
	 * @param {Function} pred A predicate used to test whether two items are equal.
	 * @param {Array} list1 The first list.
	 * @param {Array} list2 The second list.
	 * @return {Array} The elements in `list1` or `list2`, but not both.
	 * @see R.symmetricDifference, R.difference, R.differenceWith
	 * @example
	 *
	 *      var eqA = R.eqBy(R.prop('a'));
	 *      var l1 = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
	 *      var l2 = [{a: 3}, {a: 4}, {a: 5}, {a: 6}];
	 *      R.symmetricDifferenceWith(eqA, l1, l2); //=> [{a: 1}, {a: 2}, {a: 5}, {a: 6}]
	 */
	module.exports = _curry3(function symmetricDifferenceWith(pred, list1, list2) {
	  return concat(differenceWith(pred, list1, list2), differenceWith(pred, list2, list1));
	});


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a new list containing the last `n` elements of a given list, passing
	 * each value to the supplied predicate function, and terminating when the
	 * predicate function returns `false`. Excludes the element that caused the
	 * predicate function to fail. The predicate function is passed one argument:
	 * *(value)*.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [a]
	 * @param {Function} fn The function called per iteration.
	 * @param {Array} list The collection to iterate over.
	 * @return {Array} A new array.
	 * @see R.dropLastWhile, R.addIndex
	 * @example
	 *
	 *      var isNotOne = x => x !== 1;
	 *
	 *      R.takeLastWhile(isNotOne, [1, 2, 3, 4]); //=> [2, 3, 4]
	 */
	module.exports = _curry2(function takeLastWhile(fn, list) {
	  var idx = list.length - 1;
	  while (idx >= 0 && fn(list[idx])) {
	    idx -= 1;
	  }
	  return Array.prototype.slice.call(list, idx + 1);
	});


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _dispatchable = __webpack_require__(22);
	var _xtakeWhile = __webpack_require__(291);
	
	
	/**
	 * Returns a new list containing the first `n` elements of a given list,
	 * passing each value to the supplied predicate function, and terminating when
	 * the predicate function returns `false`. Excludes the element that caused the
	 * predicate function to fail. The predicate function is passed one argument:
	 * *(value)*.
	 *
	 * Dispatches to the `takeWhile` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [a]
	 * @param {Function} fn The function called per iteration.
	 * @param {Array} list The collection to iterate over.
	 * @return {Array} A new array.
	 * @see R.dropWhile, R.transduce, R.addIndex
	 * @example
	 *
	 *      var isNotFour = x => x !== 4;
	 *
	 *      R.takeWhile(isNotFour, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3]
	 */
	module.exports = _curry2(_dispatchable(['takeWhile'], _xtakeWhile, function takeWhile(fn, list) {
	  var idx = 0;
	  var len = list.length;
	  while (idx < len && fn(list[idx])) {
	    idx += 1;
	  }
	  return Array.prototype.slice.call(list, 0, idx);
	}));


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _reduced = __webpack_require__(26);
	var _xfBase = __webpack_require__(27);
	
	
	module.exports = (function() {
	  function XTakeWhile(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }
	  XTakeWhile.prototype['@@transducer/init'] = _xfBase.init;
	  XTakeWhile.prototype['@@transducer/result'] = _xfBase.result;
	  XTakeWhile.prototype['@@transducer/step'] = function(result, input) {
	    return this.f(input) ? this.xf['@@transducer/step'](result, input) : _reduced(result);
	  };
	
	  return _curry2(function _xtakeWhile(f, xf) { return new XTakeWhile(f, xf); });
	}());


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Runs the given function with the supplied object, then returns the object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (a -> *) -> a -> a
	 * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
	 * @param {*} x
	 * @return {*} `x`.
	 * @example
	 *
	 *      var sayX = x => console.log('x is ' + x);
	 *      R.tap(sayX, 100); //=> 100
	 *      // logs 'x is 100'
	 * @symb R.tap(f, a) = a
	 */
	module.exports = _curry2(function tap(fn, x) {
	  fn(x);
	  return x;
	});


/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

	var _cloneRegExp = __webpack_require__(77);
	var _curry2 = __webpack_require__(13);
	var _isRegExp = __webpack_require__(294);
	var toString = __webpack_require__(94);
	
	
	/**
	 * Determines whether a given string matches a given regular expression.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.12.0
	 * @category String
	 * @sig RegExp -> String -> Boolean
	 * @param {RegExp} pattern
	 * @param {String} str
	 * @return {Boolean}
	 * @see R.match
	 * @example
	 *
	 *      R.test(/^x/, 'xyz'); //=> true
	 *      R.test(/^y/, 'xyz'); //=> false
	 */
	module.exports = _curry2(function test(pattern, str) {
	  if (!_isRegExp(pattern)) {
	    throw new TypeError('‘test’ requires a value of type RegExp as its first argument; received ' + toString(pattern));
	  }
	  return _cloneRegExp(pattern).test(str);
	});


/***/ }),
/* 294 */
/***/ (function(module, exports) {

	module.exports = function _isRegExp(x) {
	  return Object.prototype.toString.call(x) === '[object RegExp]';
	};


/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

	var invoker = __webpack_require__(199);
	
	
	/**
	 * The lower case version of a string.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category String
	 * @sig String -> String
	 * @param {String} str The string to lower case.
	 * @return {String} The lower case version of `str`.
	 * @see R.toUpper
	 * @example
	 *
	 *      R.toLower('XYZ'); //=> 'xyz'
	 */
	module.exports = invoker(0, 'toLowerCase');


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var _has = __webpack_require__(40);
	
	
	/**
	 * Converts an object into an array of key, value arrays. Only the object's
	 * own properties are used.
	 * Note that the order of the output array is not guaranteed to be consistent
	 * across different JS platforms.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.4.0
	 * @category Object
	 * @sig {String: *} -> [[String,*]]
	 * @param {Object} obj The object to extract from
	 * @return {Array} An array of key, value arrays from the object's own properties.
	 * @see R.fromPairs
	 * @example
	 *
	 *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
	 */
	module.exports = _curry1(function toPairs(obj) {
	  var pairs = [];
	  for (var prop in obj) {
	    if (_has(prop, obj)) {
	      pairs[pairs.length] = [prop, obj[prop]];
	    }
	  }
	  return pairs;
	});


/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Converts an object into an array of key, value arrays. The object's own
	 * properties and prototype properties are used. Note that the order of the
	 * output array is not guaranteed to be consistent across different JS
	 * platforms.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.4.0
	 * @category Object
	 * @sig {String: *} -> [[String,*]]
	 * @param {Object} obj The object to extract from
	 * @return {Array} An array of key, value arrays from the object's own
	 *         and prototype properties.
	 * @example
	 *
	 *      var F = function() { this.x = 'X'; };
	 *      F.prototype.y = 'Y';
	 *      var f = new F();
	 *      R.toPairsIn(f); //=> [['x','X'], ['y','Y']]
	 */
	module.exports = _curry1(function toPairsIn(obj) {
	  var pairs = [];
	  for (var prop in obj) {
	    pairs[pairs.length] = [prop, obj[prop]];
	  }
	  return pairs;
	});


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

	var invoker = __webpack_require__(199);
	
	
	/**
	 * The upper case version of a string.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.9.0
	 * @category String
	 * @sig String -> String
	 * @param {String} str The string to upper case.
	 * @return {String} The upper case version of `str`.
	 * @see R.toLower
	 * @example
	 *
	 *      R.toUpper('abc'); //=> 'ABC'
	 */
	module.exports = invoker(0, 'toUpperCase');


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

	var _reduce = __webpack_require__(33);
	var _xwrap = __webpack_require__(36);
	var curryN = __webpack_require__(16);
	
	
	/**
	 * Initializes a transducer using supplied iterator function. Returns a single
	 * item by iterating through the list, successively calling the transformed
	 * iterator function and passing it an accumulator value and the current value
	 * from the array, and then passing the result to the next call.
	 *
	 * The iterator function receives two values: *(acc, value)*. It will be
	 * wrapped as a transformer to initialize the transducer. A transformer can be
	 * passed directly in place of an iterator function. In both cases, iteration
	 * may be stopped early with the [`R.reduced`](#reduced) function.
	 *
	 * A transducer is a function that accepts a transformer and returns a
	 * transformer and can be composed directly.
	 *
	 * A transformer is an an object that provides a 2-arity reducing iterator
	 * function, step, 0-arity initial value function, init, and 1-arity result
	 * extraction function, result. The step function is used as the iterator
	 * function in reduce. The result function is used to convert the final
	 * accumulator into the return type and in most cases is
	 * [`R.identity`](#identity). The init function can be used to provide an
	 * initial accumulator, but is ignored by transduce.
	 *
	 * The iteration is performed with [`R.reduce`](#reduce) after initializing the transducer.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.12.0
	 * @category List
	 * @sig (c -> c) -> ((a, b) -> a) -> a -> [b] -> a
	 * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
	 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	 *        current element from the array. Wrapped as transformer, if necessary, and used to
	 *        initialize the transducer
	 * @param {*} acc The initial accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @see R.reduce, R.reduced, R.into
	 * @example
	 *
	 *      var numbers = [1, 2, 3, 4];
	 *      var transducer = R.compose(R.map(R.add(1)), R.take(2));
	 *      R.transduce(transducer, R.flip(R.append), [], numbers); //=> [2, 3]
	 *
	 *      var isOdd = (x) => x % 2 === 1;
	 *      var firstOddTransducer = R.compose(R.filter(isOdd), R.take(1));
	 *      R.transduce(firstOddTransducer, R.flip(R.append), [], R.range(0, 100)); //=> [1]
	 */
	module.exports = curryN(4, function transduce(xf, fn, acc, list) {
	  return _reduce(xf(typeof fn === 'function' ? _xwrap(fn) : fn), acc, list);
	});


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Transposes the rows and columns of a 2D list.
	 * When passed a list of `n` lists of length `x`,
	 * returns a list of `x` lists of length `n`.
	 *
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category List
	 * @sig [[a]] -> [[a]]
	 * @param {Array} list A 2D list
	 * @return {Array} A 2D list
	 * @example
	 *
	 *      R.transpose([[1, 'a'], [2, 'b'], [3, 'c']]) //=> [[1, 2, 3], ['a', 'b', 'c']]
	 *      R.transpose([[1, 2, 3], ['a', 'b', 'c']]) //=> [[1, 'a'], [2, 'b'], [3, 'c']]
	 *
	 *      // If some of the rows are shorter than the following rows, their elements are skipped:
	 *      R.transpose([[10, 11], [20], [], [30, 31, 32]]) //=> [[10, 20, 30], [11, 31], [32]]
	 * @symb R.transpose([[a], [b], [c]]) = [a, b, c]
	 * @symb R.transpose([[a, b], [c, d]]) = [[a, c], [b, d]]
	 * @symb R.transpose([[a, b], [c]]) = [[a, c], [b]]
	 */
	module.exports = _curry1(function transpose(outerlist) {
	  var i = 0;
	  var result = [];
	  while (i < outerlist.length) {
	    var innerlist = outerlist[i];
	    var j = 0;
	    while (j < innerlist.length) {
	      if (typeof result[j] === 'undefined') {
	        result[j] = [];
	      }
	      result[j].push(innerlist[j]);
	      j += 1;
	    }
	    i += 1;
	  }
	  return result;
	});


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	var map = __webpack_require__(31);
	var sequence = __webpack_require__(276);
	
	
	/**
	 * Maps an [Applicative](https://github.com/fantasyland/fantasy-land#applicative)-returning
	 * function over a [Traversable](https://github.com/fantasyland/fantasy-land#traversable),
	 * then uses [`sequence`](#sequence) to transform the resulting Traversable of Applicative
	 * into an Applicative of Traversable.
	 *
	 * Dispatches to the `sequence` method of the third argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category List
	 * @sig (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
	 * @param {Function} of
	 * @param {Function} f
	 * @param {*} traversable
	 * @return {*}
	 * @see R.sequence
	 * @example
	 *
	 *      // Returns `Nothing` if the given divisor is `0`
	 *      safeDiv = n => d => d === 0 ? Nothing() : Just(n / d)
	 *
	 *      R.traverse(Maybe.of, safeDiv(10), [2, 4, 5]); //=> Just([5, 2.5, 2])
	 *      R.traverse(Maybe.of, safeDiv(10), [2, 0, 5]); //=> Nothing
	 */
	module.exports = _curry3(function traverse(of, f, traversable) {
	  return typeof traversable['fantasy-land/traverse'] === 'function' ?
	    traversable['fantasy-land/traverse'](f, of) :
	    sequence(of, map(f, traversable));
	});


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Removes (strips) whitespace from both ends of the string.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.6.0
	 * @category String
	 * @sig String -> String
	 * @param {String} str The string to trim.
	 * @return {String} Trimmed version of `str`.
	 * @example
	 *
	 *      R.trim('   xyz  '); //=> 'xyz'
	 *      R.map(R.trim, R.split(',', 'x, y, z')); //=> ['x', 'y', 'z']
	 */
	module.exports = (function() {
	  var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	           '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
	           '\u2029\uFEFF';
	  var zeroWidth = '\u200b';
	  var hasProtoTrim = (typeof String.prototype.trim === 'function');
	  if (!hasProtoTrim || (ws.trim() || !zeroWidth.trim())) {
	    return _curry1(function trim(str) {
	      var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
	      var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
	      return str.replace(beginRx, '').replace(endRx, '');
	    });
	  } else {
	    return _curry1(function trim(str) {
	      return str.trim();
	    });
	  }
	}());


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(17);
	var _concat = __webpack_require__(15);
	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * `tryCatch` takes two functions, a `tryer` and a `catcher`. The returned
	 * function evaluates the `tryer`; if it does not throw, it simply returns the
	 * result. If the `tryer` *does* throw, the returned function evaluates the
	 * `catcher` function and returns its result. Note that for effective
	 * composition with this function, both the `tryer` and `catcher` functions
	 * must return the same type of results.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.20.0
	 * @category Function
	 * @sig (...x -> a) -> ((e, ...x) -> a) -> (...x -> a)
	 * @param {Function} tryer The function that may throw.
	 * @param {Function} catcher The function that will be evaluated if `tryer` throws.
	 * @return {Function} A new function that will catch exceptions and send then to the catcher.
	 * @example
	 *
	 *      R.tryCatch(R.prop('x'), R.F)({x: true}); //=> true
	 *      R.tryCatch(R.prop('x'), R.F)(null);      //=> false
	 */
	module.exports = _curry2(function _tryCatch(tryer, catcher) {
	  return _arity(tryer.length, function() {
	    try {
	      return tryer.apply(this, arguments);
	    } catch (e) {
	      return catcher.apply(this, _concat([e], arguments));
	    }
	  });
	});


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Takes a function `fn`, which takes a single array argument, and returns a
	 * function which:
	 *
	 *   - takes any number of positional arguments;
	 *   - passes these arguments to `fn` as an array; and
	 *   - returns the result.
	 *
	 * In other words, `R.unapply` derives a variadic function from a function which
	 * takes an array. `R.unapply` is the inverse of [`R.apply`](#apply).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Function
	 * @sig ([*...] -> a) -> (*... -> a)
	 * @param {Function} fn
	 * @return {Function}
	 * @see R.apply
	 * @example
	 *
	 *      R.unapply(JSON.stringify)(1, 2, 3); //=> '[1,2,3]'
	 * @symb R.unapply(f)(a, b) = f([a, b])
	 */
	module.exports = _curry1(function unapply(fn) {
	  return function() {
	    return fn(Array.prototype.slice.call(arguments, 0));
	  };
	});


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	var nAry = __webpack_require__(62);
	
	
	/**
	 * Wraps a function of any arity (including nullary) in a function that accepts
	 * exactly 1 parameter. Any extraneous parameters will not be passed to the
	 * supplied function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.2.0
	 * @category Function
	 * @sig (* -> b) -> (a -> b)
	 * @param {Function} fn The function to wrap.
	 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
	 *         arity 1.
	 * @see R.binary, R.nAry
	 * @example
	 *
	 *      var takesTwoArgs = function(a, b) {
	 *        return [a, b];
	 *      };
	 *      takesTwoArgs.length; //=> 2
	 *      takesTwoArgs(1, 2); //=> [1, 2]
	 *
	 *      var takesOneArg = R.unary(takesTwoArgs);
	 *      takesOneArg.length; //=> 1
	 *      // Only 1 argument is passed to the wrapped function
	 *      takesOneArg(1, 2); //=> [1, undefined]
	 * @symb R.unary(f)(a, b, c) = f(a)
	 */
	module.exports = _curry1(function unary(fn) {
	  return nAry(1, fn);
	});


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var curryN = __webpack_require__(16);
	
	
	/**
	 * Returns a function of arity `n` from a (manually) curried function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category Function
	 * @sig Number -> (a -> b) -> (a -> c)
	 * @param {Number} length The arity for the returned function.
	 * @param {Function} fn The function to uncurry.
	 * @return {Function} A new function.
	 * @see R.curry
	 * @example
	 *
	 *      var addFour = a => b => c => d => a + b + c + d;
	 *
	 *      var uncurriedAddFour = R.uncurryN(4, addFour);
	 *      uncurriedAddFour(1, 2, 3, 4); //=> 10
	 */
	module.exports = _curry2(function uncurryN(depth, fn) {
	  return curryN(depth, function() {
	    var currentDepth = 1;
	    var value = fn;
	    var idx = 0;
	    var endIdx;
	    while (currentDepth <= depth && typeof value === 'function') {
	      endIdx = currentDepth === depth ? arguments.length : idx + value.length;
	      value = value.apply(this, Array.prototype.slice.call(arguments, idx, endIdx));
	      currentDepth += 1;
	      idx = endIdx;
	    }
	    return value;
	  });
	});


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Builds a list from a seed value. Accepts an iterator function, which returns
	 * either false to stop iteration or an array of length 2 containing the value
	 * to add to the resulting list and the seed to be used in the next call to the
	 * iterator function.
	 *
	 * The iterator function receives one argument: *(seed)*.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category List
	 * @sig (a -> [b]) -> * -> [b]
	 * @param {Function} fn The iterator function. receives one argument, `seed`, and returns
	 *        either false to quit iteration or an array of length two to proceed. The element
	 *        at index 0 of this array will be added to the resulting array, and the element
	 *        at index 1 will be passed to the next call to `fn`.
	 * @param {*} seed The seed value.
	 * @return {Array} The final list.
	 * @example
	 *
	 *      var f = n => n > 50 ? false : [-n, n + 10];
	 *      R.unfold(f, 10); //=> [-10, -20, -30, -40, -50]
	 * @symb R.unfold(f, x) = [f(x)[0], f(f(x)[1])[0], f(f(f(x)[1])[1])[0], ...]
	 */
	module.exports = _curry2(function unfold(fn, seed) {
	  var pair = fn(seed);
	  var result = [];
	  while (pair && pair.length) {
	    result[result.length] = pair[0];
	    pair = fn(pair[1]);
	  }
	  return result;
	});


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(15);
	var _curry2 = __webpack_require__(13);
	var compose = __webpack_require__(82);
	var uniq = __webpack_require__(186);
	
	
	/**
	 * Combines two lists into a set (i.e. no duplicates) composed of the elements
	 * of each list.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig [*] -> [*] -> [*]
	 * @param {Array} as The first list.
	 * @param {Array} bs The second list.
	 * @return {Array} The first and second lists concatenated, with
	 *         duplicates removed.
	 * @example
	 *
	 *      R.union([1, 2, 3], [2, 3, 4]); //=> [1, 2, 3, 4]
	 */
	module.exports = _curry2(compose(uniq, _concat));


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(15);
	var _curry3 = __webpack_require__(20);
	var uniqWith = __webpack_require__(190);
	
	
	/**
	 * Combines two lists into a set (i.e. no duplicates) composed of the elements
	 * of each list. Duplication is determined according to the value returned by
	 * applying the supplied predicate to two list elements.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Relation
	 * @sig (a -> a -> Boolean) -> [*] -> [*] -> [*]
	 * @param {Function} pred A predicate used to test whether two items are equal.
	 * @param {Array} list1 The first list.
	 * @param {Array} list2 The second list.
	 * @return {Array} The first and second lists concatenated, with
	 *         duplicates removed.
	 * @see R.union
	 * @example
	 *
	 *      var l1 = [{a: 1}, {a: 2}];
	 *      var l2 = [{a: 1}, {a: 4}];
	 *      R.unionWith(R.eqBy(R.prop('a')), l1, l2); //=> [{a: 1}, {a: 2}, {a: 4}]
	 */
	module.exports = _curry3(function unionWith(pred, list1, list2) {
	  return uniqWith(pred, _concat(list1, list2));
	});


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Tests the final argument by passing it to the given predicate function. If
	 * the predicate is not satisfied, the function will return the result of
	 * calling the `whenFalseFn` function with the same argument. If the predicate
	 * is satisfied, the argument is returned as is.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.18.0
	 * @category Logic
	 * @sig (a -> Boolean) -> (a -> a) -> a -> a
	 * @param {Function} pred        A predicate function
	 * @param {Function} whenFalseFn A function to invoke when the `pred` evaluates
	 *                               to a falsy value.
	 * @param {*}        x           An object to test with the `pred` function and
	 *                               pass to `whenFalseFn` if necessary.
	 * @return {*} Either `x` or the result of applying `x` to `whenFalseFn`.
	 * @see R.ifElse, R.when
	 * @example
	 *
	 *      let safeInc = R.unless(R.isNil, R.inc);
	 *      safeInc(null); //=> null
	 *      safeInc(1); //=> 2
	 */
	module.exports = _curry3(function unless(pred, whenFalseFn, x) {
	  return pred(x) ? x : whenFalseFn(x);
	});


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

	var _identity = __webpack_require__(176);
	var chain = __webpack_require__(69);
	
	
	/**
	 * Shorthand for `R.chain(R.identity)`, which removes one level of nesting from
	 * any [Chain](https://github.com/fantasyland/fantasy-land#chain).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category List
	 * @sig Chain c => c (c a) -> c a
	 * @param {*} list
	 * @return {*}
	 * @see R.flatten, R.chain
	 * @example
	 *
	 *      R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]
	 *      R.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]
	 */
	module.exports = chain(_identity);


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Takes a predicate, a transformation function, and an initial value,
	 * and returns a value of the same type as the initial value.
	 * It does so by applying the transformation until the predicate is satisfied,
	 * at which point it returns the satisfactory value.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.20.0
	 * @category Logic
	 * @sig (a -> Boolean) -> (a -> a) -> a -> a
	 * @param {Function} pred A predicate function
	 * @param {Function} fn The iterator function
	 * @param {*} init Initial value
	 * @return {*} Final value that satisfies predicate
	 * @example
	 *
	 *      R.until(R.gt(R.__, 100), R.multiply(2))(1) // => 128
	 */
	module.exports = _curry3(function until(pred, fn, init) {
	  var val = init;
	  while (!pred(val)) {
	    val = fn(val);
	  }
	  return val;
	});


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(8);
	
	
	/**
	 * Returns a list of all the properties, including prototype properties, of the
	 * supplied object.
	 * Note that the order of the output array is not guaranteed to be consistent
	 * across different JS platforms.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.2.0
	 * @category Object
	 * @sig {k: v} -> [v]
	 * @param {Object} obj The object to extract values from
	 * @return {Array} An array of the values of the object's own and prototype properties.
	 * @see R.values, R.keysIn
	 * @example
	 *
	 *      var F = function() { this.x = 'X'; };
	 *      F.prototype.y = 'Y';
	 *      var f = new F();
	 *      R.valuesIn(f); //=> ['X', 'Y']
	 */
	module.exports = _curry1(function valuesIn(obj) {
	  var prop;
	  var vs = [];
	  for (prop in obj) {
	    vs[vs.length] = obj[prop];
	  }
	  return vs;
	});


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Returns a "view" of the given data structure, determined by the given lens.
	 * The lens's focus determines which portion of the data structure is visible.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category Object
	 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	 * @sig Lens s a -> s -> a
	 * @param {Lens} lens
	 * @param {*} x
	 * @return {*}
	 * @see R.prop, R.lensIndex, R.lensProp
	 * @example
	 *
	 *      var xLens = R.lensProp('x');
	 *
	 *      R.view(xLens, {x: 1, y: 2});  //=> 1
	 *      R.view(xLens, {x: 4, y: 2});  //=> 4
	 */
	module.exports = (function() {
	  // `Const` is a functor that effectively ignores the function given to `map`.
	  var Const = function(x) {
	    return {value: x, 'fantasy-land/map': function() { return this; }};
	  };
	
	  return _curry2(function view(lens, x) {
	    // Using `Const` effectively ignores the setter function of the `lens`,
	    // leaving the value returned by the getter function unmodified.
	    return lens(Const)(x).value;
	  });
	}());


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Tests the final argument by passing it to the given predicate function. If
	 * the predicate is satisfied, the function will return the result of calling
	 * the `whenTrueFn` function with the same argument. If the predicate is not
	 * satisfied, the argument is returned as is.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.18.0
	 * @category Logic
	 * @sig (a -> Boolean) -> (a -> a) -> a -> a
	 * @param {Function} pred       A predicate function
	 * @param {Function} whenTrueFn A function to invoke when the `condition`
	 *                              evaluates to a truthy value.
	 * @param {*}        x          An object to test with the `pred` function and
	 *                              pass to `whenTrueFn` if necessary.
	 * @return {*} Either `x` or the result of applying `x` to `whenTrueFn`.
	 * @see R.ifElse, R.unless
	 * @example
	 *
	 *      // truncate :: String -> String
	 *      var truncate = R.when(
	 *        R.propSatisfies(R.gt(R.__, 10), 'length'),
	 *        R.pipe(R.take(10), R.append('…'), R.join(''))
	 *      );
	 *      truncate('12345');         //=> '12345'
	 *      truncate('0123456789ABC'); //=> '0123456789…'
	 */
	module.exports = _curry3(function when(pred, whenTrueFn, x) {
	  return pred(x) ? whenTrueFn(x) : x;
	});


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var _has = __webpack_require__(40);
	
	
	/**
	 * Takes a spec object and a test object; returns true if the test satisfies
	 * the spec. Each of the spec's own properties must be a predicate function.
	 * Each predicate is applied to the value of the corresponding property of the
	 * test object. `where` returns true if all the predicates return true, false
	 * otherwise.
	 *
	 * `where` is well suited to declaratively expressing constraints for other
	 * functions such as [`filter`](#filter) and [`find`](#find).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.1
	 * @category Object
	 * @sig {String: (* -> Boolean)} -> {String: *} -> Boolean
	 * @param {Object} spec
	 * @param {Object} testObj
	 * @return {Boolean}
	 * @example
	 *
	 *      // pred :: Object -> Boolean
	 *      var pred = R.where({
	 *        a: R.equals('foo'),
	 *        b: R.complement(R.equals('bar')),
	 *        x: R.gt(R.__, 10),
	 *        y: R.lt(R.__, 20)
	 *      });
	 *
	 *      pred({a: 'foo', b: 'xxx', x: 11, y: 19}); //=> true
	 *      pred({a: 'xxx', b: 'xxx', x: 11, y: 19}); //=> false
	 *      pred({a: 'foo', b: 'bar', x: 11, y: 19}); //=> false
	 *      pred({a: 'foo', b: 'xxx', x: 10, y: 19}); //=> false
	 *      pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> false
	 */
	module.exports = _curry2(function where(spec, testObj) {
	  for (var prop in spec) {
	    if (_has(prop, spec) && !spec[prop](testObj[prop])) {
	      return false;
	    }
	  }
	  return true;
	});


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	var equals = __webpack_require__(98);
	var map = __webpack_require__(31);
	var where = __webpack_require__(316);
	
	
	/**
	 * Takes a spec object and a test object; returns true if the test satisfies
	 * the spec, false otherwise. An object satisfies the spec if, for each of the
	 * spec's own properties, accessing that property of the object gives the same
	 * value (in [`R.equals`](#equals) terms) as accessing that property of the
	 * spec.
	 *
	 * `whereEq` is a specialization of [`where`](#where).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.14.0
	 * @category Object
	 * @sig {String: *} -> {String: *} -> Boolean
	 * @param {Object} spec
	 * @param {Object} testObj
	 * @return {Boolean}
	 * @see R.where
	 * @example
	 *
	 *      // pred :: Object -> Boolean
	 *      var pred = R.whereEq({a: 1, b: 2});
	 *
	 *      pred({a: 1});              //=> false
	 *      pred({a: 1, b: 2});        //=> true
	 *      pred({a: 1, b: 2, c: 3});  //=> true
	 *      pred({a: 1, b: 1});        //=> false
	 */
	module.exports = _curry2(function whereEq(spec, testObj) {
	  return where(map(equals, spec), testObj);
	});


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

	var _contains = __webpack_require__(96);
	var _curry2 = __webpack_require__(13);
	var flip = __webpack_require__(164);
	var reject = __webpack_require__(105);
	
	
	/**
	 * Returns a new list without values in the first argument.
	 * [`R.equals`](#equals) is used to determine equality.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category List
	 * @sig [a] -> [a] -> [a]
	 * @param {Array} list1 The values to be removed from `list2`.
	 * @param {Array} list2 The array to remove values from.
	 * @return {Array} The new array without values in `list1`.
	 * @see R.transduce, R.difference
	 * @example
	 *
	 *      R.without([1, 2], [1, 2, 1, 3, 4]); //=> [3, 4]
	 */
	module.exports = _curry2(function(xs, list) {
	  return reject(flip(_contains)(xs), list);
	});


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Creates a new list out of the two supplied by creating each possible pair
	 * from the lists.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [b] -> [[a,b]]
	 * @param {Array} as The first list.
	 * @param {Array} bs The second list.
	 * @return {Array} The list made by combining each possible pair from
	 *         `as` and `bs` into pairs (`[a, b]`).
	 * @example
	 *
	 *      R.xprod([1, 2], ['a', 'b']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
	 * @symb R.xprod([a, b], [c, d]) = [[a, c], [a, d], [b, c], [b, d]]
	 */
	module.exports = _curry2(function xprod(a, b) { // = xprodWith(prepend); (takes about 3 times as long...)
	  var idx = 0;
	  var ilen = a.length;
	  var j;
	  var jlen = b.length;
	  var result = [];
	  while (idx < ilen) {
	    j = 0;
	    while (j < jlen) {
	      result[result.length] = [a[idx], b[j]];
	      j += 1;
	    }
	    idx += 1;
	  }
	  return result;
	});


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Creates a new list out of the two supplied by pairing up equally-positioned
	 * items from both lists. The returned list is truncated to the length of the
	 * shorter of the two input lists.
	 * Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [b] -> [[a,b]]
	 * @param {Array} list1 The first array to consider.
	 * @param {Array} list2 The second array to consider.
	 * @return {Array} The list made by pairing up same-indexed elements of `list1` and `list2`.
	 * @example
	 *
	 *      R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]
	 * @symb R.zip([a, b, c], [d, e, f]) = [[a, d], [b, e], [c, f]]
	 */
	module.exports = _curry2(function zip(a, b) {
	  var rv = [];
	  var idx = 0;
	  var len = Math.min(a.length, b.length);
	  while (idx < len) {
	    rv[idx] = [a[idx], b[idx]];
	    idx += 1;
	  }
	  return rv;
	});


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(13);
	
	
	/**
	 * Creates a new object out of a list of keys and a list of values.
	 * Key/value pairing is truncated to the length of the shorter of the two lists.
	 * Note: `zipObj` is equivalent to `pipe(zipWith(pair), fromPairs)`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category List
	 * @sig [String] -> [*] -> {String: *}
	 * @param {Array} keys The array that will be properties on the output object.
	 * @param {Array} values The list of values on the output object.
	 * @return {Object} The object made by pairing up same-indexed elements of `keys` and `values`.
	 * @example
	 *
	 *      R.zipObj(['a', 'b', 'c'], [1, 2, 3]); //=> {a: 1, b: 2, c: 3}
	 */
	module.exports = _curry2(function zipObj(keys, values) {
	  var idx = 0;
	  var len = Math.min(keys.length, values.length);
	  var out = {};
	  while (idx < len) {
	    out[keys[idx]] = values[idx];
	    idx += 1;
	  }
	  return out;
	});


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(20);
	
	
	/**
	 * Creates a new list out of the two supplied by applying the function to each
	 * equally-positioned pair in the lists. The returned list is truncated to the
	 * length of the shorter of the two input lists.
	 *
	 * @function
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig (a,b -> c) -> [a] -> [b] -> [c]
	 * @param {Function} fn The function used to combine the two elements into one value.
	 * @param {Array} list1 The first array to consider.
	 * @param {Array} list2 The second array to consider.
	 * @return {Array} The list made by combining same-indexed elements of `list1` and `list2`
	 *         using `fn`.
	 * @example
	 *
	 *      var f = (x, y) => {
	 *        // ...
	 *      };
	 *      R.zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
	 *      //=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]
	 * @symb R.zipWith(fn, [a, b, c], [d, e, f]) = [fn(a, d), fn(b, e), fn(c, f)]
	 */
	module.exports = _curry3(function zipWith(fn, a, b) {
	  var rv = [];
	  var idx = 0;
	  var len = Math.min(a.length, b.length);
	  while (idx < len) {
	    rv[idx] = fn(a[idx], b[idx]);
	    idx += 1;
	  }
	  return rv;
	});


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _getPosition = __webpack_require__(324);
	
	var _getPosition2 = _interopRequireDefault(_getPosition);
	
	var _constants = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Check if board position is empty
	 * @param {*} board bits board
	 * @param {*} index position
	 * @return {Boolean} is empty
	 */
	var isPositionEmpty = function isPositionEmpty(board, index) {
	  return (0, _getPosition2.default)(board, index) === _constants.emptyValue;
	};
	
	exports.default = isPositionEmpty;
	module.exports = exports['default'];

/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _calculateBitPosition = __webpack_require__(325);
	
	var _calculateBitPosition2 = _interopRequireDefault(_calculateBitPosition);
	
	var _getMask = __webpack_require__(327);
	
	var _getMask2 = _interopRequireDefault(_getMask);
	
	var _constants = __webpack_require__(4);
	
	var _ramda = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Get position from board
	 * @func
	 * @param {Number} board board bits
	 * @param {Number} index position index 0 to 8
	 * @return {Number} position value
	 */
	var getPosition = (0, _ramda.curry)(function (board, index) {
	  if (!(index >= 0 && index < _constants.boardLength)) {
	    return null;
	  }
	
	  var bitPosition = (0, _calculateBitPosition2.default)(index);
	  var mask = (0, _getMask2.default)(bitPosition);
	  // eslint-disable-next-line no-bitwise
	  return (board & mask) >> bitPosition;
	});
	
	exports.default = getPosition;
	module.exports = exports['default'];

/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.calculateBitPosition = exports.calculateBitPositionForXY = undefined;
	
	var _getXYFromIndex2 = __webpack_require__(326);
	
	var _getXYFromIndex3 = _interopRequireDefault(_getXYFromIndex2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Calculate bit position
	 * @param {*} x row from 0 to 2
	 * @param {*} y col from 0 to 2
	 * @return {Number} bit position
	 */
	var calculateBitPositionForXY = function calculateBitPositionForXY(x, y) {
	  return (x + y * 3) * 2;
	};
	
	/**
	 * Calculate bit position
	 * @param {*} index position index
	 * @return {Number} bit position
	 */
	var calculateBitPosition = function calculateBitPosition(index) {
	  var _getXYFromIndex = (0, _getXYFromIndex3.default)(index),
	      x = _getXYFromIndex.x,
	      y = _getXYFromIndex.y;
	
	  return calculateBitPositionForXY(x, y);
	};
	
	exports.default = calculateBitPosition;
	exports.calculateBitPositionForXY = calculateBitPositionForXY;
	exports.calculateBitPosition = calculateBitPosition;

/***/ }),
/* 326 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	/**
	 * Get {x, y} coordinates from index
	 * 
	 * x,y:
	 * 
	 * 0,0  1,0  2,0
	 * 
	 * 0,1  1,1  2,1
	 * 
	 * 0,2  1,2  2,2
	 * 
	 * @param {Number} index position index 0 to 8
	 * @return {*} {x,y}
	 */
	var getXYFromIndex = function getXYFromIndex(index) {
	  switch (index) {
	    case 0:
	      return { x: 0, y: 0 };
	    case 1:
	      return { x: 1, y: 0 };
	    case 2:
	      return { x: 2, y: 0 };
	    case 3:
	      return { x: 0, y: 1 };
	    case 4:
	      return { x: 1, y: 1 };
	    case 5:
	      return { x: 2, y: 1 };
	    case 6:
	      return { x: 0, y: 2 };
	    case 7:
	      return { x: 1, y: 2 };
	    case 8:
	      return { x: 2, y: 2 };
	    default:
	      return null;
	  }
	};
	
	exports.default = getXYFromIndex;
	module.exports = exports["default"];

/***/ }),
/* 327 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	/**
	 * Get mask position bits
	 * @param {Number} position bit position
	 * @return {Number} bit mask
	 */
	// eslint-disable-next-line no-bitwise
	var getMask = function getMask(position) {
	  return 3 << position;
	};
	
	exports.default = getMask;
	module.exports = exports["default"];

/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _setPosition = __webpack_require__(329);
	
	var _setPosition2 = _interopRequireDefault(_setPosition);
	
	var _getNewValue = __webpack_require__(330);
	
	var _getNewValue2 = _interopRequireDefault(_getNewValue);
	
	var _getNClicks = __webpack_require__(331);
	
	var _getNClicks2 = _interopRequireDefault(_getNClicks);
	
	var _getWinners = __webpack_require__(332);
	
	var _getWinners2 = _interopRequireDefault(_getWinners);
	
	var _ramda = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var getScore = function getScore(oldScore, winners, isMyTurn) {
	  if (winners) {
	    return oldScore + (isMyTurn ? 1 : 0);
	  } else {
	    return oldScore;
	  }
	};
	
	/**
	 * Move
	 * @param {*} oldGame game
	 * @param {Number} index position
	 * @return {*} new game
	 */
	var move = function move(oldGame, index) {
	  if (oldGame.ended) {
	    return oldGame;
	  }
	
	  var nClicks = (0, _getNClicks2.default)(oldGame.board);
	
	  var newValue = (0, _getNewValue2.default)(nClicks);
	
	  var newBoard = (0, _setPosition2.default)(oldGame.board, index, newValue);
	
	  if ((0, _ramda.isNil)(newBoard)) {
	    return null;
	  }
	
	  var winners = (0, _getWinners2.default)(newBoard);
	
	  var isNClicksOdd = nClicks % 2 === 0;
	
	  var ended = winners || nClicks > 7 ? true : false;
	
	  return {
	    board: newBoard,
	    ended: ended,
	    started: true,
	    lastMove: index,
	    winners: winners,
	    isAiTurn: !oldGame.isAiTurn,
	    aiStarted: oldGame.aiStarted,
	    score: ended ? {
	      ai: getScore(oldGame.score.ai, winners, oldGame.aiStarted ? isNClicksOdd : !isNClicksOdd),
	      human: getScore(oldGame.score.human, winners, oldGame.aiStarted ? !isNClicksOdd : isNClicksOdd)
	    } : oldGame.score
	  };
	};
	
	exports.default = move;
	module.exports = exports['default'];

/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _calculateBitPosition = __webpack_require__(325);
	
	var _calculateBitPosition2 = _interopRequireDefault(_calculateBitPosition);
	
	var _getMask = __webpack_require__(327);
	
	var _getMask2 = _interopRequireDefault(_getMask);
	
	var _isPositionEmpty = __webpack_require__(323);
	
	var _isPositionEmpty2 = _interopRequireDefault(_isPositionEmpty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Get board after move, return null for invalid move
	 * @param {Number} board old board bits
	 * @param {Number} index position
	 * @param {Number} value X=1, O=2
	 * @return {Number} new board bits
	 */
	var setPosition = function setPosition(board, index, value) {
	  if (!(0, _isPositionEmpty2.default)(board, index)) {
	    return null;
	  }
	
	  var position = (0, _calculateBitPosition2.default)(index);
	  // eslint-disable-next-line no-bitwise
	  return board & ~(0, _getMask2.default)(position) | value << position;
	};
	
	exports.default = setPosition;
	module.exports = exports['default'];

/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _constants = __webpack_require__(4);
	
	/**
	 * get new player value
	 * @param {Number} nClicks number of previous clicks / moves
	 * @return {Number} X or O value
	 */
	var getNewValue = function getNewValue(nClicks) {
	  return nClicks % 2 ? _constants.O : _constants.X;
	};
	
	exports.default = getNewValue;
	module.exports = exports['default'];

/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _constants = __webpack_require__(4);
	
	var _getEmptyPositions = __webpack_require__(3);
	
	var _getEmptyPositions2 = _interopRequireDefault(_getEmptyPositions);
	
	var _ramda = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Get number o clicks / moves
	 * @func
	 * @param {[Number]} board board array
	 * @return {Number} n clicks
	 */
	var getNClicks = function getNClicks(board) {
	  return _constants.boardLength - (0, _ramda.length)((0, _getEmptyPositions2.default)(board));
	};
	
	exports.default = getNClicks;
	module.exports = exports['default'];

/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _ramda = __webpack_require__(5);
	
	var _constants = __webpack_require__(4);
	
	var _getPosition = __webpack_require__(324);
	
	var _getPosition2 = _interopRequireDefault(_getPosition);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var positionsToCheck = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
	
	/**
	 * Check winners for 3 winning positions
	 * @param {Number} board board
	 * @return {[Number]} winners
	 */
	var getWinners = function getWinners(board) {
	  var get = (0, _getPosition2.default)(board);
	
	  return (0, _ramda.head)((0, _ramda.filter)(function (positions) {
	    var p0 = get(positions[0]);
	    var p1 = get(positions[1]);
	    var p2 = get(positions[2]);
	
	    return p0 !== _constants.emptyValue && p0 === p1 && p1 === p2;
	  }, positionsToCheck)) || null;
	};
	
	exports.default = getWinners;
	module.exports = exports['default'];

/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _synaptic = __webpack_require__(334);
	
	/**
	 * Get AI Neural Network
	 * @return {*} Neural Network
	 */
	var getNetwork = function getNetwork() {
	  var inputLayer = new _synaptic.Layer(1);
	  var hiddenLayer1 = new _synaptic.Layer(9);
	  var hiddenLayer2 = new _synaptic.Layer(9);
	  var outputLayer = new _synaptic.Layer(9);
	
	  inputLayer.project(hiddenLayer1);
	  hiddenLayer1.project(hiddenLayer2);
	  hiddenLayer2.project(outputLayer);
	
	  return new _synaptic.Network({
	    input: inputLayer,
	    hidden: [hiddenLayer1, hiddenLayer2],
	    output: outputLayer
	  });
	};
	
	exports.default = getNetwork;
	module.exports = exports['default'];

/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

	/*!
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2017 Juan Cazala - https://caza.la
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE
	 * 
	 * 
	 * 
	 * ********************************************************************************************
	 *                                   SYNAPTIC (v1.1.4)
	 * ********************************************************************************************
	 * 
	 * Synaptic is a javascript neural network library for node.js and the browser, its generalized
	 * algorithm is architecture-free, so you can build and train basically any type of first order
	 * or even second order neural network architectures.
	 * 
	 * http://en.wikipedia.org/wiki/Recurrent_neural_network#Second_Order_Recurrent_Neural_Network
	 * 
	 * The library includes a few built-in architectures like multilayer perceptrons, multilayer
	 * long-short term memory networks (LSTM) or liquid state machines, and a trainer capable of
	 * training any given network, and includes built-in training tasks/tests like solving an XOR,
	 * passing a Distracted Sequence Recall test or an Embeded Reber Grammar test.
	 * 
	 * The algorithm implemented by this library has been taken from Derek D. Monner's paper:
	 * 
	 * 
	 * A generalized LSTM-like training algorithm for second-order recurrent neural networks
	 * http://www.overcomplete.net/papers/nn2012.pdf
	 * 
	 * There are references to the equations in that paper commented through the source code.
	 * 
	 */
	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["synaptic"] = factory();
		else
			root["synaptic"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
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
	/******/ 			Object.defineProperty(exports, name, {
	/******/ 				configurable: false,
	/******/ 				enumerable: true,
	/******/ 				get: getter
	/******/ 			});
	/******/ 		}
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
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(__webpack_require__.s = 4);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _LayerConnection = __webpack_require__(6);
	
	var _LayerConnection2 = _interopRequireDefault(_LayerConnection);
	
	var _Neuron = __webpack_require__(2);
	
	var _Neuron2 = _interopRequireDefault(_Neuron);
	
	var _Network = __webpack_require__(1);
	
	var _Network2 = _interopRequireDefault(_Network);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// types of connections
	var connectionType = {
	  ALL_TO_ALL: "ALL TO ALL",
	  ONE_TO_ONE: "ONE TO ONE",
	  ALL_TO_ELSE: "ALL TO ELSE"
	};
	
	// types of gates
	var gateType = {
	  INPUT: "INPUT",
	  OUTPUT: "OUTPUT",
	  ONE_TO_ONE: "ONE TO ONE"
	};
	
	var Layer = function () {
	  function Layer(size) {
	    _classCallCheck(this, Layer);
	
	    this.size = size | 0;
	    this.list = [];
	
	    this.connectedTo = [];
	
	    while (size--) {
	      var neuron = new _Neuron2.default();
	      this.list.push(neuron);
	    }
	  }
	
	  // activates all the neurons in the layer
	
	
	  _createClass(Layer, [{
	    key: 'activate',
	    value: function activate(input) {
	
	      var activations = [];
	
	      if (typeof input != 'undefined') {
	        if (input.length != this.size) throw new Error('INPUT size and LAYER size must be the same to activate!');
	
	        for (var id in this.list) {
	          var neuron = this.list[id];
	          var activation = neuron.activate(input[id]);
	          activations.push(activation);
	        }
	      } else {
	        for (var id in this.list) {
	          var neuron = this.list[id];
	          var activation = neuron.activate();
	          activations.push(activation);
	        }
	      }
	      return activations;
	    }
	
	    // propagates the error on all the neurons of the layer
	
	  }, {
	    key: 'propagate',
	    value: function propagate(rate, target) {
	
	      if (typeof target != 'undefined') {
	        if (target.length != this.size) throw new Error('TARGET size and LAYER size must be the same to propagate!');
	
	        for (var id = this.list.length - 1; id >= 0; id--) {
	          var neuron = this.list[id];
	          neuron.propagate(rate, target[id]);
	        }
	      } else {
	        for (var id = this.list.length - 1; id >= 0; id--) {
	          var neuron = this.list[id];
	          neuron.propagate(rate);
	        }
	      }
	    }
	
	    // projects a connection from this layer to another one
	
	  }, {
	    key: 'project',
	    value: function project(layer, type, weights) {
	
	      if (layer instanceof _Network2.default) layer = layer.layers.input;
	
	      if (layer instanceof Layer) {
	        if (!this.connected(layer)) return new _LayerConnection2.default(this, layer, type, weights);
	      } else throw new Error('Invalid argument, you can only project connections to LAYERS and NETWORKS!');
	    }
	
	    // gates a connection betwenn two layers
	
	  }, {
	    key: 'gate',
	    value: function gate(connection, type) {
	
	      if (type == Layer.gateType.INPUT) {
	        if (connection.to.size != this.size) throw new Error('GATER layer and CONNECTION.TO layer must be the same size in order to gate!');
	
	        for (var id in connection.to.list) {
	          var neuron = connection.to.list[id];
	          var gater = this.list[id];
	          for (var input in neuron.connections.inputs) {
	            var gated = neuron.connections.inputs[input];
	            if (gated.ID in connection.connections) gater.gate(gated);
	          }
	        }
	      } else if (type == Layer.gateType.OUTPUT) {
	        if (connection.from.size != this.size) throw new Error('GATER layer and CONNECTION.FROM layer must be the same size in order to gate!');
	
	        for (var id in connection.from.list) {
	          var neuron = connection.from.list[id];
	          var gater = this.list[id];
	          for (var projected in neuron.connections.projected) {
	            var gated = neuron.connections.projected[projected];
	            if (gated.ID in connection.connections) gater.gate(gated);
	          }
	        }
	      } else if (type == Layer.gateType.ONE_TO_ONE) {
	        if (connection.size != this.size) throw new Error('The number of GATER UNITS must be the same as the number of CONNECTIONS to gate!');
	
	        for (var id in connection.list) {
	          var gater = this.list[id];
	          var gated = connection.list[id];
	          gater.gate(gated);
	        }
	      }
	      connection.gatedfrom.push({ layer: this, type: type });
	    }
	
	    // true or false whether the whole layer is self-connected or not
	
	  }, {
	    key: 'selfconnected',
	    value: function selfconnected() {
	
	      for (var id in this.list) {
	        var neuron = this.list[id];
	        if (!neuron.selfconnected()) return false;
	      }
	      return true;
	    }
	
	    // true of false whether the layer is connected to another layer (parameter) or not
	
	  }, {
	    key: 'connected',
	    value: function connected(layer) {
	      // Check if ALL to ALL connection
	      var connections = 0;
	      for (var here in this.list) {
	        for (var there in layer.list) {
	          var from = this.list[here];
	          var to = layer.list[there];
	          var connected = from.connected(to);
	          if (connected.type == 'projected') connections++;
	        }
	      }
	      if (connections == this.size * layer.size) return Layer.connectionType.ALL_TO_ALL;
	
	      // Check if ONE to ONE connection
	      connections = 0;
	      for (var neuron in this.list) {
	        var from = this.list[neuron];
	        var to = layer.list[neuron];
	        var connected = from.connected(to);
	        if (connected.type == 'projected') connections++;
	      }
	      if (connections == this.size) return Layer.connectionType.ONE_TO_ONE;
	    }
	
	    // clears all the neuorns in the layer
	
	  }, {
	    key: 'clear',
	    value: function clear() {
	      for (var id in this.list) {
	        var neuron = this.list[id];
	        neuron.clear();
	      }
	    }
	
	    // resets all the neurons in the layer
	
	  }, {
	    key: 'reset',
	    value: function reset() {
	      for (var id in this.list) {
	        var neuron = this.list[id];
	        neuron.reset();
	      }
	    }
	
	    // returns all the neurons in the layer (array)
	
	  }, {
	    key: 'neurons',
	    value: function neurons() {
	      return this.list;
	    }
	
	    // adds a neuron to the layer
	
	  }, {
	    key: 'add',
	    value: function add(neuron) {
	      neuron = neuron || new _Neuron2.default();
	      this.list.push(neuron);
	      this.size++;
	    }
	  }, {
	    key: 'set',
	    value: function set(options) {
	      options = options || {};
	
	      for (var i in this.list) {
	        var neuron = this.list[i];
	        if (options.label) neuron.label = options.label + '_' + neuron.ID;
	        if (options.squash) neuron.squash = options.squash;
	        if (options.bias) neuron.bias = options.bias;
	      }
	      return this;
	    }
	  }]);
	
	  return Layer;
	}();
	
	Layer.connectionType = connectionType;
	Layer.gateType = gateType;
	exports.default = Layer;
	
	/***/ }),
	/* 1 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Neuron = __webpack_require__(2);
	
	var _Neuron2 = _interopRequireDefault(_Neuron);
	
	var _Layer = __webpack_require__(0);
	
	var _Layer2 = _interopRequireDefault(_Layer);
	
	var _Trainer = __webpack_require__(3);
	
	var _Trainer2 = _interopRequireDefault(_Trainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Network = function () {
	  function Network(layers) {
	    _classCallCheck(this, Network);
	
	    if (typeof layers != 'undefined') {
	      this.layers = {
	        input: layers.input || null,
	        hidden: layers.hidden || [],
	        output: layers.output || null
	      };
	      this.optimized = null;
	    }
	  }
	
	  // feed-forward activation of all the layers to produce an ouput
	
	
	  _createClass(Network, [{
	    key: 'activate',
	    value: function activate(input) {
	      if (this.optimized === false) {
	        this.layers.input.activate(input);
	        for (var i = 0; i < this.layers.hidden.length; i++) {
	          this.layers.hidden[i].activate();
	        }return this.layers.output.activate();
	      } else {
	        if (this.optimized == null) this.optimize();
	        return this.optimized.activate(input);
	      }
	    }
	
	    // back-propagate the error thru the network
	
	  }, {
	    key: 'propagate',
	    value: function propagate(rate, target) {
	      if (this.optimized === false) {
	        this.layers.output.propagate(rate, target);
	        for (var i = this.layers.hidden.length - 1; i >= 0; i--) {
	          this.layers.hidden[i].propagate(rate);
	        }
	      } else {
	        if (this.optimized == null) this.optimize();
	        this.optimized.propagate(rate, target);
	      }
	    }
	
	    // project a connection to another unit (either a network or a layer)
	
	  }, {
	    key: 'project',
	    value: function project(unit, type, weights) {
	      if (this.optimized) this.optimized.reset();
	
	      if (unit instanceof Network) return this.layers.output.project(unit.layers.input, type, weights);
	
	      if (unit instanceof _Layer2.default) return this.layers.output.project(unit, type, weights);
	
	      throw new Error('Invalid argument, you can only project connections to LAYERS and NETWORKS!');
	    }
	
	    // let this network gate a connection
	
	  }, {
	    key: 'gate',
	    value: function gate(connection, type) {
	      if (this.optimized) this.optimized.reset();
	      this.layers.output.gate(connection, type);
	    }
	
	    // clear all elegibility traces and extended elegibility traces (the network forgets its context, but not what was trained)
	
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.restore();
	
	      var inputLayer = this.layers.input,
	          outputLayer = this.layers.output;
	
	      inputLayer.clear();
	      for (var i = 0; i < this.layers.hidden.length; i++) {
	        this.layers.hidden[i].clear();
	      }
	      outputLayer.clear();
	
	      if (this.optimized) this.optimized.reset();
	    }
	
	    // reset all weights and clear all traces (ends up like a new network)
	
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.restore();
	
	      var inputLayer = this.layers.input,
	          outputLayer = this.layers.output;
	
	      inputLayer.reset();
	      for (var i = 0; i < this.layers.hidden.length; i++) {
	        this.layers.hidden[i].reset();
	      }
	      outputLayer.reset();
	
	      if (this.optimized) this.optimized.reset();
	    }
	
	    // hardcodes the behaviour of the whole network into a single optimized function
	
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      var that = this;
	      var optimized = {};
	      var neurons = this.neurons();
	
	      for (var i = 0; i < neurons.length; i++) {
	        var neuron = neurons[i].neuron;
	        var layer = neurons[i].layer;
	        while (neuron.neuron) {
	          neuron = neuron.neuron;
	        }optimized = neuron.optimize(optimized, layer);
	      }
	
	      for (var i = 0; i < optimized.propagation_sentences.length; i++) {
	        optimized.propagation_sentences[i].reverse();
	      }optimized.propagation_sentences.reverse();
	
	      var hardcode = '';
	      hardcode += 'var F = Float64Array ? new Float64Array(' + optimized.memory + ') : []; ';
	      for (var i in optimized.variables) {
	        hardcode += 'F[' + optimized.variables[i].id + '] = ' + (optimized.variables[i].value || 0) + '; ';
	      }hardcode += 'var activate = function(input){\n';
	      for (var i = 0; i < optimized.inputs.length; i++) {
	        hardcode += 'F[' + optimized.inputs[i] + '] = input[' + i + ']; ';
	      }for (var i = 0; i < optimized.activation_sentences.length; i++) {
	        if (optimized.activation_sentences[i].length > 0) {
	          for (var j = 0; j < optimized.activation_sentences[i].length; j++) {
	            hardcode += optimized.activation_sentences[i][j].join(' ');
	            hardcode += optimized.trace_sentences[i][j].join(' ');
	          }
	        }
	      }
	      hardcode += ' var output = []; ';
	      for (var i = 0; i < optimized.outputs.length; i++) {
	        hardcode += 'output[' + i + '] = F[' + optimized.outputs[i] + ']; ';
	      }hardcode += 'return output; }; ';
	      hardcode += 'var propagate = function(rate, target){\n';
	      hardcode += 'F[' + optimized.variables.rate.id + '] = rate; ';
	      for (var i = 0; i < optimized.targets.length; i++) {
	        hardcode += 'F[' + optimized.targets[i] + '] = target[' + i + ']; ';
	      }for (var i = 0; i < optimized.propagation_sentences.length; i++) {
	        for (var j = 0; j < optimized.propagation_sentences[i].length; j++) {
	          hardcode += optimized.propagation_sentences[i][j].join(' ') + ' ';
	        }
	      }hardcode += ' };\n';
	      hardcode += 'var ownership = function(memoryBuffer){\nF = memoryBuffer;\nthis.memory = F;\n};\n';
	      hardcode += 'return {\nmemory: F,\nactivate: activate,\npropagate: propagate,\nownership: ownership\n};';
	      hardcode = hardcode.split(';').join(';\n');
	
	      var constructor = new Function(hardcode);
	
	      var network = constructor();
	      network.data = {
	        variables: optimized.variables,
	        activate: optimized.activation_sentences,
	        propagate: optimized.propagation_sentences,
	        trace: optimized.trace_sentences,
	        inputs: optimized.inputs,
	        outputs: optimized.outputs,
	        check_activation: this.activate,
	        check_propagation: this.propagate
	      };
	
	      network.reset = function () {
	        if (that.optimized) {
	          that.optimized = null;
	          that.activate = network.data.check_activation;
	          that.propagate = network.data.check_propagation;
	        }
	      };
	
	      this.optimized = network;
	      this.activate = network.activate;
	      this.propagate = network.propagate;
	    }
	
	    // restores all the values from the optimized network the their respective objects in order to manipulate the network
	
	  }, {
	    key: 'restore',
	    value: function restore() {
	      if (!this.optimized) return;
	
	      var optimized = this.optimized;
	
	      var getValue = function getValue() {
	        var args = Array.prototype.slice.call(arguments);
	
	        var unit = args.shift();
	        var prop = args.pop();
	
	        var id = prop + '_';
	        for (var property in args) {
	          id += args[property] + '_';
	        }id += unit.ID;
	
	        var memory = optimized.memory;
	        var variables = optimized.data.variables;
	
	        if (id in variables) return memory[variables[id].id];
	        return 0;
	      };
	
	      var list = this.neurons();
	
	      // link id's to positions in the array
	      for (var i = 0; i < list.length; i++) {
	        var neuron = list[i].neuron;
	        while (neuron.neuron) {
	          neuron = neuron.neuron;
	        }neuron.state = getValue(neuron, 'state');
	        neuron.old = getValue(neuron, 'old');
	        neuron.activation = getValue(neuron, 'activation');
	        neuron.bias = getValue(neuron, 'bias');
	
	        for (var input in neuron.trace.elegibility) {
	          neuron.trace.elegibility[input] = getValue(neuron, 'trace', 'elegibility', input);
	        }for (var gated in neuron.trace.extended) {
	          for (var input in neuron.trace.extended[gated]) {
	            neuron.trace.extended[gated][input] = getValue(neuron, 'trace', 'extended', gated, input);
	          }
	        } // get connections
	        for (var j in neuron.connections.projected) {
	          var connection = neuron.connections.projected[j];
	          connection.weight = getValue(connection, 'weight');
	          connection.gain = getValue(connection, 'gain');
	        }
	      }
	    }
	
	    // returns all the neurons in the network
	
	  }, {
	    key: 'neurons',
	    value: function neurons() {
	      var neurons = [];
	
	      var inputLayer = this.layers.input.neurons(),
	          outputLayer = this.layers.output.neurons();
	
	      for (var i = 0; i < inputLayer.length; i++) {
	        neurons.push({
	          neuron: inputLayer[i],
	          layer: 'input'
	        });
	      }
	
	      for (var i = 0; i < this.layers.hidden.length; i++) {
	        var hiddenLayer = this.layers.hidden[i].neurons();
	        for (var j = 0; j < hiddenLayer.length; j++) {
	          neurons.push({
	            neuron: hiddenLayer[j],
	            layer: i
	          });
	        }
	      }
	
	      for (var i = 0; i < outputLayer.length; i++) {
	        neurons.push({
	          neuron: outputLayer[i],
	          layer: 'output'
	        });
	      }
	
	      return neurons;
	    }
	
	    // returns number of inputs of the network
	
	  }, {
	    key: 'inputs',
	    value: function inputs() {
	      return this.layers.input.size;
	    }
	
	    // returns number of outputs of hte network
	
	  }, {
	    key: 'outputs',
	    value: function outputs() {
	      return this.layers.output.size;
	    }
	
	    // sets the layers of the network
	
	  }, {
	    key: 'set',
	    value: function set(layers) {
	      this.layers = {
	        input: layers.input || null,
	        hidden: layers.hidden || [],
	        output: layers.output || null
	      };
	      if (this.optimized) this.optimized.reset();
	    }
	  }, {
	    key: 'setOptimize',
	    value: function setOptimize(bool) {
	      this.restore();
	      if (this.optimized) this.optimized.reset();
	      this.optimized = bool ? null : false;
	    }
	
	    // returns a json that represents all the neurons and connections of the network
	
	  }, {
	    key: 'toJSON',
	    value: function toJSON(ignoreTraces) {
	      this.restore();
	
	      var list = this.neurons();
	      var neurons = [];
	      var connections = [];
	
	      // link id's to positions in the array
	      var ids = {};
	      for (var i = 0; i < list.length; i++) {
	        var neuron = list[i].neuron;
	        while (neuron.neuron) {
	          neuron = neuron.neuron;
	        }ids[neuron.ID] = i;
	
	        var copy = {
	          trace: {
	            elegibility: {},
	            extended: {}
	          },
	          state: neuron.state,
	          old: neuron.old,
	          activation: neuron.activation,
	          bias: neuron.bias,
	          layer: list[i].layer
	        };
	
	        copy.squash = neuron.squash == _Neuron2.default.squash.LOGISTIC ? 'LOGISTIC' : neuron.squash == _Neuron2.default.squash.TANH ? 'TANH' : neuron.squash == _Neuron2.default.squash.IDENTITY ? 'IDENTITY' : neuron.squash == _Neuron2.default.squash.HLIM ? 'HLIM' : neuron.squash == _Neuron2.default.squash.RELU ? 'RELU' : null;
	
	        neurons.push(copy);
	      }
	
	      for (var i = 0; i < list.length; i++) {
	        var neuron = list[i].neuron;
	        while (neuron.neuron) {
	          neuron = neuron.neuron;
	        }for (var j in neuron.connections.projected) {
	          var connection = neuron.connections.projected[j];
	          connections.push({
	            from: ids[connection.from.ID],
	            to: ids[connection.to.ID],
	            weight: connection.weight,
	            gater: connection.gater ? ids[connection.gater.ID] : null
	          });
	        }
	        if (neuron.selfconnected()) {
	          connections.push({
	            from: ids[neuron.ID],
	            to: ids[neuron.ID],
	            weight: neuron.selfconnection.weight,
	            gater: neuron.selfconnection.gater ? ids[neuron.selfconnection.gater.ID] : null
	          });
	        }
	      }
	
	      return {
	        neurons: neurons,
	        connections: connections
	      };
	    }
	
	    // export the topology into dot language which can be visualized as graphs using dot
	    /* example: ... console.log(net.toDotLang());
	                $ node example.js > example.dot
	                $ dot example.dot -Tpng > out.png
	    */
	
	  }, {
	    key: 'toDot',
	    value: function toDot(edgeConnection) {
	      if (!(typeof edgeConnection === 'undefined' ? 'undefined' : _typeof(edgeConnection))) edgeConnection = false;
	      var code = 'digraph nn {\n    rankdir = BT\n';
	      var layers = [this.layers.input].concat(this.layers.hidden, this.layers.output);
	      for (var i = 0; i < layers.length; i++) {
	        for (var j = 0; j < layers[i].connectedTo.length; j++) {
	          // projections
	          var connection = layers[i].connectedTo[j];
	          var layerTo = connection.to;
	          var size = connection.size;
	          var layerID = layers.indexOf(layers[i]);
	          var layerToID = layers.indexOf(layerTo);
	          /* http://stackoverflow.com/questions/26845540/connect-edges-with-graph-dot
	           * DOT does not support edge-to-edge connections
	           * This workaround produces somewhat weird graphs ...
	          */
	          if (edgeConnection) {
	            if (connection.gatedfrom.length) {
	              var fakeNode = 'fake' + layerID + '_' + layerToID;
	              code += '    ' + fakeNode + ' [label = "", shape = point, width = 0.01, height = 0.01]\n';
	              code += '    ' + layerID + ' -> ' + fakeNode + ' [label = ' + size + ', arrowhead = none]\n';
	              code += '    ' + fakeNode + ' -> ' + layerToID + '\n';
	            } else code += '    ' + layerID + ' -> ' + layerToID + ' [label = ' + size + ']\n';
	            for (var from in connection.gatedfrom) {
	              // gatings
	              var layerfrom = connection.gatedfrom[from].layer;
	              var layerfromID = layers.indexOf(layerfrom);
	              code += '    ' + layerfromID + ' -> ' + fakeNode + ' [color = blue]\n';
	            }
	          } else {
	            code += '    ' + layerID + ' -> ' + layerToID + ' [label = ' + size + ']\n';
	            for (var from in connection.gatedfrom) {
	              // gatings
	              var layerfrom = connection.gatedfrom[from].layer;
	              var layerfromID = layers.indexOf(layerfrom);
	              code += '    ' + layerfromID + ' -> ' + layerToID + ' [color = blue]\n';
	            }
	          }
	        }
	      }
	      code += '}\n';
	      return {
	        code: code,
	        link: 'https://chart.googleapis.com/chart?chl=' + escape(code.replace('/ /g', '+')) + '&cht=gv'
	      };
	    }
	
	    // returns a function that works as the activation of the network and can be used without depending on the library
	
	  }, {
	    key: 'standalone',
	    value: function standalone() {
	      if (!this.optimized) this.optimize();
	
	      var data = this.optimized.data;
	
	      // build activation function
	      var activation = 'function (input) {\n';
	
	      // build inputs
	      for (var i = 0; i < data.inputs.length; i++) {
	        activation += 'F[' + data.inputs[i] + '] = input[' + i + '];\n';
	      } // build network activation
	      for (var i = 0; i < data.activate.length; i++) {
	        // shouldn't this be layer?
	        for (var j = 0; j < data.activate[i].length; j++) {
	          activation += data.activate[i][j].join('') + '\n';
	        }
	      }
	
	      // build outputs
	      activation += 'var output = [];\n';
	      for (var i = 0; i < data.outputs.length; i++) {
	        activation += 'output[' + i + '] = F[' + data.outputs[i] + '];\n';
	      }activation += 'return output;\n}';
	
	      // reference all the positions in memory
	      var memory = activation.match(/F\[(\d+)\]/g);
	      var dimension = 0;
	      var ids = {};
	
	      for (var i = 0; i < memory.length; i++) {
	        var tmp = memory[i].match(/\d+/)[0];
	        if (!(tmp in ids)) {
	          ids[tmp] = dimension++;
	        }
	      }
	      var hardcode = 'F = {\n';
	
	      for (var i in ids) {
	        hardcode += ids[i] + ': ' + this.optimized.memory[i] + ',\n';
	      }hardcode = hardcode.substring(0, hardcode.length - 2) + '\n};\n';
	      hardcode = 'var run = ' + activation.replace(/F\[(\d+)]/g, function (index) {
	        return 'F[' + ids[index.match(/\d+/)[0]] + ']';
	      }).replace('{\n', '{\n' + hardcode + '') + ';\n';
	      hardcode += 'return run';
	
	      // return standalone function
	      return new Function(hardcode)();
	    }
	
	    // Return a HTML5 WebWorker specialized on training the network stored in `memory`.
	    // Train based on the given dataSet and options.
	    // The worker returns the updated `memory` when done.
	
	  }, {
	    key: 'worker',
	    value: function worker(memory, set, options) {
	      // Copy the options and set defaults (options might be different for each worker)
	      var workerOptions = {};
	      if (options) workerOptions = options;
	      workerOptions.rate = workerOptions.rate || .2;
	      workerOptions.iterations = workerOptions.iterations || 100000;
	      workerOptions.error = workerOptions.error || .005;
	      workerOptions.cost = workerOptions.cost || null;
	      workerOptions.crossValidate = workerOptions.crossValidate || null;
	
	      // Cost function might be different for each worker
	      var costFunction = '// REPLACED BY WORKER\nvar cost = ' + (options && options.cost || this.cost || _Trainer2.default.cost.MSE) + ';\n';
	      var workerFunction = Network.getWorkerSharedFunctions();
	      workerFunction = workerFunction.replace(/var cost = options && options\.cost \|\| this\.cost \|\| Trainer\.cost\.MSE;/g, costFunction);
	
	      // Set what we do when training is finished
	      workerFunction = workerFunction.replace('return results;', 'postMessage({action: "done", message: results, memoryBuffer: F}, [F.buffer]);');
	
	      // Replace log with postmessage
	      workerFunction = workerFunction.replace('console.log(\'iterations\', iterations, \'error\', error, \'rate\', currentRate)', 'postMessage({action: \'log\', message: {\n' + 'iterations: iterations,\n' + 'error: error,\n' + 'rate: currentRate\n' + '}\n' + '})');
	
	      // Replace schedule with postmessage
	      workerFunction = workerFunction.replace('abort = this.schedule.do({ error: error, iterations: iterations, rate: currentRate })', 'postMessage({action: \'schedule\', message: {\n' + 'iterations: iterations,\n' + 'error: error,\n' + 'rate: currentRate\n' + '}\n' + '})');
	
	      if (!this.optimized) this.optimize();
	
	      var hardcode = 'var inputs = ' + this.optimized.data.inputs.length + ';\n';
	      hardcode += 'var outputs = ' + this.optimized.data.outputs.length + ';\n';
	      hardcode += 'var F =  new Float64Array([' + this.optimized.memory.toString() + ']);\n';
	      hardcode += 'var activate = ' + this.optimized.activate.toString() + ';\n';
	      hardcode += 'var propagate = ' + this.optimized.propagate.toString() + ';\n';
	      hardcode += 'onmessage = function(e) {\n' + 'if (e.data.action == \'startTraining\') {\n' + 'train(' + JSON.stringify(set) + ',' + JSON.stringify(workerOptions) + ');\n' + '}\n' + '}';
	
	      var workerSourceCode = workerFunction + '\n' + hardcode;
	      var blob = new Blob([workerSourceCode]);
	      var blobURL = window.URL.createObjectURL(blob);
	
	      return new Worker(blobURL);
	    }
	
	    // returns a copy of the network
	
	  }, {
	    key: 'clone',
	    value: function clone() {
	      return Network.fromJSON(this.toJSON());
	    }
	
	    /**
	     * Creates a static String to store the source code of the functions
	     *  that are identical for all the workers (train, _trainSet, test)
	     *
	     * @return {String} Source code that can train a network inside a worker.
	     * @static
	     */
	
	  }], [{
	    key: 'getWorkerSharedFunctions',
	    value: function getWorkerSharedFunctions() {
	      // If we already computed the source code for the shared functions
	      if (typeof Network._SHARED_WORKER_FUNCTIONS !== 'undefined') return Network._SHARED_WORKER_FUNCTIONS;
	
	      // Otherwise compute and return the source code
	      // We compute them by simply copying the source code of the train, _trainSet and test functions
	      //  using the .toString() method
	
	      // Load and name the train function
	      var train_f = _Trainer2.default.prototype.train.toString();
	      train_f = train_f.replace(/this._trainSet/g, '_trainSet');
	      train_f = train_f.replace(/this.test/g, 'test');
	      train_f = train_f.replace(/this.crossValidate/g, 'crossValidate');
	      train_f = train_f.replace('crossValidate = true', '// REMOVED BY WORKER');
	
	      // Load and name the _trainSet function
	      var _trainSet_f = _Trainer2.default.prototype._trainSet.toString().replace(/this.network./g, '');
	
	      // Load and name the test function
	      var test_f = _Trainer2.default.prototype.test.toString().replace(/this.network./g, '');
	
	      return Network._SHARED_WORKER_FUNCTIONS = train_f + '\n' + _trainSet_f + '\n' + test_f;
	    }
	  }, {
	    key: 'fromJSON',
	    value: function fromJSON(json) {
	      var neurons = [];
	
	      var layers = {
	        input: new _Layer2.default(),
	        hidden: [],
	        output: new _Layer2.default()
	      };
	
	      for (var i = 0; i < json.neurons.length; i++) {
	        var config = json.neurons[i];
	
	        var neuron = new _Neuron2.default();
	        neuron.trace.elegibility = {};
	        neuron.trace.extended = {};
	        neuron.state = config.state;
	        neuron.old = config.old;
	        neuron.activation = config.activation;
	        neuron.bias = config.bias;
	        neuron.squash = config.squash in _Neuron2.default.squash ? _Neuron2.default.squash[config.squash] : _Neuron2.default.squash.LOGISTIC;
	        neurons.push(neuron);
	
	        if (config.layer == 'input') layers.input.add(neuron);else if (config.layer == 'output') layers.output.add(neuron);else {
	          if (typeof layers.hidden[config.layer] == 'undefined') layers.hidden[config.layer] = new _Layer2.default();
	          layers.hidden[config.layer].add(neuron);
	        }
	      }
	
	      for (var i = 0; i < json.connections.length; i++) {
	        var config = json.connections[i];
	        var from = neurons[config.from];
	        var to = neurons[config.to];
	        var weight = config.weight;
	        var gater = neurons[config.gater];
	
	        var connection = from.project(to, weight);
	        if (gater) gater.gate(connection);
	      }
	
	      return new Network(layers);
	    }
	  }]);
	
	  return Network;
	}();
	
	exports.default = Network;
	
	/***/ }),
	/* 2 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Connection = __webpack_require__(5);
	
	var _Connection2 = _interopRequireDefault(_Connection);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var neurons = 0;
	
	// squashing functions
	var squash = {
	  // eq. 5 & 5'
	  LOGISTIC: function LOGISTIC(x, derivate) {
	    var fx = 1 / (1 + Math.exp(-x));
	    if (!derivate) return fx;
	    return fx * (1 - fx);
	  },
	  TANH: function TANH(x, derivate) {
	    if (derivate) return 1 - Math.pow(Math.tanh(x), 2);
	    return Math.tanh(x);
	  },
	  IDENTITY: function IDENTITY(x, derivate) {
	    return derivate ? 1 : x;
	  },
	  HLIM: function HLIM(x, derivate) {
	    return derivate ? 1 : x > 0 ? 1 : 0;
	  },
	  RELU: function RELU(x, derivate) {
	    if (derivate) return x > 0 ? 1 : 0;
	    return x > 0 ? x : 0;
	  }
	};
	
	var Neuron = function () {
	  function Neuron() {
	    _classCallCheck(this, Neuron);
	
	    this.ID = Neuron.uid();
	
	    this.connections = {
	      inputs: {},
	      projected: {},
	      gated: {}
	    };
	    this.error = {
	      responsibility: 0,
	      projected: 0,
	      gated: 0
	    };
	    this.trace = {
	      elegibility: {},
	      extended: {},
	      influences: {}
	    };
	    this.state = 0;
	    this.old = 0;
	    this.activation = 0;
	    this.selfconnection = new _Connection2.default(this, this, 0); // weight = 0 -> not connected
	    this.squash = Neuron.squash.LOGISTIC;
	    this.neighboors = {};
	    this.bias = Math.random() * .2 - .1;
	  }
	
	  // activate the neuron
	
	
	  _createClass(Neuron, [{
	    key: 'activate',
	    value: function activate(input) {
	      // activation from enviroment (for input neurons)
	      if (typeof input != 'undefined') {
	        this.activation = input;
	        this.derivative = 0;
	        this.bias = 0;
	        return this.activation;
	      }
	
	      // old state
	      this.old = this.state;
	
	      // eq. 15
	      this.state = this.selfconnection.gain * this.selfconnection.weight * this.state + this.bias;
	
	      for (var i in this.connections.inputs) {
	        var input = this.connections.inputs[i];
	        this.state += input.from.activation * input.weight * input.gain;
	      }
	
	      // eq. 16
	      this.activation = this.squash(this.state);
	
	      // f'(s)
	      this.derivative = this.squash(this.state, true);
	
	      // update traces
	      var influences = [];
	      for (var id in this.trace.extended) {
	        // extended elegibility trace
	        var neuron = this.neighboors[id];
	
	        // if gated neuron's selfconnection is gated by this unit, the influence keeps track of the neuron's old state
	        var influence = neuron.selfconnection.gater == this ? neuron.old : 0;
	
	        // index runs over all the incoming connections to the gated neuron that are gated by this unit
	        for (var incoming in this.trace.influences[neuron.ID]) {
	          // captures the effect that has an input connection to this unit, on a neuron that is gated by this unit
	          influence += this.trace.influences[neuron.ID][incoming].weight * this.trace.influences[neuron.ID][incoming].from.activation;
	        }
	        influences[neuron.ID] = influence;
	      }
	
	      for (var i in this.connections.inputs) {
	        var input = this.connections.inputs[i];
	
	        // elegibility trace - Eq. 17
	        this.trace.elegibility[input.ID] = this.selfconnection.gain * this.selfconnection.weight * this.trace.elegibility[input.ID] + input.gain * input.from.activation;
	
	        for (var id in this.trace.extended) {
	          // extended elegibility trace
	          var xtrace = this.trace.extended[id];
	          var neuron = this.neighboors[id];
	          var influence = influences[neuron.ID];
	
	          // eq. 18
	          xtrace[input.ID] = neuron.selfconnection.gain * neuron.selfconnection.weight * xtrace[input.ID] + this.derivative * this.trace.elegibility[input.ID] * influence;
	        }
	      }
	
	      //  update gated connection's gains
	      for (var connection in this.connections.gated) {
	        this.connections.gated[connection].gain = this.activation;
	      }
	
	      return this.activation;
	    }
	
	    // back-propagate the error
	
	  }, {
	    key: 'propagate',
	    value: function propagate(rate, target) {
	      // error accumulator
	      var error = 0;
	
	      // whether or not this neuron is in the output layer
	      var isOutput = typeof target != 'undefined';
	
	      // output neurons get their error from the enviroment
	      if (isOutput) this.error.responsibility = this.error.projected = target - this.activation; // Eq. 10
	
	      else // the rest of the neuron compute their error responsibilities by backpropagation
	        {
	          // error responsibilities from all the connections projected from this neuron
	          for (var id in this.connections.projected) {
	            var connection = this.connections.projected[id];
	            var neuron = connection.to;
	            // Eq. 21
	            error += neuron.error.responsibility * connection.gain * connection.weight;
	          }
	
	          // projected error responsibility
	          this.error.projected = this.derivative * error;
	
	          error = 0;
	          // error responsibilities from all the connections gated by this neuron
	          for (var id in this.trace.extended) {
	            var neuron = this.neighboors[id]; // gated neuron
	            var influence = neuron.selfconnection.gater == this ? neuron.old : 0; // if gated neuron's selfconnection is gated by this neuron
	
	            // index runs over all the connections to the gated neuron that are gated by this neuron
	            for (var input in this.trace.influences[id]) {
	              // captures the effect that the input connection of this neuron have, on a neuron which its input/s is/are gated by this neuron
	              influence += this.trace.influences[id][input].weight * this.trace.influences[neuron.ID][input].from.activation;
	            }
	            // eq. 22
	            error += neuron.error.responsibility * influence;
	          }
	
	          // gated error responsibility
	          this.error.gated = this.derivative * error;
	
	          // error responsibility - Eq. 23
	          this.error.responsibility = this.error.projected + this.error.gated;
	        }
	
	      // learning rate
	      rate = rate || .1;
	
	      // adjust all the neuron's incoming connections
	      for (var id in this.connections.inputs) {
	        var input = this.connections.inputs[id];
	
	        // Eq. 24
	        var gradient = this.error.projected * this.trace.elegibility[input.ID];
	        for (var id in this.trace.extended) {
	          var neuron = this.neighboors[id];
	          gradient += neuron.error.responsibility * this.trace.extended[neuron.ID][input.ID];
	        }
	        input.weight += rate * gradient; // adjust weights - aka learn
	      }
	
	      // adjust bias
	      this.bias += rate * this.error.responsibility;
	    }
	  }, {
	    key: 'project',
	    value: function project(neuron, weight) {
	      // self-connection
	      if (neuron == this) {
	        this.selfconnection.weight = 1;
	        return this.selfconnection;
	      }
	
	      // check if connection already exists
	      var connected = this.connected(neuron);
	      if (connected && connected.type == 'projected') {
	        // update connection
	        if (typeof weight != 'undefined') connected.connection.weight = weight;
	        // return existing connection
	        return connected.connection;
	      } else {
	        // create a new connection
	        var connection = new _Connection2.default(this, neuron, weight);
	      }
	
	      // reference all the connections and traces
	      this.connections.projected[connection.ID] = connection;
	      this.neighboors[neuron.ID] = neuron;
	      neuron.connections.inputs[connection.ID] = connection;
	      neuron.trace.elegibility[connection.ID] = 0;
	
	      for (var id in neuron.trace.extended) {
	        var trace = neuron.trace.extended[id];
	        trace[connection.ID] = 0;
	      }
	
	      return connection;
	    }
	  }, {
	    key: 'gate',
	    value: function gate(connection) {
	      // add connection to gated list
	      this.connections.gated[connection.ID] = connection;
	
	      var neuron = connection.to;
	      if (!(neuron.ID in this.trace.extended)) {
	        // extended trace
	        this.neighboors[neuron.ID] = neuron;
	        var xtrace = this.trace.extended[neuron.ID] = {};
	        for (var id in this.connections.inputs) {
	          var input = this.connections.inputs[id];
	          xtrace[input.ID] = 0;
	        }
	      }
	
	      // keep track
	      if (neuron.ID in this.trace.influences) this.trace.influences[neuron.ID].push(connection);else this.trace.influences[neuron.ID] = [connection];
	
	      // set gater
	      connection.gater = this;
	    }
	
	    // returns true or false whether the neuron is self-connected or not
	
	  }, {
	    key: 'selfconnected',
	    value: function selfconnected() {
	      return this.selfconnection.weight !== 0;
	    }
	
	    // returns true or false whether the neuron is connected to another neuron (parameter)
	
	  }, {
	    key: 'connected',
	    value: function connected(neuron) {
	      var result = {
	        type: null,
	        connection: false
	      };
	
	      if (this == neuron) {
	        if (this.selfconnected()) {
	          result.type = 'selfconnection';
	          result.connection = this.selfconnection;
	          return result;
	        } else return false;
	      }
	
	      for (var type in this.connections) {
	        for (var connection in this.connections[type]) {
	          var connection = this.connections[type][connection];
	          if (connection.to == neuron) {
	            result.type = type;
	            result.connection = connection;
	            return result;
	          } else if (connection.from == neuron) {
	            result.type = type;
	            result.connection = connection;
	            return result;
	          }
	        }
	      }
	
	      return false;
	    }
	
	    // clears all the traces (the neuron forgets it's context, but the connections remain intact)
	
	  }, {
	    key: 'clear',
	    value: function clear() {
	      for (var trace in this.trace.elegibility) {
	        this.trace.elegibility[trace] = 0;
	      }
	
	      for (var trace in this.trace.extended) {
	        for (var extended in this.trace.extended[trace]) {
	          this.trace.extended[trace][extended] = 0;
	        }
	      }
	
	      this.error.responsibility = this.error.projected = this.error.gated = 0;
	    }
	
	    // all the connections are randomized and the traces are cleared
	
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.clear();
	
	      for (var type in this.connections) {
	        for (var connection in this.connections[type]) {
	          this.connections[type][connection].weight = Math.random() * .2 - .1;
	        }
	      }
	
	      this.bias = Math.random() * .2 - .1;
	      this.old = this.state = this.activation = 0;
	    }
	
	    // hardcodes the behaviour of the neuron into an optimized function
	
	  }, {
	    key: 'optimize',
	    value: function optimize(optimized, layer) {
	
	      optimized = optimized || {};
	      var store_activation = [];
	      var store_trace = [];
	      var store_propagation = [];
	      var varID = optimized.memory || 0;
	      var neurons = optimized.neurons || 1;
	      var inputs = optimized.inputs || [];
	      var targets = optimized.targets || [];
	      var outputs = optimized.outputs || [];
	      var variables = optimized.variables || {};
	      var activation_sentences = optimized.activation_sentences || [];
	      var trace_sentences = optimized.trace_sentences || [];
	      var propagation_sentences = optimized.propagation_sentences || [];
	      var layers = optimized.layers || { __count: 0, __neuron: 0 };
	
	      // allocate sentences
	      var allocate = function allocate(store) {
	        var allocated = layer in layers && store[layers.__count];
	        if (!allocated) {
	          layers.__count = store.push([]) - 1;
	          layers[layer] = layers.__count;
	        }
	      };
	      allocate(activation_sentences);
	      allocate(trace_sentences);
	      allocate(propagation_sentences);
	      var currentLayer = layers.__count;
	
	      // get/reserve space in memory by creating a unique ID for a variablel
	      var getVar = function getVar() {
	        var args = Array.prototype.slice.call(arguments);
	
	        if (args.length == 1) {
	          if (args[0] == 'target') {
	            var id = 'target_' + targets.length;
	            targets.push(varID);
	          } else var id = args[0];
	          if (id in variables) return variables[id];
	          return variables[id] = {
	            value: 0,
	            id: varID++
	          };
	        } else {
	          var extended = args.length > 2;
	          if (extended) var value = args.pop();
	
	          var unit = args.shift();
	          var prop = args.pop();
	
	          if (!extended) var value = unit[prop];
	
	          var id = prop + '_';
	          for (var i = 0; i < args.length; i++) {
	            id += args[i] + '_';
	          }id += unit.ID;
	          if (id in variables) return variables[id];
	
	          return variables[id] = {
	            value: value,
	            id: varID++
	          };
	        }
	      };
	
	      // build sentence
	      var buildSentence = function buildSentence() {
	        var args = Array.prototype.slice.call(arguments);
	        var store = args.pop();
	        var sentence = '';
	        for (var i = 0; i < args.length; i++) {
	          if (typeof args[i] == 'string') sentence += args[i];else sentence += 'F[' + args[i].id + ']';
	        }store.push(sentence + ';');
	      };
	
	      // helper to check if an object is empty
	      var isEmpty = function isEmpty(obj) {
	        for (var prop in obj) {
	          if (obj.hasOwnProperty(prop)) return false;
	        }
	        return true;
	      };
	
	      // characteristics of the neuron
	      var noProjections = isEmpty(this.connections.projected);
	      var noGates = isEmpty(this.connections.gated);
	      var isInput = layer == 'input' ? true : isEmpty(this.connections.inputs);
	      var isOutput = layer == 'output' ? true : noProjections && noGates;
	
	      // optimize neuron's behaviour
	      var rate = getVar('rate');
	      var activation = getVar(this, 'activation');
	      if (isInput) inputs.push(activation.id);else {
	        activation_sentences[currentLayer].push(store_activation);
	        trace_sentences[currentLayer].push(store_trace);
	        propagation_sentences[currentLayer].push(store_propagation);
	        var old = getVar(this, 'old');
	        var state = getVar(this, 'state');
	        var bias = getVar(this, 'bias');
	        if (this.selfconnection.gater) var self_gain = getVar(this.selfconnection, 'gain');
	        if (this.selfconnected()) var self_weight = getVar(this.selfconnection, 'weight');
	        buildSentence(old, ' = ', state, store_activation);
	        if (this.selfconnected()) {
	          if (this.selfconnection.gater) buildSentence(state, ' = ', self_gain, ' * ', self_weight, ' * ', state, ' + ', bias, store_activation);else buildSentence(state, ' = ', self_weight, ' * ', state, ' + ', bias, store_activation);
	        } else buildSentence(state, ' = ', bias, store_activation);
	        for (var i in this.connections.inputs) {
	          var input = this.connections.inputs[i];
	          var input_activation = getVar(input.from, 'activation');
	          var input_weight = getVar(input, 'weight');
	          if (input.gater) var input_gain = getVar(input, 'gain');
	          if (this.connections.inputs[i].gater) buildSentence(state, ' += ', input_activation, ' * ', input_weight, ' * ', input_gain, store_activation);else buildSentence(state, ' += ', input_activation, ' * ', input_weight, store_activation);
	        }
	        var derivative = getVar(this, 'derivative');
	        switch (this.squash) {
	          case Neuron.squash.LOGISTIC:
	            buildSentence(activation, ' = (1 / (1 + Math.exp(-', state, ')))', store_activation);
	            buildSentence(derivative, ' = ', activation, ' * (1 - ', activation, ')', store_activation);
	            break;
	          case Neuron.squash.TANH:
	            var eP = getVar('aux');
	            var eN = getVar('aux_2');
	            buildSentence(eP, ' = Math.exp(', state, ')', store_activation);
	            buildSentence(eN, ' = 1 / ', eP, store_activation);
	            buildSentence(activation, ' = (', eP, ' - ', eN, ') / (', eP, ' + ', eN, ')', store_activation);
	            buildSentence(derivative, ' = 1 - (', activation, ' * ', activation, ')', store_activation);
	            break;
	          case Neuron.squash.IDENTITY:
	            buildSentence(activation, ' = ', state, store_activation);
	            buildSentence(derivative, ' = 1', store_activation);
	            break;
	          case Neuron.squash.HLIM:
	            buildSentence(activation, ' = +(', state, ' > 0)', store_activation);
	            buildSentence(derivative, ' = 1', store_activation);
	            break;
	          case Neuron.squash.RELU:
	            buildSentence(activation, ' = ', state, ' > 0 ? ', state, ' : 0', store_activation);
	            buildSentence(derivative, ' = ', state, ' > 0 ? 1 : 0', store_activation);
	            break;
	        }
	
	        for (var id in this.trace.extended) {
	          // calculate extended elegibility traces in advance
	          var neuron = this.neighboors[id];
	          var influence = getVar('influences[' + neuron.ID + ']');
	          var neuron_old = getVar(neuron, 'old');
	          var initialized = false;
	          if (neuron.selfconnection.gater == this) {
	            buildSentence(influence, ' = ', neuron_old, store_trace);
	            initialized = true;
	          }
	          for (var incoming in this.trace.influences[neuron.ID]) {
	            var incoming_weight = getVar(this.trace.influences[neuron.ID][incoming], 'weight');
	            var incoming_activation = getVar(this.trace.influences[neuron.ID][incoming].from, 'activation');
	
	            if (initialized) buildSentence(influence, ' += ', incoming_weight, ' * ', incoming_activation, store_trace);else {
	              buildSentence(influence, ' = ', incoming_weight, ' * ', incoming_activation, store_trace);
	              initialized = true;
	            }
	          }
	        }
	
	        for (var i in this.connections.inputs) {
	          var input = this.connections.inputs[i];
	          if (input.gater) var input_gain = getVar(input, 'gain');
	          var input_activation = getVar(input.from, 'activation');
	          var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace.elegibility[input.ID]);
	          if (this.selfconnected()) {
	            if (this.selfconnection.gater) {
	              if (input.gater) buildSentence(trace, ' = ', self_gain, ' * ', self_weight, ' * ', trace, ' + ', input_gain, ' * ', input_activation, store_trace);else buildSentence(trace, ' = ', self_gain, ' * ', self_weight, ' * ', trace, ' + ', input_activation, store_trace);
	            } else {
	              if (input.gater) buildSentence(trace, ' = ', self_weight, ' * ', trace, ' + ', input_gain, ' * ', input_activation, store_trace);else buildSentence(trace, ' = ', self_weight, ' * ', trace, ' + ', input_activation, store_trace);
	            }
	          } else {
	            if (input.gater) buildSentence(trace, ' = ', input_gain, ' * ', input_activation, store_trace);else buildSentence(trace, ' = ', input_activation, store_trace);
	          }
	          for (var id in this.trace.extended) {
	            // extended elegibility trace
	            var neuron = this.neighboors[id];
	            var influence = getVar('influences[' + neuron.ID + ']');
	
	            var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace.elegibility[input.ID]);
	            var xtrace = getVar(this, 'trace', 'extended', neuron.ID, input.ID, this.trace.extended[neuron.ID][input.ID]);
	            if (neuron.selfconnected()) var neuron_self_weight = getVar(neuron.selfconnection, 'weight');
	            if (neuron.selfconnection.gater) var neuron_self_gain = getVar(neuron.selfconnection, 'gain');
	            if (neuron.selfconnected()) {
	              if (neuron.selfconnection.gater) buildSentence(xtrace, ' = ', neuron_self_gain, ' * ', neuron_self_weight, ' * ', xtrace, ' + ', derivative, ' * ', trace, ' * ', influence, store_trace);else buildSentence(xtrace, ' = ', neuron_self_weight, ' * ', xtrace, ' + ', derivative, ' * ', trace, ' * ', influence, store_trace);
	            } else buildSentence(xtrace, ' = ', derivative, ' * ', trace, ' * ', influence, store_trace);
	          }
	        }
	        for (var connection in this.connections.gated) {
	          var gated_gain = getVar(this.connections.gated[connection], 'gain');
	          buildSentence(gated_gain, ' = ', activation, store_activation);
	        }
	      }
	      if (!isInput) {
	        var responsibility = getVar(this, 'error', 'responsibility', this.error.responsibility);
	        if (isOutput) {
	          var target = getVar('target');
	          buildSentence(responsibility, ' = ', target, ' - ', activation, store_propagation);
	          for (var id in this.connections.inputs) {
	            var input = this.connections.inputs[id];
	            var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace.elegibility[input.ID]);
	            var input_weight = getVar(input, 'weight');
	            buildSentence(input_weight, ' += ', rate, ' * (', responsibility, ' * ', trace, ')', store_propagation);
	          }
	          outputs.push(activation.id);
	        } else {
	          if (!noProjections && !noGates) {
	            var error = getVar('aux');
	            for (var id in this.connections.projected) {
	              var connection = this.connections.projected[id];
	              var neuron = connection.to;
	              var connection_weight = getVar(connection, 'weight');
	              var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
	              if (connection.gater) {
	                var connection_gain = getVar(connection, 'gain');
	                buildSentence(error, ' += ', neuron_responsibility, ' * ', connection_gain, ' * ', connection_weight, store_propagation);
	              } else buildSentence(error, ' += ', neuron_responsibility, ' * ', connection_weight, store_propagation);
	            }
	            var projected = getVar(this, 'error', 'projected', this.error.projected);
	            buildSentence(projected, ' = ', derivative, ' * ', error, store_propagation);
	            buildSentence(error, ' = 0', store_propagation);
	            for (var id in this.trace.extended) {
	              var neuron = this.neighboors[id];
	              var influence = getVar('aux_2');
	              var neuron_old = getVar(neuron, 'old');
	              if (neuron.selfconnection.gater == this) buildSentence(influence, ' = ', neuron_old, store_propagation);else buildSentence(influence, ' = 0', store_propagation);
	              for (var input in this.trace.influences[neuron.ID]) {
	                var connection = this.trace.influences[neuron.ID][input];
	                var connection_weight = getVar(connection, 'weight');
	                var neuron_activation = getVar(connection.from, 'activation');
	                buildSentence(influence, ' += ', connection_weight, ' * ', neuron_activation, store_propagation);
	              }
	              var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
	              buildSentence(error, ' += ', neuron_responsibility, ' * ', influence, store_propagation);
	            }
	            var gated = getVar(this, 'error', 'gated', this.error.gated);
	            buildSentence(gated, ' = ', derivative, ' * ', error, store_propagation);
	            buildSentence(responsibility, ' = ', projected, ' + ', gated, store_propagation);
	            for (var id in this.connections.inputs) {
	              var input = this.connections.inputs[id];
	              var gradient = getVar('aux');
	              var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace.elegibility[input.ID]);
	              buildSentence(gradient, ' = ', projected, ' * ', trace, store_propagation);
	              for (var id in this.trace.extended) {
	                var neuron = this.neighboors[id];
	                var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
	                var xtrace = getVar(this, 'trace', 'extended', neuron.ID, input.ID, this.trace.extended[neuron.ID][input.ID]);
	                buildSentence(gradient, ' += ', neuron_responsibility, ' * ', xtrace, store_propagation);
	              }
	              var input_weight = getVar(input, 'weight');
	              buildSentence(input_weight, ' += ', rate, ' * ', gradient, store_propagation);
	            }
	          } else if (noGates) {
	            buildSentence(responsibility, ' = 0', store_propagation);
	            for (var id in this.connections.projected) {
	              var connection = this.connections.projected[id];
	              var neuron = connection.to;
	              var connection_weight = getVar(connection, 'weight');
	              var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
	              if (connection.gater) {
	                var connection_gain = getVar(connection, 'gain');
	                buildSentence(responsibility, ' += ', neuron_responsibility, ' * ', connection_gain, ' * ', connection_weight, store_propagation);
	              } else buildSentence(responsibility, ' += ', neuron_responsibility, ' * ', connection_weight, store_propagation);
	            }
	            buildSentence(responsibility, ' *= ', derivative, store_propagation);
	            for (var id in this.connections.inputs) {
	              var input = this.connections.inputs[id];
	              var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace.elegibility[input.ID]);
	              var input_weight = getVar(input, 'weight');
	              buildSentence(input_weight, ' += ', rate, ' * (', responsibility, ' * ', trace, ')', store_propagation);
	            }
	          } else if (noProjections) {
	            buildSentence(responsibility, ' = 0', store_propagation);
	            for (var id in this.trace.extended) {
	              var neuron = this.neighboors[id];
	              var influence = getVar('aux');
	              var neuron_old = getVar(neuron, 'old');
	              if (neuron.selfconnection.gater == this) buildSentence(influence, ' = ', neuron_old, store_propagation);else buildSentence(influence, ' = 0', store_propagation);
	              for (var input in this.trace.influences[neuron.ID]) {
	                var connection = this.trace.influences[neuron.ID][input];
	                var connection_weight = getVar(connection, 'weight');
	                var neuron_activation = getVar(connection.from, 'activation');
	                buildSentence(influence, ' += ', connection_weight, ' * ', neuron_activation, store_propagation);
	              }
	              var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
	              buildSentence(responsibility, ' += ', neuron_responsibility, ' * ', influence, store_propagation);
	            }
	            buildSentence(responsibility, ' *= ', derivative, store_propagation);
	            for (var id in this.connections.inputs) {
	              var input = this.connections.inputs[id];
	              var gradient = getVar('aux');
	              buildSentence(gradient, ' = 0', store_propagation);
	              for (var id in this.trace.extended) {
	                var neuron = this.neighboors[id];
	                var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
	                var xtrace = getVar(this, 'trace', 'extended', neuron.ID, input.ID, this.trace.extended[neuron.ID][input.ID]);
	                buildSentence(gradient, ' += ', neuron_responsibility, ' * ', xtrace, store_propagation);
	              }
	              var input_weight = getVar(input, 'weight');
	              buildSentence(input_weight, ' += ', rate, ' * ', gradient, store_propagation);
	            }
	          }
	        }
	        buildSentence(bias, ' += ', rate, ' * ', responsibility, store_propagation);
	      }
	      return {
	        memory: varID,
	        neurons: neurons + 1,
	        inputs: inputs,
	        outputs: outputs,
	        targets: targets,
	        variables: variables,
	        activation_sentences: activation_sentences,
	        trace_sentences: trace_sentences,
	        propagation_sentences: propagation_sentences,
	        layers: layers
	      };
	    }
	  }], [{
	    key: 'uid',
	    value: function uid() {
	      return neurons++;
	    }
	  }, {
	    key: 'quantity',
	    value: function quantity() {
	      return {
	        neurons: neurons,
	        connections: _Connection.connections
	      };
	    }
	  }]);
	
	  return Neuron;
	}();
	
	Neuron.squash = squash;
	exports.default = Neuron;
	
	/***/ }),
	/* 3 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	//+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/array/shuffle [v1.0]
	function shuffleInplace(o) {
	  //v1.0
	  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {}
	  return o;
	};
	
	// Built-in cost functions
	var cost = {
	  // Eq. 9
	  CROSS_ENTROPY: function CROSS_ENTROPY(target, output) {
	    var crossentropy = 0;
	    for (var i in output) {
	      crossentropy -= target[i] * Math.log(output[i] + 1e-15) + (1 - target[i]) * Math.log(1 + 1e-15 - output[i]);
	    } // +1e-15 is a tiny push away to avoid Math.log(0)
	    return crossentropy;
	  },
	  MSE: function MSE(target, output) {
	    var mse = 0;
	    for (var i = 0; i < output.length; i++) {
	      mse += Math.pow(target[i] - output[i], 2);
	    }return mse / output.length;
	  },
	  BINARY: function BINARY(target, output) {
	    var misses = 0;
	    for (var i = 0; i < output.length; i++) {
	      misses += Math.round(target[i] * 2) != Math.round(output[i] * 2);
	    }return misses;
	  }
	};
	
	var Trainer = function () {
	  function Trainer(network, options) {
	    _classCallCheck(this, Trainer);
	
	    options = options || {};
	    this.network = network;
	    this.rate = options.rate || .2;
	    this.iterations = options.iterations || 100000;
	    this.error = options.error || .005;
	    this.cost = options.cost || null;
	    this.crossValidate = options.crossValidate || null;
	  }
	
	  // trains any given set to a network
	
	
	  _createClass(Trainer, [{
	    key: 'train',
	    value: function train(set, options) {
	      var error = 1;
	      var iterations = bucketSize = 0;
	      var abort = false;
	      var currentRate;
	      var cost = options && options.cost || this.cost || Trainer.cost.MSE;
	      var crossValidate = false,
	          testSet,
	          trainSet;
	
	      var start = Date.now();
	
	      if (options) {
	        if (options.iterations) this.iterations = options.iterations;
	        if (options.error) this.error = options.error;
	        if (options.rate) this.rate = options.rate;
	        if (options.cost) this.cost = options.cost;
	        if (options.schedule) this.schedule = options.schedule;
	        if (options.customLog) {
	          // for backward compatibility with code that used customLog
	          console.log('Deprecated: use schedule instead of customLog');
	          this.schedule = options.customLog;
	        }
	        if (this.crossValidate || options.crossValidate) {
	          if (!this.crossValidate) this.crossValidate = {};
	          crossValidate = true;
	          if (options.crossValidate.testSize) this.crossValidate.testSize = options.crossValidate.testSize;
	          if (options.crossValidate.testError) this.crossValidate.testError = options.crossValidate.testError;
	        }
	      }
	
	      currentRate = this.rate;
	      if (Array.isArray(this.rate)) {
	        var bucketSize = Math.floor(this.iterations / this.rate.length);
	      }
	
	      if (crossValidate) {
	        var numTrain = Math.ceil((1 - this.crossValidate.testSize) * set.length);
	        trainSet = set.slice(0, numTrain);
	        testSet = set.slice(numTrain);
	      }
	
	      var lastError = 0;
	      while (!abort && iterations < this.iterations && error > this.error) {
	        if (crossValidate && error <= this.crossValidate.testError) {
	          break;
	        }
	
	        var currentSetSize = set.length;
	        error = 0;
	        iterations++;
	
	        if (bucketSize > 0) {
	          var currentBucket = Math.floor(iterations / bucketSize);
	          currentRate = this.rate[currentBucket] || currentRate;
	        }
	
	        if (typeof this.rate === 'function') {
	          currentRate = this.rate(iterations, lastError);
	        }
	
	        if (crossValidate) {
	          this._trainSet(trainSet, currentRate, cost);
	          error += this.test(testSet).error;
	          currentSetSize = 1;
	        } else {
	          error += this._trainSet(set, currentRate, cost);
	          currentSetSize = set.length;
	        }
	
	        // check error
	        error /= currentSetSize;
	        lastError = error;
	
	        if (options) {
	          if (this.schedule && this.schedule.every && iterations % this.schedule.every == 0) abort = this.schedule.do({ error: error, iterations: iterations, rate: currentRate });else if (options.log && iterations % options.log == 0) {
	            console.log('iterations', iterations, 'error', error, 'rate', currentRate);
	          }
	          ;
	          if (options.shuffle) shuffleInplace(set);
	        }
	      }
	
	      var results = {
	        error: error,
	        iterations: iterations,
	        time: Date.now() - start
	      };
	
	      return results;
	    }
	
	    // trains any given set to a network, using a WebWorker (only for the browser). Returns a Promise of the results.
	
	  }, {
	    key: 'trainAsync',
	    value: function trainAsync(set, options) {
	      var train = this.workerTrain.bind(this);
	      return new Promise(function (resolve, reject) {
	        try {
	          train(set, resolve, options, true);
	        } catch (e) {
	          reject(e);
	        }
	      });
	    }
	
	    // preforms one training epoch and returns the error (private function used in this.train)
	
	  }, {
	    key: '_trainSet',
	    value: function _trainSet(set, currentRate, costFunction) {
	      var errorSum = 0;
	      for (var i = 0; i < set.length; i++) {
	        var input = set[i].input;
	        var target = set[i].output;
	
	        var output = this.network.activate(input);
	        this.network.propagate(currentRate, target);
	
	        errorSum += costFunction(target, output);
	      }
	      return errorSum;
	    }
	
	    // tests a set and returns the error and elapsed time
	
	  }, {
	    key: 'test',
	    value: function test(set, options) {
	      var error = 0;
	      var input, output, target;
	      var cost = options && options.cost || this.cost || Trainer.cost.MSE;
	
	      var start = Date.now();
	
	      for (var i = 0; i < set.length; i++) {
	        input = set[i].input;
	        target = set[i].output;
	        output = this.network.activate(input);
	        error += cost(target, output);
	      }
	
	      error /= set.length;
	
	      var results = {
	        error: error,
	        time: Date.now() - start
	      };
	
	      return results;
	    }
	
	    // trains any given set to a network using a WebWorker [deprecated: use trainAsync instead]
	
	  }, {
	    key: 'workerTrain',
	    value: function workerTrain(set, callback, options, suppressWarning) {
	      if (!suppressWarning) {
	        console.warn('Deprecated: do not use `workerTrain`, use `trainAsync` instead.');
	      }
	      var that = this;
	
	      if (!this.network.optimized) this.network.optimize();
	
	      // Create a new worker
	      var worker = this.network.worker(this.network.optimized.memory, set, options);
	
	      // train the worker
	      worker.onmessage = function (e) {
	        switch (e.data.action) {
	          case 'done':
	            var iterations = e.data.message.iterations;
	            var error = e.data.message.error;
	            var time = e.data.message.time;
	
	            that.network.optimized.ownership(e.data.memoryBuffer);
	
	            // Done callback
	            callback({
	              error: error,
	              iterations: iterations,
	              time: time
	            });
	
	            // Delete the worker and all its associated memory
	            worker.terminate();
	            break;
	
	          case 'log':
	            console.log(e.data.message);
	
	          case 'schedule':
	            if (options && options.schedule && typeof options.schedule.do === 'function') {
	              var scheduled = options.schedule.do;
	              scheduled(e.data.message);
	            }
	            break;
	        }
	      };
	
	      // Start the worker
	      worker.postMessage({ action: 'startTraining' });
	    }
	
	    // trains an XOR to the network
	
	  }, {
	    key: 'XOR',
	    value: function XOR(options) {
	      if (this.network.inputs() != 2 || this.network.outputs() != 1) throw new Error('Incompatible network (2 inputs, 1 output)');
	
	      var defaults = {
	        iterations: 100000,
	        log: false,
	        shuffle: true,
	        cost: Trainer.cost.MSE
	      };
	
	      if (options) for (var i in options) {
	        defaults[i] = options[i];
	      }return this.train([{
	        input: [0, 0],
	        output: [0]
	      }, {
	        input: [1, 0],
	        output: [1]
	      }, {
	        input: [0, 1],
	        output: [1]
	      }, {
	        input: [1, 1],
	        output: [0]
	      }], defaults);
	    }
	
	    // trains the network to pass a Distracted Sequence Recall test
	
	  }, {
	    key: 'DSR',
	    value: function DSR(options) {
	      options = options || {};
	
	      var targets = options.targets || [2, 4, 7, 8];
	      var distractors = options.distractors || [3, 5, 6, 9];
	      var prompts = options.prompts || [0, 1];
	      var length = options.length || 24;
	      var criterion = options.success || 0.95;
	      var iterations = options.iterations || 100000;
	      var rate = options.rate || .1;
	      var log = options.log || 0;
	      var schedule = options.schedule || {};
	      var cost = options.cost || this.cost || Trainer.cost.CROSS_ENTROPY;
	
	      var trial, correct, i, j, success;
	      trial = correct = i = j = success = 0;
	      var error = 1,
	          symbols = targets.length + distractors.length + prompts.length;
	
	      var noRepeat = function noRepeat(range, avoid) {
	        var number = Math.random() * range | 0;
	        var used = false;
	        for (var i in avoid) {
	          if (number == avoid[i]) used = true;
	        }return used ? noRepeat(range, avoid) : number;
	      };
	
	      var equal = function equal(prediction, output) {
	        for (var i in prediction) {
	          if (Math.round(prediction[i]) != output[i]) return false;
	        }return true;
	      };
	
	      var start = Date.now();
	
	      while (trial < iterations && (success < criterion || trial % 1000 != 0)) {
	        // generate sequence
	        var sequence = [],
	            sequenceLength = length - prompts.length;
	        for (i = 0; i < sequenceLength; i++) {
	          var any = Math.random() * distractors.length | 0;
	          sequence.push(distractors[any]);
	        }
	        var indexes = [],
	            positions = [];
	        for (i = 0; i < prompts.length; i++) {
	          indexes.push(Math.random() * targets.length | 0);
	          positions.push(noRepeat(sequenceLength, positions));
	        }
	        positions = positions.sort();
	        for (i = 0; i < prompts.length; i++) {
	          sequence[positions[i]] = targets[indexes[i]];
	          sequence.push(prompts[i]);
	        }
	
	        //train sequence
	        var distractorsCorrect;
	        var targetsCorrect = distractorsCorrect = 0;
	        error = 0;
	        for (i = 0; i < length; i++) {
	          // generate input from sequence
	          var input = [];
	          for (j = 0; j < symbols; j++) {
	            input[j] = 0;
	          }input[sequence[i]] = 1;
	
	          // generate target output
	          var output = [];
	          for (j = 0; j < targets.length; j++) {
	            output[j] = 0;
	          }if (i >= sequenceLength) {
	            var index = i - sequenceLength;
	            output[indexes[index]] = 1;
	          }
	
	          // check result
	          var prediction = this.network.activate(input);
	
	          if (equal(prediction, output)) {
	            if (i < sequenceLength) distractorsCorrect++;else targetsCorrect++;
	          } else {
	            this.network.propagate(rate, output);
	          }
	
	          error += cost(output, prediction);
	
	          if (distractorsCorrect + targetsCorrect == length) correct++;
	        }
	
	        // calculate error
	        if (trial % 1000 == 0) correct = 0;
	        trial++;
	        var divideError = trial % 1000;
	        divideError = divideError == 0 ? 1000 : divideError;
	        success = correct / divideError;
	        error /= length;
	
	        // log
	        if (log && trial % log == 0) console.log('iterations:', trial, ' success:', success, ' correct:', correct, ' time:', Date.now() - start, ' error:', error);
	        if (schedule.do && schedule.every && trial % schedule.every == 0) schedule.do({
	          iterations: trial,
	          success: success,
	          error: error,
	          time: Date.now() - start,
	          correct: correct
	        });
	      }
	
	      return {
	        iterations: trial,
	        success: success,
	        error: error,
	        time: Date.now() - start
	      };
	    }
	
	    // train the network to learn an Embeded Reber Grammar
	
	  }, {
	    key: 'ERG',
	    value: function ERG(options) {
	
	      options = options || {};
	      var iterations = options.iterations || 150000;
	      var criterion = options.error || .05;
	      var rate = options.rate || .1;
	      var log = options.log || 500;
	      var cost = options.cost || this.cost || Trainer.cost.CROSS_ENTROPY;
	
	      // gramar node
	      var Node = function Node() {
	        this.paths = [];
	      };
	      Node.prototype = {
	        connect: function connect(node, value) {
	          this.paths.push({
	            node: node,
	            value: value
	          });
	          return this;
	        },
	        any: function any() {
	          if (this.paths.length == 0) return false;
	          var index = Math.random() * this.paths.length | 0;
	          return this.paths[index];
	        },
	        test: function test(value) {
	          for (var i in this.paths) {
	            if (this.paths[i].value == value) return this.paths[i];
	          }return false;
	        }
	      };
	
	      var reberGrammar = function reberGrammar() {
	
	        // build a reber grammar
	        var output = new Node();
	        var n1 = new Node().connect(output, 'E');
	        var n2 = new Node().connect(n1, 'S');
	        var n3 = new Node().connect(n1, 'V').connect(n2, 'P');
	        var n4 = new Node().connect(n2, 'X');
	        n4.connect(n4, 'S');
	        var n5 = new Node().connect(n3, 'V');
	        n5.connect(n5, 'T');
	        n2.connect(n5, 'X');
	        var n6 = new Node().connect(n4, 'T').connect(n5, 'P');
	        var input = new Node().connect(n6, 'B');
	
	        return {
	          input: input,
	          output: output
	        };
	      };
	
	      // build an embeded reber grammar
	      var embededReberGrammar = function embededReberGrammar() {
	        var reber1 = reberGrammar();
	        var reber2 = reberGrammar();
	
	        var output = new Node();
	        var n1 = new Node().connect(output, 'E');
	        reber1.output.connect(n1, 'T');
	        reber2.output.connect(n1, 'P');
	        var n2 = new Node().connect(reber1.input, 'P').connect(reber2.input, 'T');
	        var input = new Node().connect(n2, 'B');
	
	        return {
	          input: input,
	          output: output
	        };
	      };
	
	      // generate an ERG sequence
	      var generate = function generate() {
	        var node = embededReberGrammar().input;
	        var next = node.any();
	        var str = '';
	        while (next) {
	          str += next.value;
	          next = next.node.any();
	        }
	        return str;
	      };
	
	      // test if a string matches an embeded reber grammar
	      var test = function test(str) {
	        var node = embededReberGrammar().input;
	        var i = 0;
	        var ch = str.charAt(i);
	        while (i < str.length) {
	          var next = node.test(ch);
	          if (!next) return false;
	          node = next.node;
	          ch = str.charAt(++i);
	        }
	        return true;
	      };
	
	      // helper to check if the output and the target vectors match
	      var different = function different(array1, array2) {
	        var max1 = 0;
	        var i1 = -1;
	        var max2 = 0;
	        var i2 = -1;
	        for (var i in array1) {
	          if (array1[i] > max1) {
	            max1 = array1[i];
	            i1 = i;
	          }
	          if (array2[i] > max2) {
	            max2 = array2[i];
	            i2 = i;
	          }
	        }
	
	        return i1 != i2;
	      };
	
	      var iteration = 0;
	      var error = 1;
	      var table = {
	        'B': 0,
	        'P': 1,
	        'T': 2,
	        'X': 3,
	        'S': 4,
	        'E': 5
	      };
	
	      var start = Date.now();
	      while (iteration < iterations && error > criterion) {
	        var i = 0;
	        error = 0;
	
	        // ERG sequence to learn
	        var sequence = generate();
	
	        // input
	        var read = sequence.charAt(i);
	        // target
	        var predict = sequence.charAt(i + 1);
	
	        // train
	        while (i < sequence.length - 1) {
	          var input = [];
	          var target = [];
	          for (var j = 0; j < 6; j++) {
	            input[j] = 0;
	            target[j] = 0;
	          }
	          input[table[read]] = 1;
	          target[table[predict]] = 1;
	
	          var output = this.network.activate(input);
	
	          if (different(output, target)) this.network.propagate(rate, target);
	
	          read = sequence.charAt(++i);
	          predict = sequence.charAt(i + 1);
	
	          error += cost(target, output);
	        }
	        error /= sequence.length;
	        iteration++;
	        if (iteration % log == 0) {
	          console.log('iterations:', iteration, ' time:', Date.now() - start, ' error:', error);
	        }
	      }
	
	      return {
	        iterations: iteration,
	        error: error,
	        time: Date.now() - start,
	        test: test,
	        generate: generate
	      };
	    }
	  }, {
	    key: 'timingTask',
	    value: function timingTask(options) {
	
	      if (this.network.inputs() != 2 || this.network.outputs() != 1) throw new Error('Invalid Network: must have 2 inputs and one output');
	
	      if (typeof options == 'undefined') options = {};
	
	      // helper
	      function getSamples(trainingSize, testSize) {
	
	        // sample size
	        var size = trainingSize + testSize;
	
	        // generate samples
	        var t = 0;
	        var set = [];
	        for (var i = 0; i < size; i++) {
	          set.push({ input: [0, 0], output: [0] });
	        }
	        while (t < size - 20) {
	          var n = Math.round(Math.random() * 20);
	          set[t].input[0] = 1;
	          for (var j = t; j <= t + n; j++) {
	            set[j].input[1] = n / 20;
	            set[j].output[0] = 0.5;
	          }
	          t += n;
	          n = Math.round(Math.random() * 20);
	          for (var k = t + 1; k <= t + n && k < size; k++) {
	            set[k].input[1] = set[t].input[1];
	          }t += n;
	        }
	
	        // separate samples between train and test sets
	        var trainingSet = [];
	        var testSet = [];
	        for (var l = 0; l < size; l++) {
	          (l < trainingSize ? trainingSet : testSet).push(set[l]);
	        } // return samples
	        return {
	          train: trainingSet,
	          test: testSet
	        };
	      }
	
	      var iterations = options.iterations || 200;
	      var error = options.error || .005;
	      var rate = options.rate || [.03, .02];
	      var log = options.log === false ? false : options.log || 10;
	      var cost = options.cost || this.cost || Trainer.cost.MSE;
	      var trainingSamples = options.trainSamples || 7000;
	      var testSamples = options.trainSamples || 1000;
	
	      // samples for training and testing
	      var samples = getSamples(trainingSamples, testSamples);
	
	      // train
	      var result = this.train(samples.train, {
	        rate: rate,
	        log: log,
	        iterations: iterations,
	        error: error,
	        cost: cost
	      });
	
	      return {
	        train: result,
	        test: this.test(samples.test)
	      };
	    }
	  }]);
	
	  return Trainer;
	}();
	
	Trainer.cost = cost;
	exports.default = Trainer;
	
	/***/ }),
	/* 4 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Architect = exports.Network = exports.Trainer = exports.Layer = exports.Neuron = undefined;
	
	var _Neuron = __webpack_require__(2);
	
	Object.defineProperty(exports, 'Neuron', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Neuron).default;
	  }
	});
	
	var _Layer = __webpack_require__(0);
	
	Object.defineProperty(exports, 'Layer', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Layer).default;
	  }
	});
	
	var _Trainer = __webpack_require__(3);
	
	Object.defineProperty(exports, 'Trainer', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Trainer).default;
	  }
	});
	
	var _Network = __webpack_require__(1);
	
	Object.defineProperty(exports, 'Network', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Network).default;
	  }
	});
	
	var _architect = __webpack_require__(7);
	
	var Architect = _interopRequireWildcard(_architect);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.Architect = Architect;
	
	/***/ }),
	/* 5 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var connections = exports.connections = 0;
	
	var Connection = function () {
	  function Connection(from, to, weight) {
	    _classCallCheck(this, Connection);
	
	    if (!from || !to) throw new Error("Connection Error: Invalid neurons");
	
	    this.ID = Connection.uid();
	    this.from = from;
	    this.to = to;
	    this.weight = typeof weight == 'undefined' ? Math.random() * .2 - .1 : weight;
	    this.gain = 1;
	    this.gater = null;
	  }
	
	  _createClass(Connection, null, [{
	    key: "uid",
	    value: function uid() {
	      return exports.connections = connections += 1, connections - 1;
	    }
	  }]);
	
	  return Connection;
	}();
	
	exports.default = Connection;
	
	/***/ }),
	/* 6 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.connections = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Layer = __webpack_require__(0);
	
	var _Layer2 = _interopRequireDefault(_Layer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// represents a connection from one layer to another, and keeps track of its weight and gain
	var connections = exports.connections = 0;
	
	var LayerConnection = function () {
	  function LayerConnection(fromLayer, toLayer, type, weights) {
	    _classCallCheck(this, LayerConnection);
	
	    this.ID = LayerConnection.uid();
	    this.from = fromLayer;
	    this.to = toLayer;
	    this.selfconnection = toLayer == fromLayer;
	    this.type = type;
	    this.connections = {};
	    this.list = [];
	    this.size = 0;
	    this.gatedfrom = [];
	
	    if (typeof this.type == 'undefined') {
	      if (fromLayer == toLayer) this.type = _Layer2.default.connectionType.ONE_TO_ONE;else this.type = _Layer2.default.connectionType.ALL_TO_ALL;
	    }
	
	    if (this.type == _Layer2.default.connectionType.ALL_TO_ALL || this.type == _Layer2.default.connectionType.ALL_TO_ELSE) {
	      for (var here in this.from.list) {
	        for (var there in this.to.list) {
	          var from = this.from.list[here];
	          var to = this.to.list[there];
	          if (this.type == _Layer2.default.connectionType.ALL_TO_ELSE && from == to) continue;
	          var connection = from.project(to, weights);
	
	          this.connections[connection.ID] = connection;
	          this.size = this.list.push(connection);
	        }
	      }
	    } else if (this.type == _Layer2.default.connectionType.ONE_TO_ONE) {
	
	      for (var neuron in this.from.list) {
	        var from = this.from.list[neuron];
	        var to = this.to.list[neuron];
	        var connection = from.project(to, weights);
	
	        this.connections[connection.ID] = connection;
	        this.size = this.list.push(connection);
	      }
	    }
	
	    fromLayer.connectedTo.push(this);
	  }
	
	  _createClass(LayerConnection, null, [{
	    key: 'uid',
	    value: function uid() {
	      return exports.connections = connections += 1, connections - 1;
	    }
	  }]);
	
	  return LayerConnection;
	}();
	
	exports.default = LayerConnection;
	
	/***/ }),
	/* 7 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Perceptron = __webpack_require__(8);
	
	Object.defineProperty(exports, 'Perceptron', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Perceptron).default;
	  }
	});
	
	var _LSTM = __webpack_require__(9);
	
	Object.defineProperty(exports, 'LSTM', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_LSTM).default;
	  }
	});
	
	var _Liquid = __webpack_require__(10);
	
	Object.defineProperty(exports, 'Liquid', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Liquid).default;
	  }
	});
	
	var _Hopfield = __webpack_require__(11);
	
	Object.defineProperty(exports, 'Hopfield', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Hopfield).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/***/ }),
	/* 8 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Network2 = __webpack_require__(1);
	
	var _Network3 = _interopRequireDefault(_Network2);
	
	var _Layer = __webpack_require__(0);
	
	var _Layer2 = _interopRequireDefault(_Layer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Perceptron = function (_Network) {
	  _inherits(Perceptron, _Network);
	
	  function Perceptron() {
	    _classCallCheck(this, Perceptron);
	
	    var _this = _possibleConstructorReturn(this, (Perceptron.__proto__ || Object.getPrototypeOf(Perceptron)).call(this));
	
	    var args = Array.prototype.slice.call(arguments); // convert arguments to Array
	    if (args.length < 3) throw new Error('not enough layers (minimum 3) !!');
	
	    var inputs = args.shift(); // first argument
	    var outputs = args.pop(); // last argument
	    var layers = args; // all the arguments in the middle
	
	    var input = new _Layer2.default(inputs);
	    var hidden = [];
	    var output = new _Layer2.default(outputs);
	
	    var previous = input;
	
	    // generate hidden layers
	    for (var i = 0; i < layers.length; i++) {
	      var size = layers[i];
	      var layer = new _Layer2.default(size);
	      hidden.push(layer);
	      previous.project(layer);
	      previous = layer;
	    }
	    previous.project(output);
	
	    // set layers of the neural network
	    _this.set({
	      input: input,
	      hidden: hidden,
	      output: output
	    });
	    return _this;
	  }
	
	  return Perceptron;
	}(_Network3.default);
	
	exports.default = Perceptron;
	
	/***/ }),
	/* 9 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Network2 = __webpack_require__(1);
	
	var _Network3 = _interopRequireDefault(_Network2);
	
	var _Layer = __webpack_require__(0);
	
	var _Layer2 = _interopRequireDefault(_Layer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var LSTM = function (_Network) {
	  _inherits(LSTM, _Network);
	
	  function LSTM() {
	    _classCallCheck(this, LSTM);
	
	    var _this = _possibleConstructorReturn(this, (LSTM.__proto__ || Object.getPrototypeOf(LSTM)).call(this));
	
	    var args = Array.prototype.slice.call(arguments); // convert arguments to array
	    if (args.length < 3) throw new Error("not enough layers (minimum 3) !!");
	
	    var last = args.pop();
	    var option = {
	      peepholes: _Layer2.default.connectionType.ALL_TO_ALL,
	      hiddenToHidden: false,
	      outputToHidden: false,
	      outputToGates: false,
	      inputToOutput: true
	    };
	    if (typeof last != 'number') {
	      var outputs = args.pop();
	      if (last.hasOwnProperty('peepholes')) option.peepholes = last.peepholes;
	      if (last.hasOwnProperty('hiddenToHidden')) option.hiddenToHidden = last.hiddenToHidden;
	      if (last.hasOwnProperty('outputToHidden')) option.outputToHidden = last.outputToHidden;
	      if (last.hasOwnProperty('outputToGates')) option.outputToGates = last.outputToGates;
	      if (last.hasOwnProperty('inputToOutput')) option.inputToOutput = last.inputToOutput;
	    } else {
	      var outputs = last;
	    }
	
	    var inputs = args.shift();
	    var layers = args;
	
	    var inputLayer = new _Layer2.default(inputs);
	    var hiddenLayers = [];
	    var outputLayer = new _Layer2.default(outputs);
	
	    var previous = null;
	
	    // generate layers
	    for (var i = 0; i < layers.length; i++) {
	      // generate memory blocks (memory cell and respective gates)
	      var size = layers[i];
	
	      var inputGate = new _Layer2.default(size).set({
	        bias: 1
	      });
	      var forgetGate = new _Layer2.default(size).set({
	        bias: 1
	      });
	      var memoryCell = new _Layer2.default(size);
	      var outputGate = new _Layer2.default(size).set({
	        bias: 1
	      });
	
	      hiddenLayers.push(inputGate);
	      hiddenLayers.push(forgetGate);
	      hiddenLayers.push(memoryCell);
	      hiddenLayers.push(outputGate);
	
	      // connections from input layer
	      var input = inputLayer.project(memoryCell);
	      inputLayer.project(inputGate);
	      inputLayer.project(forgetGate);
	      inputLayer.project(outputGate);
	
	      // connections from previous memory-block layer to this one
	      if (previous != null) {
	        var cell = previous.project(memoryCell);
	        previous.project(inputGate);
	        previous.project(forgetGate);
	        previous.project(outputGate);
	      }
	
	      // connections from memory cell
	      var output = memoryCell.project(outputLayer);
	
	      // self-connection
	      var self = memoryCell.project(memoryCell);
	
	      // hidden to hidden recurrent connection
	      if (option.hiddenToHidden) memoryCell.project(memoryCell, _Layer2.default.connectionType.ALL_TO_ELSE);
	
	      // out to hidden recurrent connection
	      if (option.outputToHidden) outputLayer.project(memoryCell);
	
	      // out to gates recurrent connection
	      if (option.outputToGates) {
	        outputLayer.project(inputGate);
	        outputLayer.project(outputGate);
	        outputLayer.project(forgetGate);
	      }
	
	      // peepholes
	      memoryCell.project(inputGate, option.peepholes);
	      memoryCell.project(forgetGate, option.peepholes);
	      memoryCell.project(outputGate, option.peepholes);
	
	      // gates
	      inputGate.gate(input, _Layer2.default.gateType.INPUT);
	      forgetGate.gate(self, _Layer2.default.gateType.ONE_TO_ONE);
	      outputGate.gate(output, _Layer2.default.gateType.OUTPUT);
	      if (previous != null) inputGate.gate(cell, _Layer2.default.gateType.INPUT);
	
	      previous = memoryCell;
	    }
	
	    // input to output direct connection
	    if (option.inputToOutput) inputLayer.project(outputLayer);
	
	    // set the layers of the neural network
	    _this.set({
	      input: inputLayer,
	      hidden: hiddenLayers,
	      output: outputLayer
	    });
	    return _this;
	  }
	
	  return LSTM;
	}(_Network3.default);
	
	exports.default = LSTM;
	
	/***/ }),
	/* 10 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Network2 = __webpack_require__(1);
	
	var _Network3 = _interopRequireDefault(_Network2);
	
	var _Layer = __webpack_require__(0);
	
	var _Layer2 = _interopRequireDefault(_Layer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Liquid = function (_Network) {
	  _inherits(Liquid, _Network);
	
	  function Liquid(inputs, hidden, outputs, connections, gates) {
	    _classCallCheck(this, Liquid);
	
	    // create layers
	    var _this = _possibleConstructorReturn(this, (Liquid.__proto__ || Object.getPrototypeOf(Liquid)).call(this));
	
	    var inputLayer = new _Layer2.default(inputs);
	    var hiddenLayer = new _Layer2.default(hidden);
	    var outputLayer = new _Layer2.default(outputs);
	
	    // make connections and gates randomly among the neurons
	    var neurons = hiddenLayer.neurons();
	    var connectionList = [];
	
	    for (var i = 0; i < connections; i++) {
	      // connect two random neurons
	      var from = Math.random() * neurons.length | 0;
	      var to = Math.random() * neurons.length | 0;
	      var connection = neurons[from].project(neurons[to]);
	      connectionList.push(connection);
	    }
	
	    for (var j = 0; j < gates; j++) {
	      // pick a random gater neuron
	      var gater = Math.random() * neurons.length | 0;
	      // pick a random connection to gate
	      var connection = Math.random() * connectionList.length | 0;
	      // let the gater gate the connection
	      neurons[gater].gate(connectionList[connection]);
	    }
	
	    // connect the layers
	    inputLayer.project(hiddenLayer);
	    hiddenLayer.project(outputLayer);
	
	    // set the layers of the network
	    _this.set({
	      input: inputLayer,
	      hidden: [hiddenLayer],
	      output: outputLayer
	    });
	    return _this;
	  }
	
	  return Liquid;
	}(_Network3.default);
	
	exports.default = Liquid;
	
	/***/ }),
	/* 11 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Network2 = __webpack_require__(1);
	
	var _Network3 = _interopRequireDefault(_Network2);
	
	var _Trainer = __webpack_require__(3);
	
	var _Trainer2 = _interopRequireDefault(_Trainer);
	
	var _Layer = __webpack_require__(0);
	
	var _Layer2 = _interopRequireDefault(_Layer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Hopfield = function (_Network) {
	  _inherits(Hopfield, _Network);
	
	  function Hopfield(size) {
	    _classCallCheck(this, Hopfield);
	
	    var _this = _possibleConstructorReturn(this, (Hopfield.__proto__ || Object.getPrototypeOf(Hopfield)).call(this));
	
	    var inputLayer = new _Layer2.default(size);
	    var outputLayer = new _Layer2.default(size);
	
	    inputLayer.project(outputLayer, _Layer2.default.connectionType.ALL_TO_ALL);
	
	    _this.set({
	      input: inputLayer,
	      hidden: [],
	      output: outputLayer
	    });
	
	    _this.trainer = new _Trainer2.default(_this);
	    return _this;
	  }
	
	  _createClass(Hopfield, [{
	    key: 'learn',
	    value: function learn(patterns) {
	      var set = [];
	      for (var p in patterns) {
	        set.push({
	          input: patterns[p],
	          output: patterns[p]
	        });
	      }return this.trainer.train(set, {
	        iterations: 500000,
	        error: .00005,
	        rate: 1
	      });
	    }
	  }, {
	    key: 'feed',
	    value: function feed(pattern) {
	      var output = this.activate(pattern);
	
	      var pattern = [];
	      for (var i in output) {
	        pattern[i] = output[i] > .5 ? 1 : 0;
	      }return pattern;
	    }
	  }]);
	
	  return Hopfield;
	}(_Network3.default);
	
	exports.default = Hopfield;
	
	/***/ })
	/******/ ]);
	});

/***/ }),
/* 335 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var getPositionIndex = function getPositionIndex(aiOutput) {
	  return aiOutput.reduce(function (bestIndex, value, index) {
	    return value > aiOutput[bestIndex] ? index : bestIndex;
	  }, 0);
	};
	
	exports.default = getPositionIndex;
	module.exports = exports["default"];

/***/ }),
/* 336 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Takes min and max then returns
	 * an random number between them.
	 */
	var random = function random(min, max) {
	    return Math.floor(Math.random() * max) + min;
	};
	/**
	 * Gets some random item from the given array.
	 * @param list
	 */
	function getRandomItem(list) {
	    if (!list) return null;
	    if (list.length === 0) return list[0];
	    var randomIndex = random(1, list.length) - 1;
	    return list[randomIndex];
	}
	exports.random = random;
	exports.getRandomItem = getRandomItem;
	//# sourceMappingURL=index.js.map
	//# sourceMappingURL=index.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=346ad2e2b622567782cc.worker.js.map