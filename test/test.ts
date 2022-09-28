import xlStore from "../src/index.js"

const myStore = xlStore({
  state: {
    name: 'hxl',
    age: 18
  },
  actions: {
  },
})

function callback(key: string, value: any) {
  console.log("watch", key, value)
}


myStore.watch(["name", "age"], callback)

myStore.deleteWatch(['name'], callback)

myStore.name = 'code'
myStore.age = 19

