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

export interface IActions extends Object {
  [key: string]: Function
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

export interface IInstance<S extends IState, A extends IActions> {
  id: number
  trackStore: ITrackStore<S>
  state: IState
  actions: A & ThisType<IStoreProxy<S, A>>
  options: IStoreOptionsArg
}

export interface IStoreArg<S extends IState, A extends IActions> {
  state: S
  actions: A & ThisType<IStoreProxy<S, A>>
}

export interface IStoreOptionsArg {
  isDeepWatch?: boolean
}

export type IStoreProxy<S extends IState, A extends IActions> = S &
  A &
  IStoreApi<S> & {
    id: number
    trackStore: ITrackStore<S>
  }
