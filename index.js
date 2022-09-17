function track(trackStore) {
  return (key, callback) => {
    let tracks = trackStore[key]
    if (!tracks) {
      tracks = trackStore[key] = []
    }

    tracks.push(callback)
  }
}

function clearTrack(trackStore) {
  return (key, callback) => {
    const tracks = trackStore[key]
    const index = tracks.findIndex((item) => item === callback)
    tracks.splice(index, 1)
  }
}

function execute(trackStore, key, value) {
  const arr = trackStore[key]
  if (!arr) return

  for (const item of arr) {
    item(value)
  }
}

function proxyStore(targetObj, trackStore) {
  return new Proxy(targetObj, {
    set(target, prop, value) {
      if (target[prop] === value) return false

      target[prop] = value
      // 执行跟踪回调
      execute(trackStore, prop, value)

      return true
    },
  })
}

function proxyState(targetObj, trackStore, currentRootKey) {
  return new Proxy(targetObj, {
    set(target, prop, value) {
      if (target[prop] === value) return false

      if (typeof value === 'object') {
        // 新加入的是对象
        target[prop] = proxyState(value, trackStore, currentRootKey)
      } else {
        target[prop] = value
      }

      // 执行跟踪回调
      execute(trackStore, currentRootKey, value)

      return true
    },
  })
}

function setDeepProxyState(state, trackStore) {
  const res = {}
  let currentRootKey = ''

  // 代理第一层
  for (const key in state) {
    let value = state[key]

    if (typeof value === 'object') {
      currentRootKey = key
      recursionProxyObj(value, trackStore)
      value = proxyState(value, trackStore, currentRootKey)
    }

    res[key] = value
    currentRootKey = ''
  }

  // 递归代理 proxyTarget 中的对象类型
  function recursionProxyObj(proxyTarget, trackStore) {
    for (const key in proxyTarget) {
      const value = proxyTarget[key]
      if (typeof value === 'object') {
        const proxyRes = proxyState(value, trackStore, currentRootKey)
        proxyTarget[key] = proxyRes
        recursionProxyObj(proxyRes, trackStore)
      }
    }
  }

  return res
}

function xlStore(store) {
  const trackStore = {}
  const { state, actions } = store

  const watch = track(trackStore)
  const clearWatch = clearTrack(trackStore)
  const deepProxyState = setDeepProxyState(state, trackStore)

  const content = {
    ...deepProxyState,
    ...actions,
    watch,
    clearWatch,
  }
  const storeProxy = proxyStore(content, trackStore)

  return storeProxy
}

module.exports = xlStore
