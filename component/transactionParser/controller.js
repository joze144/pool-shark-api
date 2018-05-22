'use strict'

const logger = require('../../config/logger')
const httpStatus = require('http-status-codes')
const web3Provider = require('../web3Provider')
const helper = require('./helper')
const Transaction = require('./transactionModel')

async function addTransaction (req, res) {
  const creator = req.body.address
  const transactionId = req.body.transaction_id
  const transactionType = req.body.transaction_type

  const transaction = await Transaction.find({tx_address: transactionId}).then()

  if (transaction && transaction.length > 0) {
    return res.status(httpStatus.BAD_REQUEST).send({error: 'Transaction already exists!'})
  }

  const validType = await helper.validateType(transactionType)
  if(!validType) {
    return res.status(httpStatus.BAD_REQUEST).send({error: 'Transaction type not supported!'})
  }

  if (!creator || !web3Provider.utils.isAddress(creator)) {
    return res.status(httpStatus.BAD_REQUEST).send({error: 'Address not valid!'})
  }

  try {
    const transactionData = await web3Provider.eth.getTransactionReceipt(transactionId)
    const status = (transactionData && transactionData.status !== 'undefined') ? transactionData.status : null
    const blockNumber = (transactionData && transactionData.blockNumber) ? parseInt(transactionData.blockNumber) : null

    await helper.updateTransaction(transactionId, creator, transactionType, status, blockNumber)
    return res.status(httpStatus.OK).send({message: 'Added transaction: ' + transactionId})
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

async function getTransactions (req, res) {
  const creator = req.body.address
  const types = req.body.types

  const query = {
    creator_address: creator
  }
  if (types && types.length > 0) {
    query.tx_type = {
      $in: types
    }
  }
  const options = {
    page: req.body.page,
    limit: req.body.limit,
    lean: true,
    sort: '-created_at'
  }

  try {
    const transactions = await Transaction.paginate(query, options).then()
    return res.status(httpStatus.OK).json(transactions)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

module.exports = {
  addTransaction,
  getTransactions
}
