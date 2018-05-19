'use strict'

const parser = require('./eventParser/parser')
const config = require('../config/main')
const logger = require('../config/logger')

setInterval(function () {
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

async function isActive () {
  return config.parsing_active
}

module.exports = {
  isActive
}
