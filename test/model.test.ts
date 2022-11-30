import process from 'process'
import { expect, test } from '@jest/globals'

import { IXlStore } from '../src/types'

const args = process.argv.splice(3)
const model = args[0]

let xlStore: IXlStore
if (model === 'dev') {
  xlStore = require('../src').default
} else if (model === 'pro') {
  xlStore = require('../publish/lib')
}

/* test */
function testWatchAPI() {
  const record = [
    { name: 'count', count: 0, value: null },
    { name: 'message', count: 0, value: null }
  ]

  const myStore = xlStore({
    state: {
      count: 0,
      message: 'Hello World'
    },
    actions: {
      incrementAction() {
        this.count += 1
      },
      changeMessageAction(message: string) {
        this.message = message
      }
    }
  })

  function callback(name: string) {
    return (key: string, value: any) => {
      record.forEach((item) => {
        if (item.name === name) {
          item.count += 1
          item.value = value
        }
      })
    }
  }

  myStore.watch('count', callback('count'))
  myStore.watch('message', callback('message'))

  myStore.incrementAction()
  myStore.incrementAction()
  myStore.changeMessageAction('Hello XlStore')

  return record
}

function testWatchEffectAPI() {
  const record = [
    { name: 'count', count: 0, value: null },
    { name: 'message', count: 0, value: null }
  ]

  const myStore = xlStore({
    state: {
      count: 0,
      message: 'Hello World'
    },
    actions: {}
  })

  function callback(name: string) {
    return (key: string, value: any) => {
      record.forEach((item) => {
        if (item.name === name) {
          item.count += 1
          item.value = value
        }
      })
    }
  }

  myStore.watchEffect('count', callback('count'))
  myStore.watchEffect('message', callback('message'))

  return record
}

function testDeleteWatchAPI() {
  const record = [
    { name: 'count', count: 0, value: null },
    { name: 'message', count: 0, value: null }
  ]

  const myStore = xlStore({
    state: {
      count: 0,
      message: 'Hello World'
    },
    actions: {
      incrementAction() {
        this.count += 1
      },
      changeMessageAction(message: string) {
        this.message = message
      }
    }
  })

  function callback(name: 'count' | 'message') {
    return (key: string, value: any) => {
      record.forEach((item) => {
        if (item.name === name) {
          item.count += 1
          item.value = value
        }
      })
    }
  }

  const countCallback = callback('count')
  const messageCallback = callback('message')
  myStore.watch('count', countCallback)
  myStore.watch('message', messageCallback)

  myStore.incrementAction()
  myStore.changeMessageAction('Hello XlStore')

  myStore.deleteWatch('message', messageCallback)

  myStore.incrementAction()
  myStore.changeMessageAction('Hello CoderHXL')

  return record
}

function testIsDeepWatchOption() {
  let record = {
    name: 'userInfo',
    count: 0,
    value: null
  }

  const myStore = xlStore(
    {
      state: {
        userInfo: {
          name: 'hxl',
          age: 17
        }
      },
      actions: {
        changeUserInfoAgeAction() {
          this.userInfo.age += 1
        }
      }
    },
    {
      isDeepWatch: true
    }
  )

  myStore.watch('userInfo', (key: string, value: any) => {
    record.count += 1
    record.value = value
  })

  myStore.changeUserInfoAgeAction()

  return record
}

test('test watch api', () => {
  expect(testWatchAPI()).toEqual([
    { name: 'count', count: 2, value: 2 },
    { name: 'message', count: 1, value: 'Hello XlStore' }
  ])
})

test('test watchEffect api', () => {
  expect(testWatchEffectAPI()).toEqual([
    { name: 'count', count: 1, value: 0 },
    { name: 'message', count: 1, value: 'Hello World' }
  ])
})

test('test deleteWatch api', () => {
  expect(testDeleteWatchAPI()).toEqual([
    { name: 'count', count: 2, value: 2 },
    { name: 'message', count: 1, value: 'Hello XlStore' }
  ])
})

test('test isDeepWatch option', () => {
  expect(testIsDeepWatchOption()).toEqual({
    name: 'userInfo',
    count: 1,
    value: { name: 'hxl', age: 18 }
  })
})
