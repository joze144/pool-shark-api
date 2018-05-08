'use strict'

const Web3 = require('web3')
const Promise = require('bluebird')
const utils = new Web3().utils
const TokenHolders = require('./tokenHoldersModel')
const fishTokenHelperQuery = require('../fishToken/helperQuery')
const PoolList = require('../poolList/poolListModel')

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
  if(!sharkAddress) {
    return
  }

  const setQuery = {
    user_address: sharkAddress,
    token_address: tokenAddress
  }
  const setUpdate = {
    is_shark: true
  }
  const setPromise =  TokenHolders.update(setQuery, {$set: setUpdate}).then()

  const unsetQuery = {
    user_address: {$ne: sharkAddress},
    tokenAddress: tokenAddress
  }
  const unsetUpdate = {
    is_shark: false
  }
  const unsetPromise =  TokenHolders.update(unsetQuery, {$set: unsetUpdate}).then()

  return Promise.all([setPromise, unsetPromise])
}

module.exports = {
  updateForUserAndToken,
  updateSharkForToken
}
