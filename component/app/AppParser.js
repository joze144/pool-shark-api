'use strict'

const _ = require('underscore')
const Promise = require('bluebird')
const web3 = require('../web3Provider')
const contract = require('../../contract/PoolSharkApp.json')
const helper = require('./helper')
const logger = require('../../config/logger')

const AppEvents = require('./Events')

function AppParser(contractAddress) {
  this.contractAddress = contractAddress
  this.contractInstance = new web3.eth.Contract(contract.abi, contractAddress)
}

AppParser.prototype.parseBlocks = async function parseBlocks(from, to) {
  const events = await this.contractInstance.getPastEvents({from, to})
  const promises = _.map(events, (obj) => {
    return handleEvent(obj)
  })

  try {
    await Promise.all(promises)
  } catch(err) {
    logger.error('Error parsing App event! Contract: ' + this.contractAddress)
    logger.error(JSON.stringify(err))
  }
}

async function handleEvent(event) {
  switch(event.event) {
    case AppEvents.POOL_CREATED:
      await helper.handlePoolCreated(event)
      break
    default:
      throw new Error('App event type does not exist!')
  }
}
