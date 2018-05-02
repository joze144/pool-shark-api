'use strict'

const _ = require('underscore')
const web3 = require('../web3Provider')
const contract = require('../../contract/FishToken.json')
const helper = require('./helper')

const FishTokenEvent = require('./Events')

function FishTokenParser (contractAddress, fromBlock) {
  this.fromBlock = fromBlock
  this.contractInstance = new web3.eth.Contract(contract.abi, contractAddress)
}

FishTokenParser.prototype.parseBlocks = async function parseBlocks () {
  const events = await this.contractInstance.getPastEvents('allEvents', {fromBlock: this.fromBlock})
  return _.map(events, (obj) => {
    return handleEvent(obj)
  })
}

async function handleEvent (event) {
  switch (event.event) {
    case FishTokenEvent.TRANSFER:
      return helper.handleTransferEvent(event)
    case FishTokenEvent.NEW_SHARK:
      return helper.handleNewSharkEvent(event)
    case FishTokenEvent.ISSUE:
      return helper.handleIssueTokensEvent(event)
    default:
      throw new Error('Type does not exist')
  }
}

module.exports = FishTokenParser
