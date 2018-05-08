'use strict'

const Pool = require('./poolModel')
const contractHelper = require('../contract/helper')
const ContractType = require('../contract/Types')

async function handlePoolCreated (event) {
  const address = event.returnValues._pool
  const name = event.returnValues._name
  const rate = event.returnValues._rate
  const epochDeadline = event.returnValues._deadline
  const blockNumber = event.blockNumber
  const id = event.id
  let removed = false
  if (event.removed) removed = true

  const query = {
    address: address
  }

  let deadline = parseInt(epochDeadline * 1000);
  const update = {
    block_created: blockNumber,
    removed: removed,
    rate: rate,
    name: name,
    deadline: deadline,
    event_id: id
  }

  if (blockNumber) {
    await contractHelper.addContract(address, ContractType.Pool, blockNumber, removed, deadline)
  }
  const created = await Pool.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()

  // Check if new entry
  return (created.n && !created.nModified)
}

module.exports = {
  handlePoolCreated
}
