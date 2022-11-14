# xl-store

自编写的状态管理仓库

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
  // 只要state的值被重新赋值, 就会执行收集到的依赖
  sameValueExecuteWatch: true
})

function infoCallback(key, value) {
  console.log('watch-info', key, value)
}

// 添加观察(依赖), 当 info 数据发生改变会执行 infoCallback 回调函数
myStore.watch('info', infoCallback)

myStore.changeInfoAction(1, 'hxl', 18)

// 删掉观察(依赖), 下次 info 数据发生改变不会执行 infoCallback 回调函数
myStore.deleteWatch('info', infoCallback)

myStore.changeInfoAction(2, 'code', 18)
```
