'use strict'

const {fetch} = require('fetch-ponyfill')()

const manualCall = (body) =>
  fetch('http://localhost:8545/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.assign({
      jsonrpc: '2.0',
      params: [],
      id: Math.round(Math.random() * 1000)
    }, body))
  })
  .then((res) => {
    if (res.ok) return res.json()
    throw new Error('response not ok')
  })
  .then((data) => {
    if (data.error) {
      const err = new Error(data.error.message)
      err.code = data.error.code
      throw err
    }
    return data.result
  })

module.exports = manualCall
