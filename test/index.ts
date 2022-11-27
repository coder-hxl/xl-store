import xlStore from '../src/index'

interface IUserInfo {
  name: string
  age: number
}

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
      changeUserInfoAction(newUserInfo: IUserInfo) {
        this.userInfo.name = newUserInfo.name
        // this.userInfo = newUserInfo
      }
    }
  },
  {
    isDeepWatch: true
  }
)

function getCount(key: string, value: number) {
  console.log('getCount', key, value)
}

function getUserInfo(key: string, value: IUserInfo) {
  console.log('getUserInfo', key, value)
}

myStore.watchEffect('count', getCount)
myStore.watchEffect('userInfo', getUserInfo)

console.log('------------------------------')

myStore.incrementAction()
myStore.incrementAction()

myStore.changeUserInfoAction({ name: 'coderhxl', age: 18 })
