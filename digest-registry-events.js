'use strict'

const co = require('co')

const digestRegistryEvents = ({bytesToHex}, registry) =>
  co.wrap(function* (data, log) {
    if (log.event === 'Reserved') {
      const name = bytesToHex(log.params.name.value)
      const owner = log.params.owner.value

      data.names[name] = {owner, data: {}}
    } else if (log.event === 'Transferred') {
      const name = bytesToHex(log.params.name.value)
      const newOwner = log.params.newOwner.value

      data.names[name].owner = newOwner
    } else if (log.event === 'Dropped') {
      const name = bytesToHex(log.params.name.value)

      delete data.names[name]
    } else if (log.event === 'DataChanged') {
      const name = bytesToHex(log.params.name.value)
      const key = log.params.plainKey.value
      // we query the *current* value for the registry here (not the historical),
      // but that's fine since we'll eventually query the last one anyways.
      const value = yield registry.instance.get.call({}, [name, key])

      data.names[name].data[key] = bytesToHex(value)
    } else if (log.event === 'ReverseProposed') {
      const name = bytesToHex(log.params.name.value)
      const address = log.params.reverse.value

      data.proposedReverses[address] = name
    } else if (log.event === 'ReverseConfirmed') {
      const name = bytesToHex(log.params.name.value)
      const address = log.params.reverse.value

      delete data.proposedReverses[address]
      data.reverses[address] = name
    } else if (log.event === 'ReverseRemoved') {
      const address = log.params.reverse.value

      delete data.reverses[address]
    }
    return data
  })

module.exports = digestRegistryEvents
