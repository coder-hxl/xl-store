import { IState, IActions } from './types'

export function verifyActions<S extends IState, A extends IActions<S, A>>(
  actions: IActions<S, A>
) {
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
