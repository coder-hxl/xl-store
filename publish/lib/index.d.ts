interface IState extends Object {
  [key: string]: any
}

interface IActions extends Object {
  [key: string]: Function
}

interface IStoreArg<S, A> {
  state?: IState
  actions?: A & IActions & ThisType<S & A & IStoreApi>
}

interface IStoreApi {
  watch(key: string, callback: Function): any
  deleteWatch(key: string, callback: Function): any
  [key: string]: any
}

export default function xlStore<S, A>(store: IStoreArg<S, A>): S & A & IStoreApi
