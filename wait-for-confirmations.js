'use strict'

const co = require('co')
const manualRpcCall = require('./manual-rpc-call')
const api = require('./api')
const waitFor = require('p-wait-for')

const blockOfTx = (tx, count = 1) =>
  manualRpcCall({
    method: 'eth_getTransactionReceipt',
    params: [tx]
  })
  .then((data) => data && data.blockNumber ? parseInt(data.blockNumber, 16) : null)

const waitForConfirmations = co.wrap(function* (tx, count = 1) {
  yield waitFor(() => {
    return blockOfTx(tx)
    .then((nr) => !!nr)
  }, 1000)

  const target = (yield blockOfTx(tx)) + count

  yield waitFor(() => {
    return api.eth.blockNumber()
    .then((nr) => nr >= target)
  }, 1000)
})

module.exports = waitForConfirmations
