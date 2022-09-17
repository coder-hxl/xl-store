const xlStore = require('./index.js')

const test = xlStore({
  state: {
    info: {
      name: 'hxl',
      age: 18,
    },
    teachers: [{ name: 'why' }, { name: 'pink' }],
  },
  actions: {
    getName() {
      return this.info.name
    },
    setName() {
      this.info.name = 'code'
    },
  },
})

test.watch('teachers', (value) => {
  console.log(test)
})

setTimeout(() => {
  // test.setName()

  test.teachers.splice(0, 1)
}, 1000)

// setTimeout(() => {
//   // test.info.teachers[2].age = 18
//   test.info.age = 18
// }, 3000)
