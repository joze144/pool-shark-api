'use strict'

const Contract = require('./contractModel')
const config = require('../../config/main')

async function addContract (contractAddress, type, creationBlock, removed) {
  if (!creationBlock) {
    creationBlock = config.contract_included_block
  }

  const query = {
    address: contractAddress
  }

  const update = {
    contract_type: type,
    last_checked_block: creationBlock,
    removed: removed
  }

  await Contract.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

async function getContracts (types) {
  const query = {
    removed: false
  }
  if (types) {
    query.contract_type = types
  }

  return Contract.find(query).then()
}

module.exports = {
  addContract,
  getContracts
}
