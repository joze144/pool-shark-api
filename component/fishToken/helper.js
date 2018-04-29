'use strict'

const web3 = require('../web3Provider')
const poolAbi = require('../../contract/Pool.json').abi
const FishTokenContract = require('./contractModel')
const FishTokenData = require('./parsedDataModel')
const logger = require('../../config/logger')
const contractHelper = require('../contract/helper')
const ContractType = require('../contract/Types')
const Event = require('./Events')

async function handleTransferEvent (event) {
  if (!event.blockNumber || !event.blockHash) {
    return
  }

  const address = event.address
  const txHash = event.transactionHash
  const signature = event.signature
  const id = event.id
  const blockNumber = event.blockNumber
  let removed = false
  if(event.removed) removed = true

  const fromAddress = event.returnValues._from
  const toAddress = event.returnValues._to
  const amount = event.returnValues._value

  const query = {
    log_id: id,
    contract_address: address
  }
  const update = {
    tx_hash: txHash,
    signature: signature,
    type: Event.TRANSFER,
    block_number: blockNumber,
    removed: removed,
    from_address: fromAddress,
    to_address: toAddress,
    amount_wei: amount
  }
  return FishTokenData.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

async function handleIssueTokensEvent (event) {
  if (!event.blockNumber || !event.blockHash) {
    return
  }

  const address = event.address
  const txHash = event.transactionHash
  const signature = event.signature
  const id = event.id
  const blockNumber = event.blockNumber
  const issueAddress = event.returnValues._member
  const issueWeiValue = event.returnValues._value
  let removed = false
  if(event.removed) removed = true

  const query = {
    log_id: id,
    contract_address: address
  }
  const update = {
    tx_hash: txHash,
    signature: signature,
    type: Event.TRANSFER,
    block_number: blockNumber,
    removed: removed,
    to_address: issueAddress,
    amount_wei: issueWeiValue
  }
  return FishTokenData.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

async function handleNewSharkEvent (event) {
  if (!event.blockNumber || !event.blockHash) {
    return
  }

  const address = event.address
  const txHash = event.transactionHash
  const signature = event.signature
  const id = event.id
  const blockNumber = event.blockNumber
  let removed = false
  if(event.removed) removed = true

  const shark = event.returnValues._shark
  const sharkAmount = event.returnValues._value

  const query = {
    log_id: id,
    contract_address: address
  }
  const update = {
    tx_hash: txHash,
    signature: signature,
    type: Event.TRANSFER,
    block_number: blockNumber,
    removed: removed,
    shark_address: shark,
    shark_amount_wei: sharkAmount
  }
  return FishTokenData.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
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

  await contractHelper.addContract(token, ContractType.FishToken, blockNumber)

  return FishTokenContract.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

module.exports = {
  handleTokenCreated,
  handleTransferEvent,
  handleIssueTokensEvent,
  handleNewSharkEvent
}
