let instanceId = 0
let inDeepPorxy = false

function verifyActions(actions) {
  for (const key in actions) {
    const value = actions[key]

    if (typeof value !== 'function') {
      throw new Error('actions 里只能放函数')
    }
  }
}

function track(trackStore) {
  return (key, callback) => {
    let trackSet = trackStore[key]
    if (!trackSet) {
      trackSet = trackStore[key] = new Set()
    }

    trackSet.add(callback)
  }
}

function deleteTrack(trackStore) {
  return (key, callback) => {
    const trackSet = trackStore[key]
    trackSet.delete(callback)
  }
}

function execute(instance, key) {
  const { trackStore } = instance
  const value = instance.state[key]
  const trackSet = trackStore[key]
  if (!trackSet) return

  for (const item of trackSet) {
    item(value)
  }
}

function proxyStore(instance, storeApi) {
  const { state, actions } = instance

  return new Proxy(instance, {
    get(_, prop) {
      if (prop in storeApi) {
        return storeApi[prop]
      } else if (prop in state) {
        return state[prop]
      } else if (prop in actions) {
        return actions[prop]
      } else {
        throw new Error('没有该属性或方法')
      }
    },
    set(_, prop, value) {
      if (prop in storeApi) {
        throw new Error('系统方法不允许设置')
      } else if (prop in state) {
        return (state[prop] = value)
      } else if (prop in actions) {
        throw new Error('actions, 该方法不允许直接设置')
      } else {
        throw new Error('请在创建 Store 时添加到 State 或 Actions 中')
      }
    },
  })
}

let currentRootKey = null
function proxyState(
  instance,
  targetObj,
  trackStore,
  isRawState,
  rootKey = null
) {
  return new Proxy(targetObj, {
    set(target, prop, value) {
      if (isRawState) {
        if (!(prop in target)) return false
      }

      if (inDeepPorxy) {
        return (target[prop] = value)
      } else if (typeof value === 'object') {
        currentRootKey = prop
        inDeepPorxy = true
        const proxyRes = (target[prop] = proxyState(
          instance,
          value,
          trackStore,
          false,
          prop
        ))
        recursionProxyObj(instance, proxyRes, trackStore, false)
        currentRootKey = null
        inDeepPorxy = false
      } else {
        target[prop] = value
      }

      if (isRawState) {
        execute(instance, prop)
      } else {
        execute(instance, rootKey)
      }

      return true
    },
  })
}

function recursionProxyObj(instance, target, trackStore, isRoot = false) {
  for (const key in target) {
    const value = target[key]
    if (typeof value === 'object' && value !== null) {
      if (isRoot) {
        currentRootKey = key
      }

      const proxyRes = proxyState(
        instance,
        value,
        trackStore,
        false,
        currentRootKey
      )
      target[key] = proxyRes

      recursionProxyObj(instance, proxyRes, trackStore)

      if (isRoot) {
        currentRootKey = null
      }
    }
  }
}

function deepProxyState(instance, rawState) {
  const { trackStore } = instance

  const store = (instance.state = proxyState(
    instance,
    rawState,
    trackStore,
    true
  ))

  inDeepPorxy = true
  recursionProxyObj(instance, store, trackStore, true)
  inDeepPorxy = false
}

function createStoreInstance(state, actions) {
  // 创建实例对象
  const instance = {
    id: instanceId++,
    trackStore: {},
    state: {},
    actions,
  }

  // 实例对象初始化
  // 给 state 进行代理
  deepProxyState(instance, state)

  return instance
}

function createStoreApi(instance) {
  const { trackStore } = instance

  const storeApi = {
    watch: track(trackStore),
    deleteWatch: deleteTrack(trackStore),
  }

  return storeApi
}

export default function xlStore(store) {
  const { state = {}, actions = {} } = store
  verifyActions(actions)

  const instance = createStoreInstance(state, actions)
  const storeApi = createStoreApi(instance)

  const storeProxy = proxyStore(instance, storeApi)

  return storeProxy
}
