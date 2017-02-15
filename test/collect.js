'use strict'

const sink = require('stream-sink')
const test = require('tape')
const {isHex, isAddressValid} = require('@parity/parity.js').Api.util

const isBytes32 = (v) => isHex(v) && v.length === 2 + 2 * 32
const isNotHex = (s) => s.slice(0, 2) !== '0x'

process.stdin
.pipe(sink())
.then((stdin) => {
  const {names, reverses, proposedReverses} = JSON.parse(stdin)

  test('names should contain valid entries', (t) => {
    t.ok(Object.keys(names).length > 0, 'no names to be migrated')

    for (let nameHash in names) {
      t.ok(isBytes32(nameHash), `name hash ${nameHash}`)
      const {owner, data} = names[nameHash]
      t.ok(isAddressValid(owner), `owner ${owner} of ${nameHash}`)

      if ('A' in data) {
        t.ok(isAddressValid(data.A), `A record ${data.A} of ${nameHash}`)
      }
      if ('IMG' in data) {
        t.ok(isBytes32(data.IMG), `IMG record ${data.IMG} of ${nameHash}`)
      }
      if ('CONTENT' in data) {
        t.ok(isBytes32(data.CONTENT), `CONTENT record ${data.CONTENT} of ${nameHash}`)
      }
    }

    t.end()
  })

  test('reverses should contain valid entries', (t) => {
    t.ok(Object.keys(reverses).length > 0, 'no reverses to be migrated')

    for (let address in reverses) {
      t.ok(isAddressValid(address), `address ${address}`)
      const name = reverses[address]
      t.ok(isNotHex(name), `name ${name} at ${address}`)
    }

    t.end()
  })

  test('proposedReverses should contain valid entries', (t) => {
    for (let address in proposedReverses) {
      t.ok(isAddressValid(address), `address ${address}`)
      const nameHash = proposedReverses[address]
      t.ok(isBytes32(nameHash), `name hash ${nameHash} at ${address}`)
    }

    t.end()
  })
})
.catch((err) => {
  console.error(err)
  process.exit(1)
})
