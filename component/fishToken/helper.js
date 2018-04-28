'use strict'

const web3 = require('../web3Provider')
const poolAbi = require('../../contract/Pool.json').abi
const FishTokenContract = require('./contractModel')
// const FishTokenData = require('./parsedDataModel')
const logger = require('../../config/logger')

async function handleTransferEvent (event) {
  logger.info('Fish token transfer event')
  logger.info(event)
}

async function handleIssueTokensEvent (event) {
  logger.info('Fish token issue tokens event')
  logger.info(event)
}

async function handleNewSharkEvent (event) {
  logger.info('Fish token new shark event')
  logger.info(event)
}

async function handleTokenCreated (event) {
  const poolAddress = event.returnValues._pool
  const epochDeadline = event.returnValues._deadline
  const blockNumber = event.blockNumber
  const poolContract = new web3.eth.Contract(poolAbi, poolAddress)
  const token = await poolContract.methods.token().call()
  logger.info('Adding Token: ' + token + ' for Pool: ' + poolAddress)

  const query = {
    address: token
  }
  const update = {
    pool_address: poolAddress,
    deadline: new Date(epochDeadline * 1000),
    block_created: blockNumber
  }
  return FishTokenContract.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

module.exports = {
  handleTokenCreated,
  handleTransferEvent,
  handleIssueTokensEvent,
  handleNewSharkEvent
}
