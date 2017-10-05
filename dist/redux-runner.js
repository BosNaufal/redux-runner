/*!
 * Copyright (c) Naufal Rabbani (http://github.com/BosNaufal)
 * Licensed Under MIT (http://opensource.org/licenses/MIT)
 * 
 * Redux Runner @ Version 0.0.3
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Redux Runner"] = factory();
	else
		root["Redux Runner"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.race = exports.concurrent = exports.delay = exports.patch = exports.select = exports.dispatch = exports.call = exports.Runner = exports.getFunction = exports.action = exports.registerModule = exports.combineModule = exports.ReduxRunner = undefined;

	var _middleware = __webpack_require__(1);

	var _middleware2 = _interopRequireDefault(_middleware);

	var _action = __webpack_require__(4);

	var _action2 = _interopRequireDefault(_action);

	var _combineModule = __webpack_require__(5);

	var _getFunction = __webpack_require__(7);

	var _getFunction2 = _interopRequireDefault(_getFunction);

	var _Runner = __webpack_require__(2);

	var _Runner2 = _interopRequireDefault(_Runner);

	var _wrapper = __webpack_require__(8);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.ReduxRunner = _middleware2.default;
	exports.combineModule = _combineModule.combineModule;
	exports.registerModule = _combineModule.registerModule;
	exports.action = _action2.default;
	exports.getFunction = _getFunction2.default;
	exports.Runner = _Runner2.default;
	exports.call = _wrapper.call;
	exports.dispatch = _wrapper.dispatch;
	exports.select = _wrapper.select;
	exports.patch = _wrapper.patch;
	exports.delay = _wrapper.delay;
	exports.concurrent = _wrapper.concurrent;
	exports.race = _wrapper.race;
	exports.default = _middleware2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = ReduxRunner;

	var _Runner = __webpack_require__(2);

	var _Runner2 = _interopRequireDefault(_Runner);

	var _utils = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var doAction = function doAction(action, store) {
	  var useRunner = (0, _utils.isGeneratorFunction)(action);
	  if (useRunner) {
	    return (0, _Runner2.default)(action, store);
	  }
	  var getState = store.getState,
	      dispatch = store.dispatch;

	  return action({ getState: getState, dispatch: dispatch });
	};

	function ReduxRunner(store) {
	  return function (next) {
	    return function (action) {
	      if (action.name && action.fn) {
	        // Action with name
	        store.dispatch({ type: action.name });
	        return doAction(action.fn, store);
	      } else if (!action.name && action.fn) {
	        // Action without name
	        return doAction(action.fn, store);
	      } else {
	        // If Ordinary dispatch (for store state mutation)
	        return next(action);
	      }
	    };
	  };
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.doPromise = doPromise;
	exports.runGenerator = runGenerator;
	exports.makeAResponse = makeAResponse;
	exports.getParallelParameter = getParallelParameter;
	exports.runParallel = runParallel;
	exports.setWrapperType = setWrapperType;
	exports.destructureWrapper = destructureWrapper;
	exports.default = Runner;

	var _utils = __webpack_require__(3);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 * To apply the comment in the iterator scope
	 * @param  {Any} appliedFunction the returned value of some function
	 * @param  {Function} done the callback after promised applied
	 * @param  {Any} scope the variable scope of current Runner
	 * @return {Any} Can be callback or run the next iterator
	 */
	function doPromise(appliedFunction, done, scope) {
	  var runNext = scope.runNext,
	      currentRunningFunction = scope.currentRunningFunction;

	  return appliedFunction.then(function (res) {
	    if (done) return done(res);
	    return runNext(currentRunningFunction, res);
	  });
	}

	// Callback Arguments is indicate that current wrapper is promise or array generator function
	/**
	 * Run Single Iterator of Generator Function. And it should be a wrapper
	 * @param {Object} wrapper The wrapper to runNext
	 * @param {Function} callback The Callback when the function of wrapper need a callback or just to use it for runGenerator callback itself
	 * @param {Object} scope Variable Scope of current Runner
	 * @return {Any} It can be runNext, or doPromise, or callback function
	 */
	function runGenerator(wrapper, callback, scope) {
	  var Runner = scope.Runner,
	      runNext = scope.runNext,
	      currentRunningFunction = scope.currentRunningFunction,
	      store = scope.store;
	  var method = wrapper.method,
	      func = wrapper.func,
	      args = wrapper.args;

	  if (method === "CALL") {
	    if ((0, _utils.isFunction)(func)) {
	      var appliedFunction = func.apply(func, args);

	      if ((0, _utils.isPromise)(appliedFunction)) {
	        return doPromise(appliedFunction, callback, scope);
	      }

	      if ((0, _utils.isGeneratorFunction)(func)) {
	        return Runner(func, store).then(function (res) {
	          if (callback) return callback(res);
	          return runNext(currentRunningFunction, res);
	        });
	      }

	      if (callback) return callback(appliedFunction);
	      return runNext(currentRunningFunction, appliedFunction);
	    }
	  }

	  if (method === "DISPATCH") {
	    store.dispatch(func.apply(undefined, _toConsumableArray(args))).then(function (response) {
	      return runNext(currentRunningFunction, response);
	    });
	  }

	  if (method === "SELECT") {
	    var statePath = args;
	    var response = statePath ? store.getState()[statePath] : store.getState();
	    return runNext(currentRunningFunction, response);
	  }

	  if (method === "PATCH") {
	    var _response = store.dispatch({
	      type: "$$PATCHER$$",
	      args: args,
	      getState: store.getState
	    });
	    return runNext(currentRunningFunction, _response);
	  }
	};

	/**
	 * To make a valid response of the current item of runParallel Function iteration
	 * @param {Any} param.allResponses It can be an Object or Array represent the current state of all responses
	 * @param {Number} param.index Current iteration index
	 * @param {Any} param.res Current response that will be stored to the allResponses Object/Array
	 * @param {Any} param.key It can be false or string to assign a value to the allResponses Object
	 * @param {Object} param.wrapper The Wrapper
	 * @return {Any} It can be Array or Object. It represent the new allResponses Object
	 */
	function makeAResponse(_ref) {
	  var allResponses = _ref.allResponses,
	      index = _ref.index,
	      res = _ref.res,
	      key = _ref.key,
	      wrapper = _ref.wrapper;

	  if (wrapper.type === "concurrent") {
	    allResponses.push(res);
	    return allResponses;
	  }
	  if (wrapper.type === "race") {
	    if ((0, _utils.objectHasBeenFilled)(allResponses)) return allResponses;
	    allResponses[key] = res;
	    return allResponses;
	  }
	  if (key) allResponses[key] = res;else allResponses.splice(index, 0, res);
	  return allResponses;
	}

	/**
	 * Before do the runParallel we need to describe the sign when it should be done
	 * @param {Array} wrappers The array of wrapper
	 * @return {Object} Return done function to stop the runParallel and allResponses intial value
	 */
	function getParallelParameter(wrappers) {
	  // get one as a sample
	  var isArrayObject = wrappers[0].key;
	  var allResponses = isArrayObject ? {} : [];
	  var isDone = function isDone(wrappers) {
	    if (isArrayObject) {
	      return Object.keys(allResponses).length === Object.keys(wrappers).length;
	    }
	    return allResponses.length === wrappers.length;
	  };
	  return { allResponses: allResponses, isDone: isDone };
	}

	/**
	 * Run the all the wrapper function at once
	 * @param {Array} wrappers The array of wrapper
	 * @param {Object} scope Variable scope of current Runner
	 * @return {runNext} To run the next iteration of current Runner
	 */
	function runParallel(wrappers, scope) {
	  var runNext = scope.runNext,
	      currentRunningFunction = scope.currentRunningFunction;

	  var _getParallelParameter = getParallelParameter(wrappers),
	      allResponses = _getParallelParameter.allResponses,
	      isDone = _getParallelParameter.isDone;

	  var isRace = wrappers[0].type === "race";

	  var _loop = function _loop() {
	    var wrapper = wrappers[i];
	    var index = i;
	    var key = wrapper.key || false;
	    runGenerator(wrapper, function (res) {
	      allResponses = makeAResponse({ allResponses: allResponses, index: index, key: key, res: res, wrapper: wrapper });
	      if (isDone(wrappers) || isRace && (0, _utils.objectHasBeenFilled)(allResponses)) {
	        return runNext(currentRunningFunction, allResponses);
	      }
	    }, scope);
	  };

	  for (var i = 0; i < wrappers.length; i++) {
	    _loop();
	  }
	}

	/**
	 * Inject The Array of wrapper to have a valid structure
	 * @param {Any} wrappers It can be Array of wrapper or object Wrapper
	 * @param {String} type Current Type To Inject
	 * @return {Array} The new array of wrapper with type on each member
	 */
	function setWrapperType(wrappers, type) {
	  if ((0, _utils.isArray)(wrappers)) {
	    return wrappers.map(function (item) {
	      return _extends({}, item, { type: type });
	    });
	  }

	  if ((0, _utils.isObject)(wrappers)) {
	    return Object.keys(wrappers).map(function (key) {
	      var value = wrappers[key];
	      return _extends({}, value, { type: type, key: key });
	    });
	  }
	}

	/**
	 * Destruct after yield statement and convert it to array of wrapper. We call them "wrappers"
	 * @param  {Any} wrapper It can be a wrapper or just ordinary object or array
	 * @return {setWrapperType} setWrapperType represent the result of it
	 */
	function destructureWrapper(wrapper) {
	  var arrayObjectFunction = (0, _utils.isObject)(wrapper) && !wrapper.method;
	  if (arrayObjectFunction) return setWrapperType(wrapper);
	  if (!wrapper.method) return wrapper;
	  var func = wrapper.func;

	  if (wrapper.method === "CONCURRENT") {
	    return setWrapperType(func, "concurrent");
	  }
	  if (wrapper.method === "RACE") {
	    return setWrapperType(func, "race");
	  }
	}

	/**
	 * The RUNNER! To run the generator function. The Runner will set the variable scope of current running Generator Function
	 * @param {Function} genFunc Generator Function that will be runned
	 * @param {Object} [store={}] The initial Object to starting generator function
	 * @return {Promise} The result will be promise. So we wait the Runner till it done
	 */
	function Runner(genFunc) {
	  var store = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  return new Promise(function (resolve, reject) {
	    var currentRunningFunction = typeof genFunc === "function" ? genFunc(store) : genFunc;

	    /**
	     * The Recursive Function to run the next iteration of Current Generator Function
	     * @param {Generator} currentRunningFunction Current iterator of generator function
	     * @param {Any} [respon=null] The last response or the last value to pass it ot the next iterator
	     * @return {Any} It can be Recursively run the runNext, runParallel, runGenerator Function or just resolve the promise
	     */
	    function runNext(currentRunningFunction) {
	      var response = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	      var nextRun = currentRunningFunction.next(response);
	      var wrapper = nextRun.value;
	      var isDone = nextRun.done;

	      var scope = { Runner: Runner, runNext: runNext, currentRunningFunction: currentRunningFunction, store: store };

	      if (!isDone) {
	        if (!wrapper) {
	          throw new Error('[Redux Runner]: Please wrap the function next to yield statement inside the effects e.g. "call" or "put"');
	        }

	        var isOrdinaryGenFunc = (0, _utils.isFunction)(wrapper.func);
	        if (isOrdinaryGenFunc) {
	          return runGenerator(wrapper, false, scope);
	        } else if ((0, _utils.isObject)(wrapper) || (0, _utils.isArray)(wrapper)) {
	          var wrappers = destructureWrapper(wrapper);
	          return runParallel(wrappers, scope);
	        } else {
	          return runNext(currentRunningFunction, wrapper);
	        }
	      } else {
	        resolve(nextRun.value);
	      }
	    }

	    return runNext(currentRunningFunction);
	  });
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.isFunction = isFunction;
	exports.isPromise = isPromise;
	exports.isGeneratorFunction = isGeneratorFunction;
	exports.isObject = isObject;
	exports.isArray = isArray;
	exports.objectHasBeenFilled = objectHasBeenFilled;

	/**
	 * To Check it is a Function or not
	 * @param {Function} obj The Function to Check
	 * @return {Boolean} The result
	 */
	function isFunction(func) {
	  return typeof func === 'function';
	}

	/**
	 * To Check it is a Promise or not
	 * @param {Any} appliedFunction The applied Promise function
	 * @return {Boolean} The result
	 */
	function isPromise(appliedFunction) {
	  return appliedFunction.then !== undefined;
	}

	/**
	 * To Check it is a Generator Function or not
	 * @param {Function} func The Function to check
	 * @return {Boolean} The result
	 */
	function isGeneratorFunction(func) {
	  return typeof func.prototype.next === "function";
	}

	/**
	 * To Check it is an Object or not
	 * @param {Object} obj The Object to Check
	 * @return {Boolean} The result
	 */
	function isObject(obj) {
	  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !obj.length;
	}

	/**
	 * To Check it is an array or not
	 * @param {Array} arr The Array to Check
	 * @return {Boolean} The result
	 */
	function isArray(arr) {
	  return (typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) === 'object' && arr.length;
	}

	/**
	 * To check wheter the object is filled or not. This will return false if the object has one keys
	 * @param {Object} obj The object to check
	 * @return {Boolean} The Result
	 */
	function objectHasBeenFilled(obj) {
	  return Object.keys(obj).length !== 0;
	}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = action;

	var _utils = __webpack_require__(3);

	function action(name, fn) {
	  if ((0, _utils.isFunction)(fn) && (0, _utils.isString)(name)) {
	    return {
	      name: name,
	      fn: fn
	    };
	  } else {
	    return {
	      fn: name
	    };
	  }
	};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.registerModule = registerModule;
	exports.combineModule = combineModule;

	var _globalReducer = __webpack_require__(6);

	var _globalReducer2 = _interopRequireDefault(_globalReducer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function registerModule(store, name, module) {
	  var nextReducer = combineModule(_extends({}, store.Store.modules, _defineProperty({}, name, module))).reducer;
	  store.replaceReducer(nextReducer);
	}

	function combineModule(modules) {
	  var flatModule = [];
	  var reducers = [];
	  var initialState = {};
	  Object.keys(modules).forEach(function (name) {
	    var module = modules[name];
	    var reducer = module.reducer;
	    var state = module.initialState;
	    reducers = [].concat(_toConsumableArray(reducers), [reducer]);

	    initialState = _extends({}, initialState, _defineProperty({}, name, state));

	    flatModule = [].concat(_toConsumableArray(flatModule), [_extends({}, module, { name: name })]);
	  });

	  var reducer = _globalReducer2.default.bind(null, flatModule, reducers, initialState);
	  return { reducer: reducer, initialState: initialState, modules: modules };
	}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = globalReducer;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function makeReducer(globalState, action, name, realReducer) {
	  var subStoreState = globalState[name];
	  return _extends({}, globalState, _defineProperty({}, name, realReducer(subStoreState, action)));
	}

	function globalReducer(modules, reducers, initialState) {
	  var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : initialState;
	  var action = arguments[4];

	  state = state || initialState;
	  var newState = state;

	  switch (action.type) {
	    case "$$PATCHER$$":
	      {
	        var args = action.args,
	            getState = action.getState;

	        var subStoreName = args[0];
	        var patchFunction = args[0];
	        if (typeof subStoreName === "string") {
	          patchFunction = args[1];
	          var mutation = patchFunction(getState()[subStoreName]);
	          newState = _extends({}, state, _defineProperty({}, subStoreName, _extends({}, state[subStoreName], mutation)));
	        } else {
	          var _mutation = patchFunction(getState());
	          newState = _extends({}, state, _mutation);
	        }
	      }
	  }

	  if (action.type === "$$PATCHER$$") return newState;

	  // https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
	  return reducers.reduce(function (currentState, currentReducer, index) {
	    return makeReducer(currentState, action, modules[index].name, currentReducer);
	  }, newState);
	}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getFunction;
	function getFunction(thunk, payload) {
	  var action = thunk(payload);
	  return action.fn;
	}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.call = call;
	exports.dispatch = dispatch;
	exports.select = select;
	exports.patch = patch;
	exports.concurrent = concurrent;
	exports.race = race;
	exports.delay = delay;

	/**
	 * Extract the argument to be a Object contains function and its argument
	 * @param {Array} args Arguments of some method
	 * @return {Object} Represent the function and its arguments
	 */
	function destructureArguments(args) {
	  var func = args[0];
	  args = Array.prototype.slice.call(args, 1, args.length);
	  if (typeof func !== 'function') throw new Error("[Redux Runner]: First Argument Should Be a Function");
	  return { func: func, args: args };
	}

	/**
	 * Wrap a function
	 * @param {String} method Method name
	 * @param {Function} func The Function
	 * @param {Array} args all arguments that will be passed to the function
	 * @return {Object} The wrapper object to run
	 */
	function wrapIt(method, func, args) {
	  return {
	    wrapped: true,
	    method: method,
	    func: func,
	    args: args
	  };
	};

	/**
	 * Shortcut to make a call wrapper
	 * @return {wrapIt} Represent the object wrapper
	 */
	function call() {
	  var _destructureArguments = destructureArguments(arguments),
	      func = _destructureArguments.func,
	      args = _destructureArguments.args;

	  return wrapIt("CALL", func, args);
	};

	function fakeFunction() {}

	/**
	 * Shortcut to make a dispatch wrapper
	 * @return {wrapIt} Represent the object wrapper
	 */
	function dispatch() {
	  var _destructureArguments2 = destructureArguments(arguments),
	      func = _destructureArguments2.func,
	      args = _destructureArguments2.args;

	  return wrapIt("DISPATCH", func, args);
	};

	/**
	 * Shortcut to make a select wrapper
	 * @return {wrapIt} Represent the object wrapper
	 */
	function select() {
	  return wrapIt("SELECT", fakeFunction, arguments[0]);
	};

	/**
	 * Shortcut to make a patch wrapper
	 * @return {wrapIt} Represent the object wrapper
	 */
	function patch() {
	  return wrapIt("PATCH", fakeFunction, [arguments[0], arguments[1]]);
	};

	/**
	 * Shortcut to make a concurrent wrapper
	 * @return {wrapIt} Represent the object wrapper
	 */
	function concurrent(array) {
	  return wrapIt("CONCURRENT", array);
	};

	/**
	 * Shortcut to make a race wrapper
	 * @return {wrapIt} Represent the object wrapper
	 */
	function race(array) {
	  return wrapIt("RACE", array);
	};

	/**
	 * Helper To make a promised delay
	 * @return {Promise} The promise to handle delay
	 */
	function delay(time) {
	  return new Promise(function (resolve, reject) {
	    setTimeout(function () {
	      resolve(true);
	    }, time);
	  });
	}

	exports.default = { call: call, concurrent: concurrent, race: race, delay: delay };

/***/ })
/******/ ])
});
;