'use strict'

const poolAbi = require('../../contract/Pool.json').abi
const PoolList = require('./poolListModel')
const web3 = require('../web3Provider')
const fishTokenQueries = require('../fishToken/helperQuery')

async function createPool (event) {
  const address = event.returnValues._pool
  const name = event.returnValues._name
  const rate = event.returnValues._rate
  const epochDeadline = event.returnValues._deadline

  const poolContract = new web3.eth.Contract(poolAbi, address)
  const token = await poolContract.methods.token().call()

  const query = {
    address: address
  }
  const update = {
    token_address: token,
    name: name,
    rate: rate,
    collected_eth: 0,
    points_distributed: 0,
    deadline: parseInt(epochDeadline * 1000)
  }
  return PoolList.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

async function deposit (tokenAddress) {
  const pool = await PoolList.findOne({token_address: tokenAddress}).then()
  if(!pool) return

  const sum = await fishTokenQueries.sumTokenIssue(tokenAddress)
  const rate = pool.rate
  const query = {
    address: pool.address
  }
  const update = {
    points_distributed: web3.utils.fromWei(sum.toString(), 'ether'),
    collected_eth: web3.utils.fromWei(sum.div(rate).toString(), 'ether')
  }
  return PoolList.update(query, {$set: update}).then()
}

async function sharkUpdate (tokenAddress) {
  const shark = await fishTokenQueries.getCurrentShark(tokenAddress)

  const query = {
    token_address: tokenAddress
  }
  const update = {
    current_shark: shark
  }
  return PoolList.update(query, {$set: update}).then()
}

module.exports = {
  createPool,
  deposit,
  sharkUpdate
}
