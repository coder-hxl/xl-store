import { IState, IActions, IStoreArgs, IProxyInstanceRes } from './types'

export function verifyActions<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
>(actions: IActions<IProxyInstanceRes<S, A>>) {
  for (const key in actions) {
    const value = actions[key]

    if (typeof value !== 'function') {
      throw new Error('actions 里只能放函数')
    }
  }
}

export function verifyState(state: IState) {
  if (state === null || typeof state !== 'object') {
    throw new Error('state 必须是对象')
  }
}

export function verifyStoreArgs<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
>(storeArg: IStoreArgs<S, A>) {
  const { state = {}, actions = {} } = storeArg

  verifyState(state)
  verifyActions(actions)
}
