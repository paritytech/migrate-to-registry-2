'use strict'

const co = require('co')
const reduce = require('p-reduce')
const digestRegistryEvents = require('./lib/digest-registry-events')
const api = require('./lib/api')
const abi = require('./old-abi.json')

const collect = co.wrap(function* (address) {
  const filterId = yield api.eth.newFilter({
    fromBlock: 0, toBlock: 'latest', address
  })
  const logs = yield api.eth.getFilterLogs(filterId)
  yield api.eth.uninstallFilter(filterId)

  const registry = api.newContract(abi, address)
  const parsed = registry.parseEventLogs(logs)

  const data = yield reduce(parsed, digestRegistryEvents(api.util, registry), {
    names: {}, reverses: {}, proposedReverses: {}
  })

  return data
})

module.exports = collect
