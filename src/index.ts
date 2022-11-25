import { createStoreInstance, createStoreApi } from './create'
import { proxyStore } from './proxy'
import { verifyState, verifyActions } from './verify'

import {
  IState,
  IActions,
  IStoreArg,
  IStoreOptionsArg,
  IStoreProxyRes
} from './types'

export default function xlStore<S extends IState, A extends IActions<S, A>>(
  store: IStoreArg<S, A>,
  options: IStoreOptionsArg = {}
): IStoreProxyRes<S, A> {
  const state = store.state ?? ({} as S)
  const actions = store.actions ?? ({} as A)

  verifyState(state)
  verifyActions<S, A>(actions)

  const instance = createStoreInstance<S, A>(state, actions, options)
  const storeApi = createStoreApi<S, A>(instance)

  const proxyStoreRes = proxyStore<S, A>(instance, storeApi)

  return proxyStoreRes
}
