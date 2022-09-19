let instanceId = 0;
let inDeepProxy = false;
let currentRootKey = null;
function verifyActions(actions) {
  for (const key in actions) {
    const value = actions[key];
    if (typeof value !== "function") {
      throw new Error("actions 里只能放函数");
    }
  }
}
function verifyState(state) {
  if (state === null || typeof state !== "object") {
    throw new Error("state 必须是对象");
  }
}
function track(trackStore) {
  return (key, callback) => {
    let trackSet = trackStore[key];
    if (!trackSet) {
      trackSet = trackStore[key] = new Set();
    }
    trackSet.add(callback);
  };
}
function deleteTrack(trackStore) {
  return (key, callback) => {
    const trackSet = trackStore[key];
    trackSet.delete(callback);
  };
}
function execute(instance, rootKey) {
  const { trackStore } = instance;
  const value = instance.state[rootKey];
  const trackSet = trackStore[rootKey];
  if (!trackSet) return;
  for (const item of trackSet) {
    item(value);
  }
}
function proxyStore(instance, storeApi) {
  const { state, actions } = instance;
  return new Proxy(instance, {
    get(_, prop) {
      if (prop in storeApi) {
        return storeApi[prop];
      } else if (prop in state) {
        return state[prop];
      } else if (prop in actions) {
        return actions[prop];
      } else {
        throw new Error(`没有找到 ${prop}`);
      }
    },
    set(_, prop, value) {
      if (prop in storeApi) {
        throw new Error(`${prop} 是系统方法不允许被修改`);
      } else if (prop in state) {
        return (state[prop] = value);
      } else if (prop in actions) {
        throw new Error(`${prop} 是 actions 的方法, 不允许被修改`);
      } else {
        throw new Error(`${prop} 请在创建 Store 时添加到 State 或 Actions 中`);
      }
    },
  });
}
function proxyState(instance, targetObj, rootKey = null) {
  return new Proxy(targetObj, {
    set(target, prop, value) {
      if (target[prop] === value) return false;
      if (inDeepProxy) {
        return (target[prop] = value);
      } else if (typeof value === "object" && value !== null) {
        currentRootKey = rootKey ? rootKey : prop;
        target[prop] = deepProxyState(instance, value);
        currentRootKey = null;
      } else {
        target[prop] = value;
      }
      if (rootKey) {
        execute(instance, rootKey);
      } else {
        execute(instance, prop);
      }
      return true;
    },
  });
}
function deepProxyState(instance, rawTarget, isRootObj = false) {
  // 设置根容器
  let rootContainer = {};
  if (Array.isArray(rawTarget)) {
    rootContainer = [];
  }
  inDeepProxy = true;
  function recursionProxy(target, upContainer, isRoot = false) {
    for (const key in target) {
      const value = target[key];
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
      if (typeof value === "object" && value !== null) {
        let container = {};
        if (Array.isArray(value)) {
          container = [];
        }
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
  recursionProxy(rawTarget, rootContainer, isRootObj);
  inDeepProxy = false;
  return isRootObj
    ? proxyState(instance, rootContainer)
    : proxyState(instance, rootContainer, currentRootKey);
}
function createStoreInstance(rawState, actions) {
  // 创建实例对象
  const instance = {
    id: instanceId++,
    trackStore: {},
    state: {},
    actions,
  };
  // 实例对象初始化
  // 给 state 进行代理
  instance.state = deepProxyState(instance, rawState, true);
  return instance;
}
function createStoreApi(instance) {
  const { trackStore } = instance;
  const storeApi = {
    watch: track(trackStore),
    deleteWatch: deleteTrack(trackStore),
  };
  return storeApi;
}
export default function xlStore(store) {
  const state = store.state ?? {};
  const actions = store.actions ?? {};
  verifyState(state);
  verifyActions(actions);
  const instance = createStoreInstance(state, actions);
  const storeApi = createStoreApi(instance);
  const storeProxy = proxyStore(instance, storeApi);
  return storeProxy;
}
