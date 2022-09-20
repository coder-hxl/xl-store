import xlStore from "../src/index.js"

const myStore = xlStore({
  state: {
    info: {},
  },
  actions: {
    getInfo(id: number, name: string, age: number) {
      this.info = { id, name, age }
    },
  },
})

function infoCallback(value: any) {
  console.log("watch-info", value)
}

myStore.watch("info", infoCallback)

myStore.getInfo(1, "hxl", 18)

myStore.deleteWatch("info", infoCallback)

myStore.getInfo(2, "code", 18)
