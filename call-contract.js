'use strict'

const {encodeMethodCallAbi, toWei} = require('@parity/parity.js').Api.util
const manualRpcCall = require('./manual-rpc-call')

const postToContract = (from, to, method, params = [], value = 0) =>
  manualRpcCall({
    method: 'eth_sendTransaction',
    params: [{
      from, to: to,
      value: '0x' + toWei(value).toString(16),
      data: encodeMethodCallAbi(method, params)
    }]
  })

module.exports = postToContract
