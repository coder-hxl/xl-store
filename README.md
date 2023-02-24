# xl-store

xl-store 是一个可 深浅 观察的状态管理库。

## 特征

- 可深浅观察
- 支持在微信小程序使用
- 用法简单

## 安装

以 NPM 为例:

```shell
npm install xl-store
```

## 示例

```JavaScript
// 1.导入模块 ES/CJS
import xlStore from 'xl-store'

// 2.定义一个仓库
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
  // 深观察, 当 state 的 info 里面的某个属性的值发生改变也会执行收集的依赖
  isDeepWatch: true
})

function infoCallback1(key, value) {
  console.log('watch-info1', key, value)
}

function infoCallback2(key, value) {
  console.log('watch-info2', key, value)
}

// 添加观察(依赖)
myStore.watch('info', infoCallback1)

// 添加观察(依赖), 会先执行一下 infoCallback2
myStore.watchEffect('info', infoCallback2)

// 修改 state 的 info , 改完后会执行 infoCallback1 和 infoCallback2 回调函数
myStore.changeInfoAction(1, 'hxl', 18)

// 删掉观察(依赖)，删除 infoCallback1 回调函数
myStore.deleteWatch('info', infoCallback1)

// 修改 state 的 info , 改完后不会执行 infoCallback1 回调函数， 但会执行 infoCallback2 回调函数
myStore.changeInfoAction(2, 'codehxl', 19)
```

## 核心概念

### xlStore

创建一个仓库。

#### 参数

##### Content

接收两个参数：

- State: Object

  存放需要 管理/共享 的数据。

- Actions: Object

  存放改变 State 数据的函数, 可通过 this 拿到 State 中存放的数据。

##### Options

接收一个参数：

- isDeepWatch: Boolean

  默认为 false ，当 State 中的内部值发生改变也执行收集的依赖（传给 watch 的回调函数）。

### API

仓库的 API 。

#### watch

函数接收两个参数:

- Key: String | String[]

- Callback: Function

对 State 中某个数据开启监听，当数据发生改变时会执行 Callback ，并将 Key 和 NewValue 当作参数传给 Callback 。

#### watchEffect

函数接收两个参数:

- Key: String | String[]

- Callback: Function

与 Watch API 一样，不同的是，其会先立刻执行一次 Callback 。

#### deleteWatch

函数接收两个参数:

- Key: String | String[]

- Callback: Function

删除对 State 中某个数据监听 。
