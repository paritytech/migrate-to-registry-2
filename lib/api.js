'use strict'

const API = require('@parity/parity.js').Api
const api = new API(new API.Transport.Http('http://localhost:8545'))

module.exports = api
