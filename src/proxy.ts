import { execute } from './effect'

import {
  IState,
  IActions,
  IInstance,
  IStoreApi,
  AnyArray,
  AnyObject,
  IProxyInstanceRes,
  ObjectKey
} from './types'

// inDeepProxy: 防止在 Proxy 过程中触发副作用函数
let inDeepProxy = false
let currentRootKey: null | string = null

export function proxyInstance<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
>(instance: IInstance<S, A>): IProxyInstanceRes<S, A> {
  const { state, actions, storeApi } = instance

  return new Proxy<IProxyInstanceRes<S, A>>(instance as any, {
    get(_, prop: string) {
      if (prop in instance) {
        return instance[prop as ObjectKey<IInstance<S, A>>]
      } else if (prop in storeApi) {
        return storeApi[prop as ObjectKey<IStoreApi<S>>]
      } else if (prop in state) {
        return state[prop]
      } else if (prop in actions) {
        return actions[prop]
      } else {
        throw new Error(`不能获取 ${prop}`)
      }
    },
    set(_, prop: string, value: any) {
      if (prop in instance || prop in storeApi) {
        throw new Error(`${prop} 是 Store 自带的不允许被修改`)
      } else if (prop in state) {
        state[prop as ObjectKey<S | IState>] = value
        return true
      } else if (prop in actions) {
        throw new Error(`${prop} 是 actions , 不允许被修改`)
      } else {
        throw new Error(`${prop} 不允许被修改或添加`)
      }
    }
  })
}

export function proxyState<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
>(
  instance: IInstance<S, A>,
  targetObj: AnyArray | AnyObject,
  rootKey: null | string = null
) {
  const { isDeepWatch } = instance.options

  return new Proxy(targetObj, {
    set(target, prop: string, value) {
      // 值不变就无需执行收集到的依赖
      if (target[prop] === value) return true

      if (isDeepWatch) {
        if (inDeepProxy) {
          target[prop] = value
          return true
        } else if (typeof value === 'object' && value !== null) {
          currentRootKey = rootKey ?? prop
          target[prop] = deepProxyState(instance, value)
          currentRootKey = null
        } else {
          target[prop] = value
        }
      } else {
        target[prop] = value
      }

      execute<S, A>(instance, rootKey ?? prop)

      return true
    }
  })
}

export function deepProxyState<
  S extends IState,
  A extends IActions<IProxyInstanceRes<S, A>>
>(
  instance: IInstance<S, A>,
  rawTarget: AnyArray | AnyObject,
  isRootObj = false
) {
  // 设置根容器
  const rootContainer: AnyArray | AnyObject = Array.isArray(rawTarget) ? [] : {}

  function recursionProxy(
    target: AnyObject | AnyArray,
    upContainer: AnyArray | AnyObject,
    isRoot = false
  ) {
    for (const key in target) {
      const value = target[key]
      if (isRoot) {
        currentRootKey = key
      }

      // 从底层开始逐上进行 proxy
      /*
        1.引用类型
          1.1. 创建容器, 继续递归下去
          1.2. 容器填充结束后进行 proxy 代理, 代理结果赋值给上一个容器

        2.普通类型
          直接赋值给上一个容器
      */
      if (typeof value === 'object' && value !== null) {
        const container = Array.isArray(value) ? [] : {}

        recursionProxy(value, container)
        upContainer[key] = proxyState<S, A>(instance, container, currentRootKey)
      } else {
        upContainer[key] = value
      }

      if (isRoot) {
        currentRootKey = null
      }
    }
  }

  inDeepProxy = true
  recursionProxy(rawTarget, rootContainer, isRootObj)
  inDeepProxy = false

  return proxyState<S, A>(
    instance,
    rootContainer,
    isRootObj ? null : currentRootKey
  )
}
