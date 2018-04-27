'use strict'

const _ = require('underscore')
const Promise = require('bluebird')
const web3 = require('../web3Provider')
const contract = require('../../contract/iFishToken.json')
const helper = require('./helper')

const FishTokenEvent = require('./Events')

function FishTokenParser(contractAddress, deadline) {
  this.contractAddress = contractAddress
  this.contractInstance = new web3.eth.Contract(contract.abi, contractAddress)
}

FishTokenParser.prototype.finalize = async function finalize() {
  const nowEpoch = Math.floor(new Date() / 1000)
  if (nowEpoch <= this.deadline) {
    return
  }


}

FishTokenParser.prototype.parseBlocks = async function parseBlocks(from, to) {
  const events = await this.contractInstance.getPastEvents({from, to})
  const promises = _.map(events, (obj) => {
    return handleEvent(obj)
  })

  await Promise.all(promises)
}

async function handleEvent(event) {
  switch(event.event) {
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
