import {
  IState,
  IActions,
  IStoreArg,
  ITrackStore,
  IInstance,
  IStoreApi,
} from './types'

let instanceId = 0
let inDeepPorxy = false

function verifyActions(actions: IActions = {}) {
  for (const key in actions) {
    const value = actions[key]

    if (typeof value !== 'function') {
      throw new Error('actions 里只能放函数')
    }
  }
}

function track(trackStore: ITrackStore) {
  return (key: string, callback: Function) => {
    let trackSet = trackStore[key]
    if (!trackSet) {
      trackSet = trackStore[key] = new Set()
    }

    trackSet.add(callback)
  }
}

function deleteTrack(trackStore: ITrackStore) {
  return (key: string, callback: Function) => {
    const trackSet = trackStore[key]
    trackSet.delete(callback)
  }
}

function execute(trackStore: ITrackStore, key: string | symbol, value: any) {
  const trackSet = trackStore[key]
  if (!trackSet) return

  for (const item of trackSet) {
    item(value)
  }
}

function proxyStore<S, A>(instance: IInstance<S, A>, storeApi: IStoreApi) {
  const { state, actions } = instance

  return new Proxy(instance, {
    get(_, prop) {
      if (Object.hasOwn(storeApi, prop)) {
        return storeApi[prop]
      } else if (Object.hasOwn(state, prop)) {
        return state[prop]
      } else if (Object.hasOwn(actions, prop)) {
        return actions[prop]
      } else {
        throw new Error('没有该属性或方法')
      }
    },
    set(_, prop, value) {
      if (Object.hasOwn(storeApi, prop)) {
        throw new Error('系统方法不允许设置')
      } else if (Object.hasOwn(state, prop)) {
        return (state[prop] = value)
      } else if (Object.hasOwn(actions, prop)) {
        throw new Error('actions, 该方法不允许直接设置')
      } else {
        throw new Error('请在创建 Store 时添加到 State 或 Actions 中')
      }
    },
  })
}

function proxyState(
  targetObj: any,
  trackStore: ITrackStore,
  isRawState: boolean,
  rootKey: string | null = null
) {
  return new Proxy(targetObj, {
    set(target, prop, value) {
      if (isRawState) {
        if (!Object.hasOwn(target, prop)) return false
      } else if (target[prop] === value) {
        return false
      }

      if (!isRawState && typeof value === 'object') {
        const proxyRes = proxyState(value, trackStore, false, rootKey)
        target[prop] = proxyRes
        recursionProxyObj(proxyRes, trackStore, false)
      } else {
        target[prop] = value
      }

      if (inDeepPorxy) return true

      if (isRawState) {
        execute(trackStore, prop, value)
      } else {
        execute(trackStore, rootKey ?? '', value)
      }

      return true
    },
  })
}

let currentRootKey: string | null = null
function recursionProxyObj(
  target: any,
  trackStore: ITrackStore,
  isRoot = false
) {
  inDeepPorxy = true

  for (const key in target) {
    const value = target[key]
    if (typeof value === 'object') {
      if (isRoot) {
        currentRootKey = key
      }

      const proxyRes = proxyState(value, trackStore, false, currentRootKey)
      target[key] = proxyRes
      recursionProxyObj(proxyRes, trackStore)

      if (isRoot) {
        currentRootKey = null
      }
    }
  }

  inDeepPorxy = false
}

function deepProxyState<S, A>(instance: IInstance<S, A>, rawState: S) {
  const { trackStore } = instance

  const store = (instance.state = proxyState(rawState, trackStore, true))

  recursionProxyObj(store, trackStore, true)
}

function createStoreInstance<S, A>(state: S, actions: A) {
  // 创建实例对象
  const instance: IInstance<S, A> = {
    id: instanceId++,
    trackStore: {},
    state: {} as any,
    actions,
  }

  // 实例对象初始化
  // 给 state 进行代理
  deepProxyState<S, A>(instance, state)

  return instance
}

function createStoreApi<S, A>(instance: IInstance<S, A>) {
  const { trackStore } = instance

  const storeApi: IStoreApi = {
    watch: track(trackStore),
    deleteWatch: deleteTrack(trackStore),
  }

  return storeApi
}

function xlStore<S extends IState, A extends IActions>({
  state,
  actions,
}: IStoreArg<S, A>) {
  verifyActions(actions)

  const instance = createStoreInstance<S, A>(state, actions)
  const storeApi = createStoreApi<S, A>(instance)

  const storeProxy = proxyStore<S, A>(instance, storeApi)

  return storeProxy
}
