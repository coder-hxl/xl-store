const xlStore = require('../src/index.js')

const test = xlStore({
  state: {
    info: {
      name: "hxl",
      age: 18,
    },
    teachers: [{ name: "why" }, { name: "pink" }],
  },
  actions: {
    getName(this: any): any {
      return this.info.name
    },
    setTeachers(): any {
      test.teachers = []
    },
  },
})

console.log(test)

test.watch("info", (value: any) => {
  console.log("info", value)
})

test.watch("teachers", (value: any) => {
  console.log("teachers1", value)
})

setTimeout(() => {
  test.info.name = "code"
}, 1000)
