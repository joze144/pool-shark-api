'use strict'

const _ = require('underscore')
const web3 = require('../../web3Provider')
const contract = require('../../../contract/PoolSharkApp.json')
const poolHelper = require('../../pool/helper')
const fishTokenHelper = require('../fishTokenParser/helper')
const poolListHelper = require('../../poolList/helper')
const tokenHoldersHelper = require('../../tokenHolders/helper')
const AppEvents = require('./Events')

function AppParser (contractAddress, fromBlock) {
  this.fromBlock = fromBlock
  this.contractInstance = new web3.eth.Contract(contract.abi, contractAddress)
}

AppParser.prototype.parseBlocks = async function parseBlocks () {
  const events = await this.contractInstance.getPastEvents('allEvents', {fromBlock: this.fromBlock})
  return _.map(events, (obj) => {
    return handleEvent(obj)
  })
}

async function handleEvent (event) {
  switch (event.event) {
    case AppEvents.POOL_CREATED:
      const newEntry = await poolHelper.handlePoolCreated(event)
      if (newEntry) {
        await poolListHelper.createPool(event)
        await fishTokenHelper.handleTokenCreated(event)
        return tokenHoldersHelper.createEntryForPoolCreator(event)
      }
      return
    default:
      throw new Error('App event type does not exist!')
  }
}

module.exports = AppParser
