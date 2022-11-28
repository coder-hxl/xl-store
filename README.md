# xl-store

状态管理库

## 安装

使用 NPM:

```shell
npm install xl-store
```

使用 Yarn:

```shell
yarn add xl-store
```

使用 PNPM:

```shell
pnpm add xl-store
```

## 核心概念

### Arguments

#### State

存放需要 管理/共享 的数据。

#### Actions

存放改变 State 数据的函数, 可通过 this 拿到 State 中存放的数据。

#### Options

- isDeepWatch: Boolean

  默认为 false ，当 State 中的内部值发生改变也执行收集的依赖（传给 watch 的回调函数）。

### API

#### watch

- Key: String

- Callback: Function

对 State 中某个数据开启监听，当数据发生改变时会执行 Callback ，并将 Key 和 NewValue 当作参数传给 Callback 。

#### watchEffect

- Key: String

- Callback: Function

与 Watch API 一样，不同的是，其会先立刻执行一次 Callback 。

#### deleteWatch

- Key: String

- Callback: Function

删除对 State 中某个数据监听 。

## 使用

```JavaScript
// 1.导入 xlStore
import xlStore from 'xlStore'
// const xlStore = require('xlStore')

// 2.使用
const myStore = xlStore({
  state: {
    // 存放数据
    info: {}
  },
  actions: {
    // 存放改变state的函数
    changeInfoAction(id, name, age) {
      // this指向state
      this.info = { id, name, age }
    }
  }
}, {
  // 当 state 内部值发生改变也执行收集的依赖
  isDeepWatch: true
})

function infoCallback(key, value) {
  console.log('watch-info', key, value)
}

// 添加观察(依赖), 当 info 数据发生改变会执行 infoCallback 回调函数
myStore.watch('info', infoCallback)
// 添加观察(依赖), 会先执行一次 infoCallback , 数据发生改变会执行 infoCallback 回调函数
myStore.watchEffect('info', infoCallback)

myStore.changeInfoAction(1, 'hxl', 18)

// 删掉观察(依赖), 下次 info 数据发生改变不会执行 infoCallback 回调函数
myStore.deleteWatch('info', infoCallback)

myStore.changeInfoAction(2, 'codehxl', 18)
```
