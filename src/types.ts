interface IObject extends Object {
  [key: string]: any
}
interface IArray extends Array<any> {
  [key: string]: any
}

interface IState extends Object {
  [key: string]: any
}

interface IActions extends Object {
  [key: string]: Function
}

interface IStoreArg<S, A> {
  state: IState
  actions: A & IActions & ThisType<S & A & IStoreApi>
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

export { IObject, IArray, IState, IActions, IStoreArg, ITrackStore, IInstance, IStoreApi }
