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

export interface IActions<S extends IState, A extends IActions<S, A>> {
  [key: string]: (this: IStoreProxyRes<S, A>) => any
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

export interface IInstance<S extends IState, A extends IActions<S, A>> {
  id: number
  trackStore: ITrackStore<S>
  state: IState
  actions: A
  options: IStoreOptionsArg
}

export interface IStoreArg<S extends IState, A extends IActions<S, A>> {
  state: S
  actions: A
}

export interface IStoreOptionsArg {
  isDeepWatch?: boolean
}

export type IStoreProxyRes<S extends IState, A extends IActions<S, A>> = S &
  A &
  IStoreApi<S> & {
    id: number
    trackStore: ITrackStore<S>
  }
