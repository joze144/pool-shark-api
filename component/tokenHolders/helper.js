'use strict'

const Web3 = require('web3')
const Promise = require('bluebird')
const utils = new Web3().utils
const TokenHolders = require('./tokenHoldersModel')
const fishTokenHelperQuery = require('../eventParser/fishTokenParser/helperQuery')
const tokenHelper = require('../eventParser/fishTokenParser/helper')

async function updateForUserAndToken (userAddress, tokenAddress) {
  const sum = await fishTokenHelperQuery.sumUserAndToken(userAddress, tokenAddress)

  const query = {
    user_address: userAddress,
    token_address: tokenAddress
  }
  const update = {
    token_amount: utils.fromWei(sum.toString(), 'ether')
  }
  return TokenHolders.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

async function updateSharkForToken (tokenAddress) {
  const sharkAddress = await fishTokenHelperQuery.getCurrentShark(tokenAddress)
  if (!sharkAddress) {
    return
  }

  const setQuery = {
    user_address: sharkAddress,
    token_address: tokenAddress
  }
  const setUpdate = {
    is_shark: true
  }
  const setPromise = TokenHolders.update(setQuery, {$set: setUpdate}).then()

  const unsetQuery = {
    user_address: {$ne: sharkAddress},
    token_address: tokenAddress
  }
  const unsetUpdate = {
    is_shark: false
  }
  const unsetPromise = TokenHolders.update(unsetQuery, {$set: unsetUpdate}).then()

  return Promise.all([setPromise, unsetPromise])
}

async function createEntryForPoolCreator (event) {
  const poolAddress = event.returnValues._pool
  const creator = event.returnValues._creator

  const token = await tokenHelper.getTokenForPool(poolAddress)
  const tokenAddress = token.address
  const query = {
    user_address: creator,
    token_address: tokenAddress
  }

  const entry = await TokenHolders.findOne(query).then()

  if (!entry) {
    const update = {
      token_amount: 0
    }

    return TokenHolders.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
  }
}

module.exports = {
  updateForUserAndToken,
  updateSharkForToken,
  createEntryForPoolCreator
}
