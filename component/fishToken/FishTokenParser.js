'use strict'

const _ = require('underscore')
const Promise = require('bluebird')
const web3 = require('../web3Provider')
const contract = require('../../contract/FishToken.json')
const helper = require('./helper')
const tokenHoldersHelper = require('../tokenHolders/helper')
const poolListHelper = require('../poolList/helper')

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
  const tokenAddress = event.address
  switch (event.event) {
    case FishTokenEvent.TRANSFER:
      const fromAddress = event.returnValues._from
      const toAddress = event.returnValues._to

      await helper.handleTransferEvent(event)

      const p1 = tokenHoldersHelper.updateForUserAndToken(fromAddress, tokenAddress)
      const p2 = tokenHoldersHelper.updateForUserAndToken(toAddress, tokenAddress)

      return Promise.all([p1, p2])
    case FishTokenEvent.ISSUE:
      const issueAddress = event.returnValues._member

      await helper.handleIssueTokensEvent(event)
      const p3 = tokenHoldersHelper.updateForUserAndToken(issueAddress, tokenAddress)
      const p4 = poolListHelper.deposit(tokenAddress)
      return Promise.all([p3, p4])
    case FishTokenEvent.NEW_SHARK:
      await helper.handleNewSharkEvent(event)
      const p5 = tokenHoldersHelper.updateSharkForToken(tokenAddress)
      const p6 = poolListHelper.sharkUpdate(tokenAddress)
      return Promise.all([p5, p6])
    default:
      throw new Error('Type does not exist')
  }
}

module.exports = FishTokenParser
