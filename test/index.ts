import xlStore from '../src/index'

const myStore = xlStore(
  {
    state: {
      userInfo: {
        name: 'hxl',
        age: 18
      },
      books: [
        { id: 100, name: 'JS高级程序设计', price: 88 },
        { id: 101, name: 'Vue高级程序设计', price: 99 },
        { id: 102, name: 'React高级程序设计', price: 87 }
      ]
    },
    actions: {
      changeUserInfoAction(newInfo: { name: string; age: number }) {
        this.userInfo = newInfo
      },
      changeBookPriceAction(index: number, price: number) {
        this.books[index].price = price
      }
    }
  },
  {
    isDeepWatch: true
  }
)

function getUserInfo(key: string, value: any) {
  console.log('getUserInfo', key, value)
}

function getBooks(key: string, value: any) {
  console.log('getBooks', key, value)
}

myStore.watchEffect('userInfo', getUserInfo)
myStore.watchEffect('books', getBooks)

console.log('------------------------------')

myStore.changeUserInfoAction({ name: 'coderhxl', age: 18 })
myStore.changeBookPriceAction(0, 66)

