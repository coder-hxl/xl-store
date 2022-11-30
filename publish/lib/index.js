'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function verifyActions(actions) {
  for (var key in actions) {
    var value = actions[key];
    if (typeof value !== 'function') {
      throw new Error('actions 里只能放函数');
    }
  }
}
function verifyState(state) {
  if (state === null || _typeof(state) !== 'object') {
    throw new Error('state 必须是对象');
  }
}
function verifyStoreArgs(storeArg) {
  var _storeArg$state = storeArg.state,
    state = _storeArg$state === void 0 ? {} : _storeArg$state,
    _storeArg$actions = storeArg.actions,
    actions = _storeArg$actions === void 0 ? {} : _storeArg$actions;
  verifyState(state);
  verifyActions(actions);
}
function track(instance) {
  var isEffect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  function addSingleTrack(key, callback) {
    if (isEffect) {
      var value = instance.state[key];
      callback(key, value);
    }
    var trackStore = instance.trackStore;
    var trackSet = trackStore[key];
    if (!trackSet) {
      trackSet = trackStore[key] = new Set();
    }
    trackSet.add(callback);
  }
  return function (target, callback) {
    if (Array.isArray(target)) {
      var _iterator = _createForOfIteratorHelper(target),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          addSingleTrack(item, callback);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      addSingleTrack(target, callback);
    }
  };
}
function deleteTrack(_ref) {
  var trackStore = _ref.trackStore;
  function deleteSingleTrack(key, callback) {
    var trackSet = trackStore[key];
    if (!trackSet) return;
    trackSet["delete"](callback);
  }
  return function (target, callback) {
    if (Array.isArray(target)) {
      var _iterator2 = _createForOfIteratorHelper(target),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;
          deleteSingleTrack(item, callback);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } else {
      deleteSingleTrack(target, callback);
    }
  };
}
function execute(instance, rootKey) {
  var trackStore = instance.trackStore;
  var value = instance.state[rootKey];
  var trackSet = trackStore[rootKey];
  if (!trackSet) return;
  var _iterator3 = _createForOfIteratorHelper(trackSet),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var effect = _step3.value;
      effect(rootKey, value);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
} // inDeepProxy: 防止在 Proxy 过程中触发副作用函数
var inDeepProxy = false;
var currentRootKey = null;
function proxyInstance(instance) {
  var state = instance.state,
    actions = instance.actions,
    storeApi = instance.storeApi;
  return new Proxy(instance, {
    // storeApi => state => actions
    get: function get(_, prop) {
      if (prop in storeApi) {
        return storeApi[prop];
      } else if (prop in state) {
        return state[prop];
      } else if (prop in actions) {
        return actions[prop];
      } else {
        return undefined;
      }
    },
    set: function set(_, prop, value) {
      if (prop in storeApi) {
        throw new Error("".concat(prop, " \u662F Store \u81EA\u5E26\u7684\u4E0D\u5141\u8BB8\u88AB\u4FEE\u6539"));
      } else if (prop in state) {
        state[prop] = value;
        return true;
      } else if (prop in actions) {
        throw new Error("".concat(prop, " \u662F actions , \u4E0D\u5141\u8BB8\u5728\u6B64\u88AB\u4FEE\u6539"));
      } else {
        throw new Error("".concat(prop, " \u4E0D\u5141\u8BB8\u88AB\u4FEE\u6539\u6216\u6DFB\u52A0"));
      }
    }
  });
}
function proxyState(instance, targetObj) {
  var rootKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var isDeepWatch = instance.options.isDeepWatch;
  return new Proxy(targetObj, {
    set: function set(target, prop, value) {
      // 值不变就无需执行收集到的依赖
      if (target[prop] === value) return true;
      if (isDeepWatch) {
        if (inDeepProxy) {
          target[prop] = value;
          return true;
        } else if (_typeof(value) === 'object' && value !== null) {
          currentRootKey = rootKey !== null && rootKey !== void 0 ? rootKey : prop;
          target[prop] = deepProxyState(instance, value);
          currentRootKey = null;
        } else {
          target[prop] = value;
        }
      } else {
        target[prop] = value;
      }
      execute(instance, rootKey !== null && rootKey !== void 0 ? rootKey : prop);
      return true;
    }
  });
}
function deepProxyState(instance, rawTarget) {
  var isRootObj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // 设置根容器
  var rootContainer = Array.isArray(rawTarget) ? [] : {};
  function recursionProxy(target, upContainer) {
    var isRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    for (var key in target) {
      var value = target[key];
      if (isRoot) {
        currentRootKey = key;
      }
      // 从底层开始逐上进行 proxy
      /*
        1.引用类型
          1.1. 创建容器, 继续递归下去
          1.2. 容器填充结束后进行 proxy 代理, 代理结果赋值给上一个容器
                2.普通类型
          直接赋值给上一个容器
      */
      if (_typeof(value) === 'object' && value !== null) {
        var container = Array.isArray(value) ? [] : {};
        recursionProxy(value, container);
        upContainer[key] = proxyState(instance, container, currentRootKey);
      } else {
        upContainer[key] = value;
      }
      if (isRoot) {
        currentRootKey = null;
      }
    }
  }
  inDeepProxy = true;
  recursionProxy(rawTarget, rootContainer, isRootObj);
  inDeepProxy = false;
  return proxyState(instance, rootContainer, isRootObj ? null : currentRootKey);
}
var instanceId = 0;
function handleState(instance, rawTarget) {
  var isDeepWatch = instance.options.isDeepWatch;
  var proxyStateRes = isDeepWatch ? deepProxyState(instance, rawTarget, true) : proxyState(instance, rawTarget);
  instance.state = proxyStateRes;
}
function handleStoreApi(instance) {
  var storeApi = {
    watch: track(instance),
    watchEffect: track(instance, true),
    deleteWatch: deleteTrack(instance)
  };
  instance.storeApi = storeApi;
}
function createInstance(storeArgs) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _storeArgs$state = storeArgs.state,
    state = _storeArgs$state === void 0 ? {} : _storeArgs$state,
    _storeArgs$actions = storeArgs.actions,
    actions = _storeArgs$actions === void 0 ? {} : _storeArgs$actions;
  // 创建实例对象
  var instance = {
    id: instanceId++,
    trackStore: {},
    storeApi: {},
    state: {},
    actions: actions,
    options: options
  };
  handleStoreApi(instance);
  handleState(instance, state);
  return instance;
}
function xlStore(storeArgs, options) {
  verifyStoreArgs(storeArgs);
  var instance = createInstance(storeArgs, options);
  var proxyInstanceRes = proxyInstance(instance);
  return proxyInstanceRes;
}
module.exports = xlStore;