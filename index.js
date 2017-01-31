'use strict'

const API = require('@parity/parity.js').Api
const co = require('co')
const reduce = require('p-reduce')
const digestRegistryEvents = require('./digest-registry-events')

const api = new API(new API.Transport.Http('http://localhost:8545'))
const abi = require('./old-abi.json')

co.wrap(function* () {
  const network = yield api.parity.netChain()
  console.info('chain:', network)
  const block = yield api.eth.blockNumber()
  console.info('current block:', +block)
  const address = yield api.parity.registryAddress()
  console.info('registry address:', address)

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
  process.stdout.write(JSON.stringify(data) + '\n')
  process.exit(0)
})()
.catch((err) => {
  console.error(err)
  process.exit(1)
})
