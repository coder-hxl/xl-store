# xl-store

自编写的状态管理仓库, 目前只支持 ESModule

## 安装

使用 NPM: 
```shell
npm install xl-store
```

使用 Yarn:
```shell
yarn add xl-store
```

使用 PNPM：
```shell
pnpm add xl-store
```

## 使用

```JavaScript
// 1.导入 xlStore
import xlStore from 'xlStore'

// 2.使用
const myStore = xlStore({
  state: {
    // 存放数据
    info: {}
  },
  actions: {
    // 存放函数
    getInfo(id, name, age) {
      this.info = { id, name, age }
    }
  }
})

function infoCallback(value) {
  console.log('watch-info', value)
}

// 观察, 当 info 数据发生改变会执行 infoCallback 回调函数
myStore.watch('info', infoCallback)

myStore.getInfo(1, 'hxl', 18)

// 删掉观察, 下次 info 数据发生改变不会执行 infoCallback 回调函数
myStore.deleteWatch('info', infoCallback)

myStore.getInfo(2, 'code', 18)
```
