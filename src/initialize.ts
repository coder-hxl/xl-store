import { track, deleteTrack } from './effect'
import { proxyState, deepProxyState } from './proxy'

import {
  IState,
  IActions,
  IStoreOptionsArg,
  IInstance,
  AnyArray,
  AnyObject,
  IStoreArgs,
  IProxyInstanceRes
} from './types'

let instanceId = 0

function handleState<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
>(instance: IInstance<S, A>, rawTarget: AnyArray | AnyObject) {
  const { isDeepWatch } = instance.options

  const proxyStateRes = isDeepWatch
    ? deepProxyState(instance, rawTarget, true)
    : proxyState(instance, rawTarget)

  instance.state = proxyStateRes
}

function handleStoreApi<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
>(instance: IInstance<S, A>) {
  const storeApi = {
    watch: track<S, A>(instance),
    watchEffect: track<S, A>(instance, true),
    deleteWatch: deleteTrack<S, A>(instance)
  }

  instance.storeApi = storeApi
}

export function createInstance<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
>(storeArgs: IStoreArgs<S, A>, options: IStoreOptionsArg = {}) {
  const { state = {}, actions = {} } = storeArgs

  // 创建实例对象
  const instance: IInstance<S, A> = {
    id: instanceId++,
    trackStore: {},
    storeApi: {},
    state: {},
    actions,
    options
  }

  handleStoreApi(instance)
  handleState<S, A>(instance, state)

  return instance
}
