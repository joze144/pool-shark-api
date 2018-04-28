'use strict'

const CronJob = require('node-cron')
const parser = require('./parser')
const config = require('../config/main')

CronJob.schedule('* * * * *', async () => {
  if (!config.parsing_active) {
    return
  }
  await parser.runParser()
})

async function isActive () {
  return config.parsing_active
}

module.exports = {
  isActive
}
