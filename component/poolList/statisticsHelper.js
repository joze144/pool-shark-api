'use strict'

const PoolList = require('./poolListModel')

async function allPoolsStatistics () {
  const query = {}

  const aggData = await PoolList.aggregate([{
    $match: query
  },
  {
    $group: {
      _id: '$id',
      total_collected_eth: {$sum: '$collected_eth'},
      count: { $sum: 1 }
    }
  }]).then()

  if (!aggData || aggData.length === 0) {
    return {
      pool_count: 0,
      total_collected_eth: 0
    }
  }

  return {
    pool_count: aggData[0].count,
    total_collected_eth: aggData[0].total_collected_eth
  }
}

async function activePoolsStatistics () {
  const query = {
    deadline: {
      $gt: new Date().getTime()
    }
  }

  const aggData = await PoolList.aggregate([{
    $match: query
  },
  {
    $group: {
      _id: '$id',
      total_collected_eth: {$sum: '$collected_eth'},
      count: { $sum: 1 }
    }
  }
  ]).then()

  if (!aggData || aggData.length === 0) {
    return {
      pool_count: 0,
      total_collected_eth: 0
    }
  }

  return {
    pool_count: aggData[0].count,
    total_collected_eth: aggData[0].total_collected_eth
  }
}

async function userStatistics() {

}

module.exports = {
  allPoolsStatistics,
  activePoolsStatistics,
  userStatistics
}
