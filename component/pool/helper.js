'use strict'

const Pool = require('./poolModel')

async function addPool(contractAddress, tokenAddress, deadline, name) {
  const query = {
    address: contractAddress
  }

  const update = {

  }

  await Pool.update(query, {$set: update}, {upsert: true, setDefaultsOnInsert: true}).then()
}

async function updatePoolTotalSupply(contractAddress, totalSupply) {
  const query = {
    address: contractAddress
  }
  const update = {
    collected_eth: totalSupply
  }
  await Pool.update(query, {$set: update}).then()
}

module.exports ={
  addPool,
  updatePoolTotalSupply
}
