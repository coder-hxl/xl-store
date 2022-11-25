import {
  IState,
  IActions,
  IStoreArg,
  IStoreOptionsArg,
  IInstance,
  IStoreApi,
  AnyArray,
  AnyObject,
  IStoreProxy,
  ObjectKey
} from './types'

let instanceId = 0
let inDeepProxy = false
let currentRootKey: null | string = null

function verifyActions<S extends IState, A extends IActions<S, A>>(
  actions: IActions<S, A>
) {
  for (const key in actions) {
    const value = actions[key]

    if (typeof value !== 'function') {
      throw new Error('actions 里只能放函数')
    }
  }
}

function verifyState(state: IState) {
  if (state === null || typeof state !== 'object') {
    throw new Error('state 必须是对象')
  }
}

function track<S extends IState, A extends IActions<S, A>>(
  instance: IInstance<S, A>,
  isEffect = false
) {
  function addSingleTrack(key: ObjectKey<S>, callback: Function) {
    if (isEffect) {
      const value = instance.state[key as string]
      callback(key, value)
    }

    const trackStore = instance.trackStore
    let trackSet = trackStore[key]
    if (!trackSet) {
      trackSet = trackStore[key] = new Set()
    }
    trackSet.add(callback)
  }

  return (target: string | string[], callback: Function) => {
    if (Array.isArray(target)) {
      for (const item of target) {
        addSingleTrack(item, callback)
      }
    } else {
      addSingleTrack(target, callback)
    }
  }
}

function deleteTrack<S extends IState, A extends IActions<S, A>>({
  trackStore
}: IInstance<S, A>) {
  function deleteSingleTrack(key: string, callback: Function) {
    const trackSet = trackStore[key]
    if (!trackSet) return

    trackSet.delete(callback)
  }

  return (target: string | string[], callback: Function) => {
    if (Array.isArray(target)) {
      for (const item of target) {
        deleteSingleTrack(item, callback)
      }
    } else {
      deleteSingleTrack(target, callback)
    }
  }
}

function execute<S extends IState, A extends IActions<S, A>>(
  instance: IInstance<S, A>,
  rootKey: string
) {
  const { trackStore } = instance
  const value = instance.state[rootKey]
  const trackSet = trackStore[rootKey]
  if (!trackSet) return

  for (const item of trackSet) {
    item(rootKey, value)
  }
}

function proxyStore<S extends IState, A extends IActions<S, A>>(
  instance: IInstance<S, A>,
  storeApi: IStoreApi<S>
): IStoreProxy<S, A> {
  const { state, actions } = instance

  const proxyStoreRes = new Proxy<IStoreProxy<S, A>>(instance as any, {
    get(_, prop: any) {
      if (prop in instance) {
        return instance[prop as ObjectKey<IInstance<S, A>>]
      } else if (prop in storeApi) {
        return storeApi[prop as ObjectKey<IStoreApi<S>>]
      } else if (prop in state) {
        return state[prop]
      } else if (prop in actions) {
        return actions[prop]
      } else {
        throw new Error(`不能获取 ${prop}`)
      }
    },
    set(_, prop: string, value) {
      if (prop in storeApi) {
        throw new Error(`${prop} 是 Store 自带的方法不允许被修改`)
      } else if (prop in state) {
        state[prop] = value
        return true
      } else if (prop in actions) {
        throw new Error(`${prop} 是 actions 的方法, 不允许被修改`)
      } else {
        throw new Error(`${prop} 请在创建 Store 时添加到 State 或 Actions 中`)
      }
    }
  })

  return proxyStoreRes
}

function proxyState<S extends IState, A extends IActions<S, A>>(
  instance: IInstance<S, A>,
  targetObj: AnyArray | AnyObject,
  rootKey: null | string = null
) {
  const { isDeepWatch } = instance.options

  return new Proxy(targetObj, {
    set(target, prop: string, value) {
      // 值不变就无需执行收集到的依赖
      if (target[prop] === value) return true

      if (inDeepProxy) {
        target[prop] = value
        return true
      } else if (isDeepWatch && typeof value === 'object' && value !== null) {
        currentRootKey = rootKey ? rootKey : prop
        target[prop] = deepProxyState(instance, value)
        currentRootKey = null
      } else {
        target[prop] = value
      }

      if (rootKey) {
        execute<S, A>(instance, rootKey)
      } else {
        execute<S, A>(instance, prop)
      }

      return true
    }
  })
}

function deepProxyState<S extends IState, A extends IActions<S, A>>(
  instance: IInstance<S, A>,
  rawTarget: AnyArray | AnyObject,
  isRootObj = false
) {
  const { isDeepWatch } = instance.options
  // 设置根容器
  let rootContainer: AnyArray | AnyObject = {}

  if (Array.isArray(rawTarget)) {
    rootContainer = []
  }

  function recursionProxy(
    target: AnyObject | AnyArray,
    upContainer: AnyArray | AnyObject,
    isRoot = false
  ) {
    for (const key in target) {
      const value = target[key]
      if (isRoot) {
        currentRootKey = key
      }

      // 从底层开始逐上进行 proxy
      /*
        1.引用类型
          1.1. 创建容器, 继续递归下去
          1.2. 容器填充结束后进行 proxy 代理, 代理结果赋值给上一个容器

        2.普通类型
          直接赋值给上一个容器
      */
      if (typeof value === 'object' && value !== null) {
        let container = {}

        if (Array.isArray(value)) {
          container = []
        }

        recursionProxy(value, container)
        upContainer[key] = proxyState<S, A>(instance, container, currentRootKey)
      } else {
        upContainer[key] = value
      }

      if (isRoot) {
        currentRootKey = null
      }
    }
  }

  if (isDeepWatch) {
    inDeepProxy = true
    recursionProxy(rawTarget, rootContainer, isRootObj)
    inDeepProxy = false
  } else {
    rootContainer = rawTarget
  }

  return isRootObj
    ? proxyState<S, A>(instance, rootContainer)
    : proxyState<S, A>(instance, rootContainer, currentRootKey)
}

function createStoreInstance<S extends IState, A extends IActions<S, A>>(
  rawState: S,
  actions: A,
  options: IStoreOptionsArg
) {
  // 创建实例对象
  const instance: IInstance<S, A> = {
    id: instanceId++,
    trackStore: {},
    state: {},
    actions,
    options
  }

  // 实例对象初始化
  // 给 state 进行代理
  instance.state = deepProxyState<S, A>(instance, rawState, true)

  return instance
}

function createStoreApi<S extends IState, A extends IActions<S, A>>(
  instance: IInstance<S, A>
) {
  const storeApi = {
    watch: track<S, A>(instance),
    watchEffect: track<S, A>(instance, true),
    deleteWatch: deleteTrack<S, A>(instance)
  }

  return storeApi
}

export default function xlStore<S extends IState, A extends IActions<S, A>>(
  store: IStoreArg<S, A>,
  options: IStoreOptionsArg = {}
): IStoreProxy<S, A> {
  const state = store.state
  const actions = store.actions

  verifyState(state)
  verifyActions<S, A>(actions)

  const instance = createStoreInstance<S, A>(state, actions, options)
  const storeApi = createStoreApi<S, A>(instance)

  const proxyStoreRes = proxyStore<S, A>(instance, storeApi)

  return proxyStoreRes
}
