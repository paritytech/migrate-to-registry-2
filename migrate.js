'use strict'

const fs = require('fs')
const path = require('path')
const co = require('co')
const sink = require('stream-sink')
const api = require('./api')
const callContract = require('./call-contract')
const waitForConfirmations = require('./wait-for-confirmations')
const abi = JSON.parse(fs.readFileSync(path.join(__dirname, 'contracts/SimpleRegistry.abi'), {encoding: 'utf8'}))
const reserve = abi.find((item) => item.name === 'reserve')
const setData = abi.find((item) => item.name === 'setData')

const registryAddress = '0x05BC2C0f2D182F5401046924C27542727CBB406E'
const registryOwner = '0x00D189b71E5b42a88aa3e83173D4a6926e665336'

const readStdin = () =>
  process.stdin.pipe(sink()).then((data) => data)

co.wrap(function* () {
  const {names, reverses, proposedReverses} = JSON.parse(yield readStdin())

  const registry = api.newContract(abi, registryAddress)

  for (let nameHash in names) {
    const {owner, data} = names[nameHash]

    const tx1 = yield callContract(registryOwner, registryAddress, reserve, [nameHash], 1)
    yield waitForConfirmations(tx1)
    console.info(`registered ${nameHash} – ${tx1}`)

    for (let key in data) {
      const value = data[key]

      const tx = yield callContract(registryOwner, registryAddress, setData, [nameHash, key, value])
      yield waitForConfirmations(tx)
      console.info(`\t${key} -> ${value} – ${tx}`)
    }

    break
  }
})()
.then(() => {
  process.exit(0)
})
.catch((err) => {
  console.error(err)
  process.exit(1)
})
