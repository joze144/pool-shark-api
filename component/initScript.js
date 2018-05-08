'use strict'

const config = require('../config/main')
const contractHelper = require('./contract/helper')
const ContractType = require('./contract/Types')

async function init () {
  try {
    await contractHelper.addContract(config.app_contract_address, ContractType.App, config.contract_included_block, false, Number.MAX_SAFE_INTEGER)
    return 'Data initialized successfully!'
  } catch (err) {
    throw err
  }
}

module.exports = {
  init
}
