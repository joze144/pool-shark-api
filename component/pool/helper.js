'use strict'

const Pool = require('./poolModel')
const contractHelper = require('../contract/helper')
const ContractType = require('../contract/Types')

async function handlePoolCreated (event) {
  if (!event.blockNumber || !event.blockHash) {
    return false
  }

  const address = event.returnValues._pool
  const name = event.returnValues._name
  const rate = event.returnValues._rate
  const epochDeadline = event.returnValues._deadline
  const blockNumber = event.blockNumber
  const id = event.id

  const query = {
    address: address
  }

  const update = {
    block_created: blockNumber,
    rate: rate,
    name: name,
    deadline: new Date(epochDeadline * 1000),
    event_id: id
  }

  await contractHelper.addContract(address, ContractType.Pool, blockNumber)
  const created = await Pool.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()

  // Check if new entry
  return (created.n && !created.nModified)
}

module.exports = {
  handlePoolCreated
}
