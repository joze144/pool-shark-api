'use strict'

const config = require('../config/main')
const contractHelper = require('./eventParser/contract/helper')
const ContractType = require('./eventParser/contract/Types')

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
