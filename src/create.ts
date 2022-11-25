import { track, deleteTrack } from './effect'
import { deepProxyState } from './proxy'

import { IState, IActions, IStoreOptionsArg, IInstance } from './types'

let instanceId = 0

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
  instance.state = deepProxyState<S, A>(instance, rawState, true)

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
