import xlStore from '../publish/lib/index.mjs'
// const xlStore = require('../publish/lib/index')

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
      changeUserInfoAction() {
        this.userInfo = {
          name: 'coderhxl',
          age: 18
        }
      },
      changeBookPriceAction() {
        this.books[0].price = 99
      }
    }
  },
  {
    isDeepWatch: true
  }
)

function getUserInfo(key, value) {
  console.log('getUserInfo', key, value)
}

function getBooks(key, value) {
  console.log('getBooks', key, value)
}

console.log(myStore.userInfo)
console.log(myStore.books)

myStore.watch('userInfo', getUserInfo)
myStore.watch('books', getBooks)

console.log('------------------------------')

myStore.changeUserInfoAction()
myStore.changeBookPriceAction()
