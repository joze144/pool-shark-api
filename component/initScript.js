'use strict'

const config = require('../config/main')
const contractHelper = require('./contract/helper')
const ContractType = require('./contract/Types')

async function initAppContract() {
  await contractHelper.addContract(config.app_contract_address, ContractType.App, 0)
}

module.exports = {
  initAppContract
}
