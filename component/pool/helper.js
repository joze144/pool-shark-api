'use strict'

const Pool = require('./poolModel')

async function handlePoolCreated (event) {
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

  const created = await Pool.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()

  // Check if new entry
  return (created.n && !created.nModified)
}

module.exports = {
  handlePoolCreated
}
