'use strict'

const _ = require('underscore')
const Promise = require('bluebird')
const logger = require('../config/logger')
const contractHelper = require('./contract/helper')
const web3 = require('./web3Provider')

const ContractType = require('./contract/Types')
const AppParser = require('./app/AppParser')
const FishTokenParser = require('./fishToken/FishTokenParser')

let parsers = {}

async function createParsers() {
  const contracts = await contractHelper.getContracts([ContractType.FishToken, ContractType.App])

  const promises = _.map(contracts, (obj) => {
    return createParser(obj)
  })

  await Promise.all(promises)
}

async function createParser(contract) {
  switch (contract.contract_type) {
    case ContractType.App:
      const appParser = new AppParser(contract.address)
      parsers[contract.address] = appParser
      break
    case ContractType.FishToken:
      const fishTokenParser = new FishTokenParser(contract.address)
      parsers[contract.address] = fishTokenParser
      break
    default:
      logger.error('Not a valid contract type!')
      throw new Error('Not a valid contract type!')
  }
}

async function getDataForBlocks() {
  const promises = _.map(parsers, (value, key) => {
    return value.parseBlocks()
  })

  await Promise.all(promises)
}

async function runParser() {

  // We will parse data every 2 minutes
  let from = new Date()
  while(from < new Date()) {



    from.setSeconds(from.getSeconds() + 120)
  }
}

module.exports = {
  runParser
}
