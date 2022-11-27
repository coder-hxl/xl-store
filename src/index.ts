import { verifyStoreArgs } from './verify'
import { createInstance } from './initialize'
import { proxyInstance } from './proxy'

import {
  IState,
  IActions,
  IStoreArgs,
  IStoreOptionsArg,
  IProxyInstanceRes
} from './types'

function xlStore<S extends IState, A extends IActions<IProxyInstanceRes<S, A>>>(
  storeArgs: IStoreArgs<S, A>,
  options?: IStoreOptionsArg
): IProxyInstanceRes<S, A> {
  verifyStoreArgs<S, A>(storeArgs)

  const instance = createInstance<S, A>(storeArgs, options)

  const proxyInstanceRes = proxyInstance<S, A>(instance)

  return proxyInstanceRes
}

module.exports = xlStore
