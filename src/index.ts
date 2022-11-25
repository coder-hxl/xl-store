import { track, deleteTrack } from './effect'
import { proxyStore, deepProxyState } from './proxy'

import { verifyState, verifyActions } from './verify'

import {
  IState,
  IActions,
  IStoreArg,
  IStoreOptionsArg,
  IInstance,
  IStoreProxyRes
} from './types'

let instanceId = 0

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
): IStoreProxyRes<S, A> {
  const state = store.state
  const actions = store.actions

  verifyState(state)
  verifyActions<S, A>(actions)

  const instance = createStoreInstance<S, A>(state, actions, options)
  const storeApi = createStoreApi<S, A>(instance)

  const proxyStoreRes = proxyStore<S, A>(instance, storeApi)

  return proxyStoreRes
}
