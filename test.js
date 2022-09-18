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
    setTeachers() {
      test.teachers = []
    },
  },
})

test.watch('info', (value) => {
  console.log('info', test.info)
})

test.watch('teachers', (value) => {
  console.log('teachers1', test)
})

function fn(value) {
  console.log('teachers2', test.teachers)
}

test.watch('teachers', fn)

setTimeout(() => {
  // test.info.score = 666
  // test.setName = null
}, 1000)

setTimeout(() => {
  test.deleteWatch('teachers', fn)
  test.setTeachers()
}, 3000)
