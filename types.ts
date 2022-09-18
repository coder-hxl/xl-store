interface IState {
  [key: string | symbol]: any
}

interface IActions {
  [key: string | symbol]: Function
}

interface IStoreArg<S extends IState, A extends IActions> {
  state: S
  actions: A
}

type ITrackStore = {
  [key: string]: Set<Function>
}

interface IInstance<S, A> {
  id: number
  trackStore: ITrackStore
  state: S
  actions: A
}

interface IStoreApi {
  watch(key: string, callback: Function): any
  deleteWatch(key: string, callback: Function): any
}

export { IState, IActions, IStoreArg, ITrackStore, IInstance, IStoreApi }
