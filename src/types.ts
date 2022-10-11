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
  state?: IState
  actions?: A & IActions & ThisType<S & A & IStoreApi>,
}

interface IStoreOptionsArg {
  sameValueExecuteWatch?: boolean
}

type ITrackStore = {
  [key: string]: Set<Function>
}

interface IInstance {
  id: number
  trackStore: ITrackStore
  state: IState
  actions: IActions,
  options: IStoreOptionsArg
}

interface IStoreApi {
  watch(key: string | string[], callback: Function): any
  watchEffect(key: string | string[], callback: Function): any
  deleteWatch(key: string | string[], callback: Function): any
  [key: string]: any
}

export { IObject, IArray, IState, IActions, IStoreArg, IStoreOptionsArg, ITrackStore, IInstance, IStoreApi }
