import xlStore from "../src/index.js"

const myStore = xlStore({
  state: {
    info: {},
  },
  actions: {
    getInfo(id: number, name: string, age: number) {
      this.info = { id, name, age }
    },
    setId(id: number) {
      this.info.id = id
    }
  },
}, {
  sameValueExecuteWatch: true
})

function infoCallback(key: string, value: any) {
  console.log("watch-info", key, value)
}

myStore.watch("info", infoCallback)

myStore.getInfo(1, "hxl", 18)
myStore.setId(1)

myStore.deleteWatch("info", infoCallback)

myStore.getInfo(2, "code", 18)
