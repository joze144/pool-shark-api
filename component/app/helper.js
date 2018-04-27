'use strict'

const logger = require('../../config/logger')

async function handlePoolCreated(event) {
  logger.info(JSON.stringify(event))
}

module.exports = {
  handlePoolCreated
}
