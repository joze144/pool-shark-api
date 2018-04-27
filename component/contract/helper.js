'use strict'

const ContractTypes = require('./Types')
const Contract = require('./contractModel')
const logger = require('../../config/logger')

async function addContract(contractAddress, type, creationBlock) {
  const query = {
    address: contractAddress
  }

  const update = {
    contract_type: type,
    last_checked_block: creationBlock
  }

  await Contract.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

async function getContracts(types) {
  const query = {}
  if(types) {
    query.contract_type = types
  }

  const contracts = await Contract.findAll(query).then()

  logger.info(JSON.stringify(contracts))
}

module.exports = {
  addContract,
  getContracts
}
