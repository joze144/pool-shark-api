'use strict'

const _ = require('underscore')
const Promise = require('bluebird')
const web3 = require('../web3Provider')
const contract = require('../../contract/PoolSharkApp.json')
const logger = require('../../config/logger')
const poolHelper = require('../pool/helper')
const fishTokenHelper = require('../fishToken/helper')
const AppEvents = require('./Events')

function AppParser (contractAddress, fromBlock) {
  this.contractAddress = contractAddress
  this.fromBlock = fromBlock
  this.contractInstance = new web3.eth.Contract(contract.abi, contractAddress)
}

AppParser.prototype.parseBlocks = async function parseBlocks () {
  const events = await this.contractInstance.getPastEvents('allEvents', {fromBlock: this.fromBlock})
  const promises = _.map(events, (obj) => {
    return handleEvent(obj)
  })

  try {
    await Promise.all(promises)
  } catch (err) {
    logger.error('Error parsing App event! Contract: ' + this.contractAddress)
    logger.error(err)
  }
}

async function handleEvent (event) {
  switch (event.event) {
    case AppEvents.POOL_CREATED:
      const newEntry = await poolHelper.handlePoolCreated(event)
      if (newEntry) {
        await fishTokenHelper.handleTokenCreated(event)
      }
      break
    default:
      throw new Error('App event type does not exist!')
  }
}

module.exports = AppParser
