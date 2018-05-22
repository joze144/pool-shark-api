'use strict'

const web3 = require('../web3Provider')
const Status = require('./Status')
const Type = require('./Type')
const Transaction = require('./transactionModel')

async function updateTransaction(transaction, creator, type, status, blockNumber) {
  const mappedStatus = await mapStatus(status)

  const query = {
    tx_address: transaction,
    creator_address: creator
  }

  const update = {
    tx_status: mappedStatus
  }

  if (type) update.tx_type = type

  if (blockNumber) update.block_included = blockNumber

  return Transaction.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

async function mapStatus (txStatus) {
  switch (txStatus) {
    case false:
      return Status.FAILED
    case true:
      return Status.SUCCESS
    default:
      return Status.PENDING
  }
}

async function validateType (type) {
  if (!type) {
    return false
  }

  return (type === Type.DEPOSIT || type === Type.WITHDRAW || type === Type.TOKEN_TRANSFER || type === Type.CREATE_POOL)
}

async function getTransactions () {
  const currentBlock = await web3.eth.getBlockNumber()
  const parseFrom = currentBlock - 10000

  const query = {
    $or: [
      {block_included: null},
      {block_included: {$gte: parseFrom}}
    ]
  }

  return Transaction.find(query).then()
}

module.exports = {
  updateTransaction,
  validateType,
  getTransactions,
  mapStatus
}