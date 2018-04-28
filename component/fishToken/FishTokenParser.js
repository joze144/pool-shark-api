'use strict'

const _ = require('underscore')
const Promise = require('bluebird')
const web3 = require('../web3Provider')
const contract = require('../../contract/FishToken.json')
const helper = require('./helper')

const FishTokenEvent = require('./Events')

function FishTokenParser (contractAddress, fromBlock) {
  this.fromBlock = fromBlock
  this.contractAddress = contractAddress
  this.contractInstance = new web3.eth.Contract(contract.abi, contractAddress)
}

FishTokenParser.prototype.parseBlocks = async function parseBlocks () {
  const events = await this.contractInstance.getPastEvents('allEvents', {fromBlock: this.fromBlock})
  const promises = _.map(events, (obj) => {
    return handleEvent(obj)
  })

  await Promise.all(promises)
}

async function handleEvent (event) {
  switch (event.event) {
    case FishTokenEvent.TRANSFER:
      await helper.handleTransferEvent(event)
      break
    case FishTokenEvent.NEW_SHARK:
      await helper.handleNewSharkEvent(event)
      break
    case FishTokenEvent.ISSUE:
      await helper.handleIssueTokensEvent(event)
      break
    default:
      throw new Error('Type does not exist')
  }
}

module.exports = FishTokenParser
