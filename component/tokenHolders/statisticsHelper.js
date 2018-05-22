'use strict'

const _ = require('underscore')
const TokenHolders = require('./tokenHoldersModel')

async function usersStatistics () {
  const aggData = await TokenHolders.aggregate([
    {
      $group: {
        _id: { $toLower: "$user_address" },
        count: { $sum: 1 }
      }
    }
  ]).then()

  const entries = await tokenHoldersEntries()

  if (!aggData) {
    return {
      holders_data: [],
    }
  }

  return {
    holders_data: aggData
  }
}

async function tokenHoldersEntries() {
  const aggData = await TokenHolders.aggregate([
    {
      $group: {
        _id: '$id',
        count: { $sum: 1 }
      }
    }
  ]).then()

  if (!aggData) {
    return {
      entries: 0,
    }
  }

  return {
    entries: aggData[0].count
  }
}

module.exports = {
  tokenHoldersEntries,
  usersStatistics
}
