import xlStore from 'xl-store'

interface IUserInfo {
  name: string
  age: number
}

const myStore = xlStore(
  {
    state: {
      userInfo: {
        name: 'hxl',
        age: 18
      }
    },
    actions: {
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

function getUserInfo(key: string, value: IUserInfo) {
  console.log('getUserInfo', key, value)
}

myStore.watchEffect('userInfo', getUserInfo)

myStore.changeUserInfoAction({ name: 'coderhxl', age: 18 })
