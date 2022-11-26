export interface AnyObject extends Object {
  [key: string]: any
}
export interface AnyArray extends Array<any> {
  [key: string]: any
}

/* Store Type */
export type ObjectKey<T> = keyof T

export interface IState extends Object {
  [key: string]: any
}

export interface IActions<T> {
  [key: string]: (this: T, ...args: any) => void
}

export type ITrackStore<S> = {
  [Props in keyof S]?: Set<Function>
}

export interface IStoreApi<S> {
  watch(
    key: ObjectKey<S> | ObjectKey<S>[],
    callback: (key: string, value: any) => any
  ): any
  watchEffect(
    key: ObjectKey<S> | ObjectKey<S>[],
    callback: (key: string, value: any) => any
  ): any
  deleteWatch(
    key: ObjectKey<S> | ObjectKey<S>[],
    callback: (key: string, value: any) => any
  ): any
}

export interface IInstance<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
> {
  id: number
  trackStore: ITrackStore<S>
  storeApi: IStoreApi<S> | AnyObject
  state: S | IState
  actions: A | IActions<IProxyInstanceRes<S, A>>
  options: IStoreOptionsArg
}

export interface IStoreArgs<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
> {
  state?: S
  actions?: A
}

export interface IStoreOptionsArg {
  isDeepWatch?: boolean
}

export type IProxyInstanceRes<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
> = S &
  A &
  IStoreApi<S> & {
    id: number
    trackStore: ITrackStore<S>
  }
