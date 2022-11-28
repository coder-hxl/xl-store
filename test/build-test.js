// import xlStore from '../publish/lib/index.mjs'
const xlStore = require('../publish/lib/index')

const myStore = xlStore(
  {
    state: {
      count: 0,
      userInfo: {
        name: 'hxl',
        age: 18
      }
    },
    actions: {
      incrementAction() {
        this.count += 1
      },
      changeUserInfoAction(newUserInfo) {
        this.userInfo = newUserInfo
      }
    }
  },
  {
    isDeepWatch: true
  }
)

function getCount(key, value) {
  console.log('getCount', key, value)
}

function getUserInfo(key, value) {
  console.log('getUserInfo', key, value)
}

myStore.watchEffect('count', getCount)
myStore.watchEffect('userInfo', getUserInfo)

console.log('------------------------------')

myStore.incrementAction()
myStore.incrementAction()
myStore.changeUserInfoAction({ name: 'coderhxl', age: 18 })

myStore.deleteWatch('count', getCount)

myStore.incrementAction()
