'use strict'

const web3 = require('../web3Provider')
const abi = require('../../contract/iFishToken.json').abi
const FishTokenContract = require('./contractModel')
const FishTokenData = require('./parsedDataModel')
const logger = require('../../config/logger')

async function handleTransferEvent(event) {
  logger.info('Fish token transfer event')
  logger.info(event)
}

async function handleIssueTokensEvent() {
  logger.info('Fish token issue tokens event')
  logger.info(event)
}

async function handleNewSharkEvent() {
  logger.info('Fish token new shark event')
  logger.info(event)
}

async function addContract(contractAddress) {

  const query = {
    address: contractAddress
  }

  const contract = new web3.eth.Contract(abi, contractAddress)

  contract.methods.deadline()

  const update = {

  }

  return await FishTokenContract.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

module.exports = {
  handleTransferEvent,
  handleIssueTokensEvent,
  handleNewSharkEvent,
  addContract
}
