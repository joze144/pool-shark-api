'use strict'

const _ = require('underscore')
const Promise = require('bluebird')
const helper = require('./helper')
const web3 = require('../web3Provider')

async function transactionParsing () {
  const transactions = await helper.getTransactions()

  const promises = _.map(transactions, (obj) => {
    return parseTransaction(obj)
  })

  await Promise.all(promises)
}

async function parseTransaction (transaction) {
  const transactionId = transaction.tx_address
  const creator = transaction.creator_address

  const transactionData = await web3.eth.getTransactionReceipt(transactionId)
  const status = (transactionData && transactionData.status !== 'undefined') ? transactionData.status : null
  const blockNumber = (transactionData && transactionData.blockNumber) ? parseInt(transactionData.blockNumber) : null

  const mappedStatus = await helper.mapStatus(status)

  if (transaction.status !== mappedStatus || blockNumber !== transaction.block_included) {
    return helper.updateTransaction(transactionId, creator, null, status, blockNumber)
  }
}

module.exports = {
  transactionParsing
}
