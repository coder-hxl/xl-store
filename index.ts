interface IState {
  [key: string]: any
}
interface IActions {
  [key: string]: any
}
interface IStoreArg {
  state: IState
  actions: IActions
}

type ITrackStore = {
  [key: string]: Function[]
}

interface IProxyStateTraget {
  watch(key: string, callback: Function): void
  clearWatch(key: string, callback: Function): void
  [key: string]: any
}

function track(trackStore: ITrackStore) {
  return (key: string, callback: Function) => {
    let tracks = trackStore[key]
    if (!tracks) {
      tracks = trackStore[key] = []
    }

    tracks.push(callback)
  }
}

function clearTrack(trackStore: ITrackStore) {
  return (key: string, callback: Function) => {
    const tracks = trackStore[key]
    const index = tracks.findIndex((item) => item === callback)
    tracks.splice(index, 1)
  }
}

function execute(trackStore: ITrackStore, key: string, value: any) {
  const arr = trackStore[key]
  if (!arr) return

  for (const item of arr) {
    item(value)
  }
}

function proxyStore(targetObj: IProxyStateTraget, trackStore: ITrackStore) {
  return new Proxy(targetObj, {
    set(target, prop, value) {
      if (target[prop as any] === value) return false

      target[prop as any] = value
      // 执行跟踪回调
      execute(trackStore, prop as any, value)

      return true
    },
  })
}

function proxyState(
  targetObj: IState,
  trackStore: ITrackStore,
  currentRootKey: string
) {
  return new Proxy(targetObj, {
    set(target, prop, value) {
      if (target[prop as any] === value) return false

      if (typeof value === 'object') {
        // 新加入的是对象
        target[prop as any] = proxyState(value, trackStore, currentRootKey)
      } else {
        target[prop as any] = value
      }

      // 执行跟踪回调
      execute(trackStore, currentRootKey, value)

      return true
    },
  })
}

function setDeepProxyState(state: IState, trackStore: ITrackStore) {
  const res: any = {}
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
  function recursionProxyObj(proxyTarget: any, trackStore: ITrackStore) {
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

function xlStore(store: IState) {
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
