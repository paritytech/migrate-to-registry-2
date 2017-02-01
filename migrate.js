'use strict'

const fs = require('fs')
const path = require('path')
const co = require('co')
const api = require('./lib/api')
const {fromWei} = require('@parity/parity.js').Api.util
const postToContract = require('./lib/post-to-contract')
const waitForConfirmations = require('./lib/wait-for-confirmations')

const abi = JSON.parse(fs.readFileSync(path.join(__dirname, 'contracts/SimpleRegistry.abi'), {encoding: 'utf8'}))
const reserve = abi.find((item) => item.name === 'reserve')
const setData = abi.find((item) => item.name === 'setData')

const migrate = co.wrap(function* (registryAddress, registryOwner, data) {
  const {names} = data // todo: reverses, proposedReverses

  const registry = api.newContract(abi, registryAddress)
  const fee = yield registry.instance.fee.call({}, [])
  console.info('fee is', fromWei(fee).toNumber(), 'ETH')

  for (let nameHash in names) {
    const {data} = names[nameHash] // todo: owner

    const tx1 = yield postToContract(registryOwner, registryAddress, reserve, [nameHash], fee)
    yield waitForConfirmations(tx1)
    console.info('registered', nameHash, '–', tx1)

    for (let key in data) {
      const value = data[key]

      const tx = yield postToContract(registryOwner, registryAddress, setData, [nameHash, key, value])
      yield waitForConfirmations(tx)
      console.info('\t', key, '->', value, '–', tx)
    }
  }
})

module.exports = migrate
