'use strict'

const CronJob = require('node-cron')
const parser = require('./parser')
const config = require('../config/main')
const logger = require('../config/logger')

CronJob.schedule('0,30 * * * * *', async () => {
  if (!config.parsing_active) {
    return
  }
  try {
    await parser.runParser()
  } catch (err) {
    logger.error(err)
  }
})

async function isActive () {
  return config.parsing_active
}

module.exports = {
  isActive
}
