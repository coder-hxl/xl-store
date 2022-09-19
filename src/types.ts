interface IState {
  [key: string]: any
}

interface IActions {
  [key: string]: Function
}

interface IStoreArg<S = IState, A = IActions> {
  state: S
  actions: A & ThisType<S & A>
}

type ITrackStore = {
  [key: string]: Set<Function>
}

interface IInstance {
  id: number
  trackStore: ITrackStore
  state: IState
  actions: IActions
}

interface IStoreApi {
  watch(key: string, callback: Function): any
  deleteWatch(key: string, callback: Function): any
  [key: string]: any
}

export { IState, IActions, IStoreArg, ITrackStore, IInstance, IStoreApi }
