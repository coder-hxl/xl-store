import { track, deleteTrack } from './effect'
import { proxyState, deepProxyState } from './proxy'

import {
  IState,
  IActions,
  IStoreOptionsArg,
  IInstance,
  AnyArray,
  AnyObject
} from './types'

let instanceId = 0

function handleState<S extends IState, A extends IActions<S, A>>(
  instance: IInstance<S, A>,
  rawTarget: AnyArray | AnyObject
) {
  const { isDeepWatch } = instance.options

  if (isDeepWatch) {
    return deepProxyState(instance, rawTarget, true)
  } else {
    return proxyState(instance, rawTarget)
  }
}

export function createStoreInstance<S extends IState, A extends IActions<S, A>>(
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
  instance.state = handleState<S, A>(instance, rawState)

  return instance
}

export function createStoreApi<S extends IState, A extends IActions<S, A>>(
  instance: IInstance<S, A>
) {
  const storeApi = {
    watch: track<S, A>(instance),
    watchEffect: track<S, A>(instance, true),
    deleteWatch: deleteTrack<S, A>(instance)
  }

  return storeApi
}
