import { IState, IActions, IInstance, ObjectKey } from './types'

export function track<S extends IState, A extends IActions<S, A>>(
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

export function deleteTrack<S extends IState, A extends IActions<S, A>>({
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

export function execute<S extends IState, A extends IActions<S, A>>(
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
