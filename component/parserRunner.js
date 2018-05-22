'use strict'

const parser = require('./eventParser/parser')
const transactionParser = require('./transactionParser/parser')
const config = require('../config/main')
const logger = require('../config/logger')

// Parse contract data
setInterval(() => {
  if (!config.parsing_active) {
    return
  }

  parser.runParser().then((result, error) => {
    if (error) {
      logger.error(error)
    } else {
      logger.info('Parsed data successfully ' + new Date().toTimeString())
    }
  })
}, 30000)

// Parse transactions data
setInterval(() => {
  if (!config.parsing_active) {
    return
  }

  transactionParser.transactionParsing().then((result, error) => {
    if (error) {
      logger.error(error)
    } else {
      logger.info('Parsed transaction data successfully ' + new Date().toTimeString())
    }
  })
}, 60000)

async function isActive () {
  return config.parsing_active
}

module.exports = {
  isActive
}
